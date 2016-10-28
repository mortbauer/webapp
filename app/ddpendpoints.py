
resource_state = {
        'ws':{},
        'updates':asyncio.Queue(),
        'listeners':{
            'transactions':set(),
            }
        }

def add_listener(resource,token):
    resource_state['listeners'][resource].add(token)

async def transactions_sub(app,ws_id,params):
    add_listener('transactions',ws_id)
    transactions = {}
    with app['engine'].begin() as conn:
        for row in conn.execute(models.transaction.select()):
            d = dict(row)
            d['date'] = dump_datetime(d['date'])
            d['id'] = str(d['id'])
            transactions[d['id']] = d
    return transactions

