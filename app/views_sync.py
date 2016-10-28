import json
import uuid
import asyncio
from aiohttp import web
from aiohttp import MsgType
from cerberus import Validator
from sqlalchemy.exc import IntegrityError

from . import schemas
from . import models
from .utils.serialize import jsonify, dump_datetime


"""
TODO also add a session cookie, since jwt token alone is vulnerable against
xss

"""

resource_state = {
        'ws':{},
        'updates':asyncio.Queue(),
        'listeners':{
            'users':set(),
            'transactions':set(),
            }
        }

def add_update(resource,id):
    resource_state['updates'].put((resource,id))

def add_listener(resource,token):
    resource_state['listeners'][resource].add(token)


async def get_token(request):
    """ generate the jwt token
    query the db for the user with the specified email address, if found it
    will check if the password is correct and create a jwt token
    """
    incoming = await request.json()
    if incoming and 'email' in incoming and 'password' in incoming:
        with request.app['engine'].begin() as conn:
            query = models.user.select(
                models.user.c.email==incoming['email'])
            user = conn.execute(query).first()
        if user and request.app['bcrypt'].check_password(
            incoming['password'],user['password']):
            token = await request.app['auth'].add_user_to_session(user)
            return jsonify(web.Response,{'token':token})
        else:
            return web.HTTPForbidden()
    else:
        return web.HTTPBadRequest()

async def is_token_valid(request):
    incoming = await request.json()
    if incoming and 'token' in incoming:
        if await request.app['auth'].verify_token(incoming['token']):
            return jsonify(web.Response,{'token_is_valid':True})
        else:
            return jsonify(web.Response,{'token_is_valid':False})
    else:
        return web.HTTPBadRequest()

async def user_get(request):
    with request.app['engine'].begin() as conn:
        query = models.user.select(models.user.c.id==request.match_info['id'])
        user = dict(conn.execute(query).first())
        user.pop('password')
    return jsonify(web.Response,{'result':user})

async def users_get(request):
    add_listener('users',request['token'])
    users = []
    with request.app['engine'].begin() as conn:
        for row in conn.execute(models.user.select()):
            user = dict(row)
            user.pop('password')
            users.append(user)
    return jsonify(web.Response,users)

async def users_post(request):
    incoming = await request.json()
    validator = Validator(schemas.user)
    if validator.validate(incoming):
        bcrypt = request.app['bcrypt']
        incoming['password'] = bcrypt.hashed_password(incoming['password'])
        ins = models.user.insert().values(incoming)
        with request.app['engine'].begin() as conn:
            try:
                res = conn.execute(ins)
            except IntegrityError as e:
                return jsonify(
                    web.HTTPConflict,
                    {'message':"User with that username already exists"},
                )
            query = models.user.select(
                models.user.c.username==incoming['username'])
            user = conn.execute(query).first()
        data = {
            'id':user.id,
            'token':request.app['auth'].generate_token(user),
        }
        add_update('users',user.id)
        return jsonify(web.Response,data)
    else:
        return jsonify(web.HTTPBadRequest,{'errors':validator.errors})

async def transactions_get(request):
    add_listener('transactions',request['token'])
    transactions = {}
    with request.app['engine'].begin() as conn:
        for row in conn.execute(models.transaction.select()):
            d = dict(row)
            d['date'] = dump_datetime(d['date'])
            d['id'] = str(d['id'])
            transactions[d['id']] = d
    return jsonify(web.Response,transactions)

async def update_loop():
    while True:
        resource,id_ = await resource_state['updates'].get() 
        print(resource,id)

async def handle_sub(ws_id, data):
    v = Validator(schemas.sub,allow_unknown=True)
    if v.validate(data):
        store


async def rpc_router_middleware(app):
    async def middleware_handler(request):
        # determine the endpoint
        return 'the endpoint'
    return middleware_handler
    
async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    ws_id = uuid.uuid1()
    token = None
    ws_middlewares = []
    handler = await rpc_router_middleware(request.app)
    for factory in ws_middlewares:
        handler = await factory(app,handler)
    async for msg in ws:
        if msg.tp == MsgType.text:
            result = await handler(msg.data)
            # data = json.loads(msg.data)
            # if 'msg' in data:
                # for factory in reversed(ws_middlewares):
                    # handler = await factory(app,handler)
                
            # res = await transactions_get_raw(request)
            # ws.send_str(json.dumps({'resource':'transactions','data':res}))
        elif msg.tp == MsgType.error:
            print('ws connection closed with exception %s' % ws.exception())

    print('websocket connection closed')

    return ws
