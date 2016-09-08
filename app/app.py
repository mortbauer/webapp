import os

import asyncio
import aioredis
import aiohttp_cors
from aiohttp import web
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
    from . import views_sync as views
    from sqlalchemy import create_engine
    engine = create_engine(config.DATABASE_URI)
    kwargs = {'debug':True}
else:
    from . import views
    from aiopg.sa import create_engine
    engine = loop.run_until_complete(create_engine(config.DATABASE_URI, loop=loop))
    kwargs = {}

redis_pool = loop.run_until_complete(aioredis.create_pool(
    (config.REDIS_HOST,config.REDIS_PORT)))

authenticater = Authentication(secret_key=config.SECRET_KEY,expiration=config.TOKEN_EXPIRATION)
authorizer = Authorization(redis_pool,authenticater,devel=config.TESTING)

app = web.Application(middlewares=[authorizer.middleware],**kwargs)

app['settings'] = config
app['engine'] = engine
app['bcrypt'] = Bcrypt(log_rounds=config.BCRYPT_LOG_ROUNDS,prefix=config.BCRYPT_HASH_PREFIX)
app['auth'] = authorizer
app['acls'] = {
        ('/api/user/{id}','GET'):{'owner'},
        ('/api/users','POST'):{'public'},
        ('/api/get_token','POST'):{'public'},
        ('/api/is_token_valid','POST'):{'public'},
    }
app['session'] = {} # for now dict, later user redis

users_resource = app.router.add_resource('/api/users', name='users')
users_resource.add_route('GET',views.users_get)
users_resource.add_route('POST',views.users_post)

user_resource = app.router.add_resource('/api/user/{id}', name='user')
user_resource.add_route('GET',views.user_get)

transactions_resource = app.router.add_resource('/api/transactions', name='transactions')
transactions_resource.add_route('GET',views.transactions_get)

app.router.add_route('POST','/api/get_token',views.get_token)
app.router.add_route('POST','/api/is_token_valid',views.is_token_valid)
app.router.add_route('GET','/api/ws',views.websocket_handler)


# Configure default CORS settings.
cors = aiohttp_cors.setup(app, defaults={
    "*": aiohttp_cors.ResourceOptions(
            allow_credentials=True,
            expose_headers="*",
            allow_headers="*",
        )
})

# Configure CORS on all routes.
added_urls = set()
for route in app.router.routes():
    if not route._resource._name in added_urls:
        added_urls.add(route._resource._name)
        cors.add(route)

# use package alcohol as inspiration for simple rbac
