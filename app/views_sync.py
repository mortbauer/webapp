import json
from aiohttp import web

from . import models
from .utils.serialize import json_response, dump_datetime
from .utils import auth


async def get_token(request):
    incoming = await request.json()
    if incoming and 'email' in incoming and 'password' in incoming:
        with request.app['engine'].begin() as conn:
            user = conn.execute(models.user.select(models.user.c.email==incoming['email'])).first()
        if user and request.app['bcrypt'].check_password(incoming['password'],user['password']):
            data = {'token':auth.generate_token(user,request.app['SECRET_KEY'])}
            return json_response(data)
        else:
            return web.HTTPForbidden()
    else:
        print(incoming)
        return web.HTTPBadRequest()

async def users_get(request):
    users = []
    with request.app['engine'].begin() as conn:
        for row in conn.execute(models.user.select()):
            user = {key:value for key,value in row.items() if key != 'password'}
            users.append(user)
    return json_response(body=json.dumps(users).encode('utf-8'))

async def users_post(request):
    incoming = request.json()
    if incoming and 'email' in incoming and 'password' in incoming:
        ins = models.user.insert()
        with request.app['engine'].begin() as conn:
            try:
                res = conn.execute(ins,[{'email':incoming['email'],'password':incoming['password']}])
            except IntegrityError:
                return jsonify(message="User with that email already exists"), 409
        #return jsonify(id=user.id,token=generate_token(new_user))
        user = {}
        return json_response(body=json.dumps(user).encode('utf-8'))
    else:
        return web.HTTPBadRequest()

async def transactions_get(request):
    transactions = []
    with request.app['engine'].begin() as conn:
        for row in conn.execute(models.transaction.select()):
            d = dict(row)
            d['date'] = dump_datetime(d['date'])
            transactions.append(d)
    data = json.dumps(transactions).encode('utf-8')
    return web.Response(body=data, content_type='application/json')

