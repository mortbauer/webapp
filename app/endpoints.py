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

async def transactions_get(app,ws,filter_fields=None):

    if filter_fields is not None:
        pass
        # query = models.transaction.select(
            # models.transaction.c.date==kwargs['username'])
    with app['engine'].begin() as conn:
        for i,row in enumerate(conn.execute(models.transaction.select())):
            d = dict(row)
            # d['id'] = str(d['id'])
            d['date'] = dump_datetime(d['date'])
            ws.send_str(json.dumps({
                'msg':'added',
                'collection':'transactions',
                'id':d['id'],
                'fields':d,
                }))
        
async def transactions_patch(app,ws,id,op,field,value,version):
    if field in schemas.transaction:
        v = Validator({field:schemas.transaction[field]})
        if v.validate({field:value}):
            with app['engine'].begin() as conn:
                query = models.transaction.select(models.transaction.c.id==id)
                t = conn.execute(query).fetchone()
                if t is not None and t.version != version:
                    return {'msg':'not updated since wrong version'}
                cmd = models.transaction.update().where(models.transaction.c.id==id).values(field=value)
                conn.execute(cmd)
                return {'msg':'updated sucessfully'}
        else:
            return {'error':'value {0} not allowed for field {1}'.format(value,field)}
    else:
        return {'error':'unknown field %s'%field}

async def transactions_set_order_group(app,ws,id,group_name):
    query = models.order_group.select(models.order_group.c.name==group_name)
    with app['engine'].begin() as conn:
        group = conn.execute(query).fetchone()
        if group is not None:
            cmd = models.transaction.update().where(models.transaction.c.id==id).values(order_group_id=group.id)
            conn.execute(cmd)
            return {'msg':'updated sucessfully'}
        else:
            return {'error':'unknown group %s'%group_name}

async def order_groups_get(app,ws):
    with app['engine'].begin() as conn:
        for i,row in enumerate(conn.execute(models.order_group.select())):
            d = dict(row)
            ws.send_str(json.dumps({
                'msg':'added',
                'collection':'order_groups',
                'id':d['id'],
                'fields':d,
                }))
