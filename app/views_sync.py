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

async def handle_sub(app,ws,ws_id,msg):
    v = Validator(schemas.sub,allow_unknown=True)
    if v.validate(msg):
        if msg['name'] in app['publications']:
            collection = app['publications'][msg['name']] 
            collection['subscribers'].add(ws_id)
            await collection['method'](app,ws)
            return {'msg':'ready','subs':msg['id']}
        else:
            return {'msg':'topic %s not available'%collection}
    else:
        return {'errors':v.errors}

async def handle_method(app,ws,msg):
    v = Validator(schemas.rpc)
    if v.validate(msg):
        if msg['method'] in app['endpoints']:
            method = app['endpoints'][msg['method']]['method']
            try:
                res = await method(app,msg['params'])
                return {'id':msg['id'],'result':res} 
            except Exception as e:
                return {'id':msg['id'],'error':e} 
        else:
            return {'id':msg['id'],'error':'no method %s'%msg['method']}
    else:
        return {'error':v.errors}

async def ddp_middleware(app,ws,ws_id):
    async def middleware_handler(msg):
        v = Validator(schemas.ddp,allow_unknown=True)
        if v.validate(msg):
            msg_type = msg['msg']
            if msg_type == 'sub':
                return await handle_sub(app,ws,ws_id,msg)
            elif msg_type == 'method':
                res = await handle_method(app,ws,msg)
                res['msg'] = 'result'
                return res 
        else:
            return {'msg':'error','errors':v.errors}
    return middleware_handler
    
async def websocket_handler(request):
    ws = web.WebSocketResponse()
    await ws.prepare(request)
    ws_id = uuid.uuid1()
    token = None
    app = request.app
    ws_middlewares = []
    handler = await ddp_middleware(app,ws,ws_id)
    for factory in ws_middlewares:
        handler = await factory(app,handler)
    async for msg in ws:
        if msg.tp == MsgType.text:
            print('handling %s'%msg.data)
            result = await handler(json.loads(msg.data))
            if result is not None:
                ws.send_str(json.dumps(result))
        elif msg.tp == MsgType.error:
            print('ws connection closed with exception %s' % ws.exception())
            break
    print('websocket connection closed')
    if ws_id in app['ws']:
        app['ws'].pop(ws_id)
    return ws
