import json

from cerberus import Validator

from . import models
from . import schemas
from .utils.serialize import jsonify, dump_datetime


def register(name,app):
    app['subscriptions'][name] = set()
    app['updates'][name] = []

def broadcast(name,app,updates):
    app['updates'][name].extend(updates)

async def transactions_get(app,ws,kwargs={},batch_size=1000):
    # add_listener('transactions',ws_id)

    query = models.transaction.select(
        models.transaction.c.date==kwargs['username'])
    with app['engine'].begin() as conn:
        data = {}
        for i,row in enumerate(conn.execute(models.transaction.select())):
            d = dict(row)
            # d['id'] = str(d['id'])
            d['date'] = dump_datetime(d['date'])
            ws.send_str(json.dumps({
                'msg':'added',
                'collection':'transactions',
                'id':str(d['id']),
                'fields':data,
                }))
            if i > 1000:
                break
        
        if len(data):
            ws.send_str(json.dumps({
                'msg':'addedMultiple',
                'collection':'transactions',
                'docs':data,
                }))

async def transactions_patch(app,send,kwargs):
    v = Validator(schemas.transaction)
    if v.validate(kwargs):
        update = models.transaction.update().values(kwargs)
        with app['engine'].begin() as conn:
            res = conn.execute(update)
        return {'msg':'updated'}
    else:
        return {'errors':v.errors}


