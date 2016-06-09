import asyncio
from aiohttp import web
from aiopg.sa import create_engine

import models
import views

dsn = 'postgres://martin@127.0.0.1:5432/webapp'
loop = asyncio.get_event_loop()
app = web.Application(loop=loop)
app['engine'] = loop.run_until_complete(create_engine(dsn, loop=loop))
index_resource = app.router.add_resource('/', name='index')
index_resource.add_route('GET',views.hello)
