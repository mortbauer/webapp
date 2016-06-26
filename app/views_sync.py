import json
from aiohttp import web
from cerberus import Validator
from sqlalchemy.exc import IntegrityError

from . import schemas
from . import models
from .utils.serialize import jsonify, dump_datetime


# TODO also add a session cookie, since jwt token alone is vulnerable against
# xss

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
            data = {'token':request.app['auth'].generate_token(user)}
            return jsonify(web.Response,data)
        else:
            return web.HTTPForbidden()
    else:
        return web.HTTPBadRequest()

async def is_token_valid(request):
    incoming = await request.json()
    if incoming and 'token' in incoming:
        try:
            if request.app['auth'].verify_token(incoming['token']):
                return jsonify(web.Response,{'token_is_valid':True})
            else:
                return jsonify(web.Response,{'token_is_valid':False})
        except:
            return web.HTTPBadRequest()
    else:
        return web.HTTPBadRequest()


async def user_get(request):
    with request.app['engine'].begin() as conn:
        query = models.user.select(models.user.c.id==request.match_info['id'])
        user = dict(conn.execute(query).first())
        user.pop('password')
    return jsonify(web.Response,{'result':user})

async def users_get(request):
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
        return jsonify(web.Response,data)
    else:
        return jsonify(web.HTTPBadRequest,{'errors':validator.errors})

async def transactions_get(request):
    transactions = []
    with request.app['engine'].begin() as conn:
        for row in conn.execute(models.transaction.select()):
            d = dict(row)
            d['date'] = dump_datetime(d['date'])
            transactions.append(d)
    return jsonify(web.Response,{'result':transactions})
