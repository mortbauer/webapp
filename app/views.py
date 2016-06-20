from aiohttp import web

from . import models

async def hello(request):
    #users = []
    #async with request.app['engine'].acquire() as conn:
        #async for row in conn.execute(models.user_table.select()):
            #users.append(row)
    return web.Response(body=b'Hello, world!', content_type='text/plain')

async def users_get(request):
    users = []
    async with request.app['engine'].acquire() as conn:
        async for row in conn.execute(models.user.select()):
            users.append(row)
    print(users)
    return web.Response(body=b'Hello, world!', content_type='text/plain')


