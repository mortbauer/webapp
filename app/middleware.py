from aiohttp import web

async def endpoint_protection(app, handler):
    async def middleware_handler(request):
        if request.path not in app['acls']:
            needed = 'admin'
        if request.headers['Authorization'] != 'admin':
            return web.HTTPForbidden()
        return await handler(request)
    return middleware_handler
