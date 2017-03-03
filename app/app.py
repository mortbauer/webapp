import os

import asyncio
import aioredis
import aiohttp_cors
from aiohttp import web
from aiohttp.web_urldispatcher import UrlDispatcher

from . import endpoints
from . import schemas
from . import middleware
from .auth import Authorization, Authentication, Bcrypt
from . import views_sync as views

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

authenticater = Authentication(secret_key=config.SECRET_KEY,expiration=config.TOKEN_EXPIRATION)
authorizer = Authorization(authenticater,expiration=config.TOKEN_EXPIRATION)

router = UrlDispatcher()

app = web.Application(middlewares=[authorizer.aiohttp_middleware],router=router,**kwargs)

users_resource = router.add_resource('/api/users', name='users')
users_resource.add_route('GET',views.users_get)
users_resource.add_route('POST',views.users_post)

user_resource = router.add_resource('/api/user/{id}', name='user')
user_resource.add_route('GET',views.user_get)

router.add_route('POST','/api/get_token',views.get_token)
router.add_route('POST','/api/is_token_valid',views.is_token_valid)
router.add_route('GET','/api/ws',views.websocket_handler)



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
app['publications'] = {
    'transactions':{
        'method':endpoints.transactions_get,
        'acls':{'user'},
        'subscribers':set(),
    },
    'order_groups':{
        'method':endpoints.order_groups_get,
        'acls':{'user'},
        'subscribers':set(),
    },
}
app['updates'] = {}
app['endpoints'] = {
        'transactions/patch':{
            'method':endpoints.transactions_patch,
            'schema':schemas.transactions_patch,
            'acls':{'admin'},
            },
        'transactions/set_order_group':{
            'method':endpoints.transactions_set_order_group,
            'schema':schemas.transactions_set_order_group,
            'acls':{'admin'},
            }
}

async def init_app(app):
    redis_pool = await aioredis.create_pool(
            (config.REDIS_HOST,config.REDIS_PORT))
    app['redis'] = redis_pool
    app['auth'].init(redis_pool)

async def close_redis(app):
    app['redis'].close()
    await app['redis'].wait_closed()

app.on_startup.append(init_app)
app.on_cleanup.append(close_redis)
# loop.create_task(views.update_loop())
# use package alcohol as inspiration for simple rbac
