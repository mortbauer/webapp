from aiohttp import web

async def hello(request):
    #users = []
    #async with request.app['engine'].acquire() as conn:
        #async for row in conn.execute(models.user_table.select()):
            #users.append(row)
    return web.Response(body=b'Hello, world!', content_type='text/plain')


