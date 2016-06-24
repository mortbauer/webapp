import json
from aiohttp import web

from . import models
from .utils.serialize import json_response, dump_datetime


async def get_token(request):
    """ generate the jwt token

    query the db for the user with the specified email address, if found it
    will check if the password is correct and create a jwt token

    """
    incoming = await request.json()
    if incoming and 'email' in incoming and 'password' in incoming:
        with request.app['engine'].begin() as conn:
            user = conn.execute(models.user.select(
                models.user.c.email==incoming['email'])).first()
        if user and request.app['bcrypt'].check_password(
            incoming['password'],user['password']):
            data = {'token':request.app['auth'].generate_token(user)}
            return json_response(data)
        else:
            return web.HTTPForbidden()
    else:
        return web.HTTPBadRequest()

async def users_get(request):
    users = []
    with request.app['engine'].begin() as conn:
        for row in conn.execute(models.user.select()):
            user = dict(row)
            user.pop('password')
            users.append(user)
    return json_response(users)

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

