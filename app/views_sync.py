import json
from aiohttp import web

from . import models
from .utils import DateTimeAwareJSONEncoder

async def users_get(request):
    users = []
    with request.app['engine'].begin() as conn:
        for row in conn.execute(models.user.select()):
            user = {key:value for key,value in row.items() if key != 'password'}
            users.append(user)
    data = json.dumps(users).encode('utf-8')
    return web.Response(body=data, content_type='application/json')

async def transactions_get(request):
    transactions = []
    with request.app['engine'].begin() as conn:
        for row in conn.execute(models.transaction.select()):
            transactions.append(dict(row))
    data = json.dumps(transactions,cls=DateTimeAwareJSONEncoder).encode('utf-8')
    return web.Response(body=data, content_type='application/json')

