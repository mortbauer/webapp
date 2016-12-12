from cerberus import Validator

from . import models
from . import schemas
from .utils.serialize import jsonify, dump_datetime


def register(name,app):
    app['subscriptions'][name] = set()
    app['updates'][name] = []

def broadcast(name,app,updates):
    app['updates'][name].extend(updates)

async def transactions_get(app,kwargs):
    # add_listener('transactions',ws_id)
    transactions = {}
    with app['engine'].begin() as conn:
        for row in conn.execute(models.transaction.select()):
            d = dict(row)
            d['date'] = dump_datetime(d['date'])
            d['id'] = str(d['id'])
            transactions[d['id']] = d
    return transactions

async def transactions_patch(app,kwargs):
    v = Validator(schemas.transaction)
    if v.validate(kwargs):
        update = models.transaction.update().values(kwargs)
        with app['engine'].begin() as conn:
            res = conn.execute(update)
        return {'msg':'updated'}
    else:
        return {'errors':v.errors}


