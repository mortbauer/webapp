import json
import click
import logging
import subprocess
from datetime import datetime

from app.app import app

@click.group()
def run():
    pass

@run.command()
@click.option('-g','--with-gunicorn',is_flag=True)
@click.option('--production',is_flag=True)
def runserver(with_gunicorn,production):
    if not with_gunicorn:
        logging.basicConfig(level=logging.DEBUG)
        import asyncio
        from aiohttp import web
        web.run_app(app,port=5000)
    else:
        if production:
            address = 'unix:my_sock.sock'
        else:
            address = '0.0.0.0:5000'
        subprocess.call([
            'gunicorn','-b',address,'-k','aiohttp.worker.GunicornWebWorker',
            '--reload','-w','1','-t','60','app.app:app','--log-level','DEBUG',
        ])

@run.command()
def create_example_user():
    from app import models
    with app['engine'].begin() as conn:
        with open('users.json','r') as f:
            ins = models.user.insert()
            for data in json.loads(f.read()):
                data['password'] = app['bcrypt'].hashed_password(data['password'])
                try:
                    conn.execute(ins,data)
                except:
                    conn.execute(models.user.update().where(models.user.c.username==data['username']).values(password=data['password']))

@run.command()
def create_example_groups():
    from app import models
    with app['engine'].begin() as conn:
        with open('groups.json','r') as f:
            ins = models.order_group.insert()
            groups = [{'name':x} for x in json.loads(f.read())]
            conn.execute(ins,groups)

@run.command()
def create_example_transactions():
    from app import models
    transactions = []
    with app['engine'].begin() as conn:
        with open('transaction.json','r') as f:
            for data in json.loads(f.read()):
                data['date'] = datetime.fromtimestamp(data['date'])
                data['version'] = 0
                transactions.append(data)
        res = conn.execute(models.transaction.insert(),transactions)

@run.command()
def build():
    constants = []
    with open('constants.txt','r') as f:
        for line in f:
            constants.append(line.strip())
    with open('app/constants.py','w') as f:
        for constant in constants:
            f.write('{0} = "{0}"\n'.format(constant))
    with open('static/src/constants/index.js','w') as f:
        for constant in constants:
            f.write('export const {0} = "{0}";\n'.format(constant))

if __name__ == '__main__':
    run()
