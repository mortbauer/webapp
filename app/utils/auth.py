import bcrypt
from aiohttp import web
from functools import wraps
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
from itsdangerous import SignatureExpired, BadSignature
from werkzeug.security import safe_str_cmp

from . import serialize

TWO_WEEKS = 1209600
FIVE_SECOND = 5

class Bcrypt:

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
        return safe_str_cmp(hashed_password, bcrypt.hashpw(password,hashed_password))


def generate_token(user,secret_key, expiration=TWO_WEEKS):
    s = Serializer(secret_key, expires_in=expiration)
    token = s.dumps({
        'id': user.id,
        'email': user.email,
    }).decode('utf-8')
    return token


def verify_token(token,secret_key):
    s = Serializer(secret_key)
    try:
        data = s.loads(token)
    except (BadSignature, SignatureExpired):
        return None
    return data


def requires_auth(f):
    bad = json.dumps({'message':"Authentication is required to access this resource"})
    @wraps(f)
    def decorated(request):
        token = request.headers.get('Authorization', None)
        if token:
            string_token = token.encode('ascii', 'ignore')
            user = verify_token(string_token,request.app['SECRET_KEY'])
            if user:
                request.current_user = user
                return f(request)

        return web.HTTPUnauthorized(body=bad)

    return decorated

