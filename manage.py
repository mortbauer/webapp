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
def create_example_data():
    from app import models
    import requests
    with app['engine'].begin() as conn:
        with open('users.json','r') as f:
            ins = models.user.insert()
            users = []
            for data in json.loads(f.read()):
                data['password'] = app['bcrypt'].hashed_password(data['password'])
                users.append(data)
            conn.execute(ins,users)

    with app['engine'].begin() as conn:
        with open('transaction.json','r') as f:
            ins = models.transaction.insert()
            transactions = []
            for data in json.loads(f.read()):
                data['date'] = datetime.fromtimestamp(data['date'])
                transactions.append(data)
            conn.execute(ins,transactions)

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
