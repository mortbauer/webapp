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

async def transactions_get(app,ws,batch_size=1000,filter_fields=None):
    # add_listener('transactions',ws_id)

    if filter_fields is not None:
        pass
        # query = models.transaction.select(
            # models.transaction.c.date==kwargs['username'])
    print(batch_size)
    with app['engine'].begin() as conn:
        for i,row in enumerate(conn.execute(models.transaction.select())):
            d = dict(row)
            # d['id'] = str(d['id'])
            d['date'] = dump_datetime(d['date'])
            ws.send_str(json.dumps({
                'msg':'added',
                'collection':'transactions',
                'id':str(d['id']),
                'fields':d,
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


