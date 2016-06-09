import asyncio
from aiohttp import web
from aiopg.sa import create_engine

import models

async def finish_controller(app):
    print('closing engine')
    engine = app['engine']
    engine.close()
    await engine.wait_closed()

async def hello(request):
    #users = []
    #async with request.app['engine'].acquire() as conn:
        #async for row in conn.execute(models.user_table.select()):
            #users.append(row)
    return web.Response(body=b'Hello, world!', content_type='text/plain')


def make_app(loop=None):
    loop = loop or asyncio.get_event_loop()
    _app = web.Application(loop=loop)
    dsn = 'postgres://martin@127.0.0.1:5432/webapp'
    _app['engine'] = loop.run_until_complete(create_engine(dsn, loop=loop))
    _app.register_on_finish(finish_controller)
    index = _app.router.add_resource('/', name='index')
    index.add_route('GET',hello)
    return _app




if __name__ == '__main__':
    app = make_app()

