import bcrypt
from aiohttp import web
from functools import wraps
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import SignatureExpired, BadSignature
from werkzeug.security import safe_str_cmp

from .utils import serialize
from . import models

class Bcrypt:
    """ add bcrypt to your app

    idea taken from flask-bcrypt
    """
    def __init__(self,prefix=b'2b',log_rounds=12):
        self._log_rounds = log_rounds
        self._prefix = prefix

    def hashed_password(self,password):
        if not password:
            raise ValueError('Password must be non-empty')
        if isinstance(password,str):
            password = bytes(password,'utf-8')

        salt = bcrypt.gensalt(rounds=self._log_rounds, prefix=self._prefix)
        return bcrypt.hashpw(password,salt)

    def check_password(self,password,hashed_password):
        if isinstance(password,str):
            password = bytes(password,'utf-8')
        if isinstance(hashed_password,str):
            hashed_password = bytes(hashed_password,'utf-8')
        return safe_str_cmp(
                hashed_password, bcrypt.hashpw(password,hashed_password))

class Authentication:
    def __init__(self,secret_key,expiration):
        self._secret_key = secret_key
        self._expiration = expiration
        self._serializer = Serializer(
            self._secret_key, expires_in=self._expiration)

    def generate_token(self,user):
        token = self._serializer.dumps({
            'id': user.id,
            'email': user.email,
        }).decode('utf-8')
        return token

    def data_from_token(self,token):
        try:
            data = self._serializer.loads(token)
        except (BadSignature, SignatureExpired):
            return None
        return data

class Authorization:
    def __init__(self,redis_pool,authenticater,devel=False):
        self.devel = devel
        self.authenticater = authenticater
        self.pool = redis_pool

    async def get_user_roles(self,user_id):
        key = 'user_roles::%s'%user_id
        with await self.pool as redis:
            roles = set(await redis.smembers(key))
            roles.add('user')
        return roles

    async def set_user_roles(self,user_id,roles):
        key = 'user_roles::%s'%user_id
        with await self.pool as redis:
            await redis.delete(key)
            await redis.sadd(key,*roles)

    async def get_role_permissions(self,role):
        key = 'role_permissions::%s'%role
        with await self.pool as redis:
            return set(await redis.smembers(key))

    async def set_role_permissions(self,role,permissions):
        key = 'role_permissions::%s'%role
        with await self.pool as redis:
            await redis.delete(key)
            await redis.sadd(key,*permissions)

    async def has_session_permission(self,token,permission):
        with await self.pool as redis:
            return await redis.sismember(
                    'session_permissions::%s'%token,permission)

    async def get_session_permissions(self,token):
        key = 'session_roles::%s'%token
        with await self.pool as redis:
            return await set(redis.smembers('session_permissions::%s'%token))

    async def verify_token(self,token):
        is_correct = False
        user = self.authenticater.data_from_token(token)
        if user is not None:
            key = 'session_permissions::%s'%token
            with await self.pool as redis:
                if await redis.exists(key):
                    is_correct = True
        return is_correct

    async def add_user_to_session(self,user):
        token = self.authenticater.generate_token(user)
        key = 'session_permissions::%s'%token
        roles = await self.get_user_roles(user)
        with await self.pool as redis:
            await redis.delete(key)
            keys = ['role_permissions::%s'%x for x in roles]
            await redis.sunionstore(key,keys[0],*keys[1:])
            # expire in 60 seconds
            await redis.expire(key,60)
        return token

    async def set_session_permissions(self,token,roles):
        key = 'session_permissions::%s'%token
        with await self.pool as redis:
            await redis.delete(key)
            keys = ['role_permissions::%s'%x for x in roles]
            await redis.sunionstore(key,*keys)

    async def middleware(self,app, handler):
        async def fake_middleware_handler(request):
            return await handler(request)
        async def middleware_handler(request):
            allowed = False
            acls = app['acls'].get((request.path,request.method),[])
            if 'public' in acls:
                allowed = True
            elif 'Authorization' in request.headers:
                auth_header = request.headers['Authorization']
                if auth_header.startswith('Bearer '):
                    token = auth_header[7:]
                    if await self.verify_token(token):
                        allowed = True
            if not allowed:
                return web.HTTPForbidden()
            else:
                return await handler(request)
        if self.devel:
            return fake_middleware_handler
        else:
            return middleware_handler
