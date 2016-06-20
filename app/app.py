import asyncio
from aiohttp import web
from aiopg.sa import create_engine

from . import views
from . import config

def make_app(loop,config):
    app = web.Application()
    app['engine'] = loop.run_until_complete(create_engine(config.DSN, loop=loop))
    users_resource = app.router.add_resource('/users', name='users')
    users_resource.add_route('GET',views.users_get)
    return app

if __name__=='__main__':
    loop = asyncio.get_event_loop()
    app = make_app(loop,config)
