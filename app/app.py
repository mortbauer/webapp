import asyncio
from aiohttp import web

from . import config

loop = asyncio.get_event_loop()
app = web.Application()
if config.TESTING:
    from . import views_sync as views
    from sqlalchemy import create_engine
    app['engine'] = create_engine(config.DATABASE_URI)
else:
    from . import views
    from aiopg.sa import create_engine
    app['engine'] = loop.run_until_complete(create_engine(config.DATABASE_URI, loop=loop))
users_resource = app.router.add_resource('/users', name='users')
users_resource.add_route('GET',views.users_get)
