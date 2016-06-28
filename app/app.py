import os

import asyncio
from aiohttp import web
from . import middleware

basedir = os.path.abspath(os.path.dirname(__file__))

from .utils import auth

if os.environ.get('PRODUCTION'):
    from .settings import ProductionConfig
    config = ProductionConfig()
else:
    from .settings import TestingConfig
    config = TestingConfig()


if config.TESTING:
    from . import views_sync as views
    from sqlalchemy import create_engine
    engine = create_engine(config.DATABASE_URI)
    kwargs = {'debug':True}
else:
    from . import views
    from aiopg.sa import create_engine
    loop = asyncio.get_event_loop()
    engine = loop.run_until_complete(create_engine(config.DATABASE_URI, loop=loop))
    kwargs = {}

app = web.Application(middlewares=[middleware.endpoint_protection],**kwargs)
app['settings'] = config
app['engine'] = engine
app['bcrypt'] = auth.Bcrypt(log_rounds=config.BCRYPT_LOG_ROUNDS,prefix=config.BCRYPT_HASH_PREFIX)
app['auth'] = auth.Auth(secret_key=config.SECRET_KEY,expiration=config.TOKEN_EXPIRATION)
app['acls'] = {}

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

