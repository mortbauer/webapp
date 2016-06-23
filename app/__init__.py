import os

import asyncio
from aiohttp import web
from aiohttp_index import IndexMiddleware
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

app = web.Application(middlewares=[IndexMiddleware()],**kwargs)
app['SECRET_KEY'] = config.SECRET_KEY
app['engine'] = engine
app['bcrypt'] = auth.Bcrypt(log_rounds=config.BCRYPT_LOG_ROUNDS,prefix=config.BCRYPT_HASH_PREFIX)
users_resource = app.router.add_resource('/users', name='users')
users_resource.add_route('GET',views.users_get)
transactions_resource = app.router.add_resource('/transactions', name='transactions')
transactions_resource.add_route('GET',views.transactions_get)
app.router.add_route('POST','/api/token',views.get_token)
app.router.add_static('/',path=os.path.join(basedir,'../static'))
