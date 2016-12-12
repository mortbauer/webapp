import os

import asyncio
import aioredis
import aiohttp_cors
from aiohttp import web
from .routes import router
from . import endpoints
from . import middleware
from .auth import Authorization, Authentication, Bcrypt

basedir = os.path.dirname(
        os.path.abspath(os.path.dirname(__file__)))

if os.environ.get('PRODUCTION'):
    from .settings import ProductionConfig
    config = ProductionConfig()
else:
    from .settings import TestingConfig
    config = TestingConfig()

loop = asyncio.get_event_loop()

if config.TESTING:
    from sqlalchemy import create_engine
    engine = create_engine(config.DATABASE_URI)
    kwargs = {'debug':True}
else:
    from aiopg.sa import create_engine
    engine = loop.run_until_complete(create_engine(config.DATABASE_URI, loop=loop))
    kwargs = {}

redis_pool = loop.run_until_complete(aioredis.create_pool(
    (config.REDIS_HOST,config.REDIS_PORT)))

authenticater = Authentication(secret_key=config.SECRET_KEY,expiration=config.TOKEN_EXPIRATION)
authorizer = Authorization(redis_pool,authenticater,expiration=config.TOKEN_EXPIRATION)

app = web.Application(middlewares=[authorizer.aiohttp_middleware],router=router,**kwargs)

app['settings'] = config
app['engine'] = engine
app['bcrypt'] = Bcrypt(log_rounds=config.BCRYPT_LOG_ROUNDS,prefix=config.BCRYPT_HASH_PREFIX)
app['auth'] = authorizer
app['acls'] = {
    ('/api/user/{id}','GET'):{'owner'},
    ('/api/user/{id}','PUT'):{'create_user'},
    ('/api/users','POST'):{'public'},
    ('/api/get_token','POST'):{'public'},
    ('/api/is_token_valid','POST'):{'public'},
    ('/api/ws','GET'):{'public'},
}
app['session'] = {} # for now dict, later user redis
app['ws'] = {}
app['subscriptions'] = {}
app['updates'] = {}
app['endpoints'] = {
        'transactions_get':{'method':endpoints.transactions_get,'acls':{'user'}},
        'transactions_patch':{'method':endpoints.transactions_patch,'acls':{'admin'}},
    }

# loop.create_task(views.update_loop())
# use package alcohol as inspiration for simple rbac
