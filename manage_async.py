import json
import click
import logging
import subprocess
from datetime import datetime

from app import app

#logging.basicConfig(level=logging.DEBUG)

@click.group()
def run():
    pass

@run.command()
@click.option('-a','--with-aiohttp',is_flag=True)
def runserver(with_aiohttp):
    if with_aiohttp:
        import asyncio
        from aiohttp import web
        web.run_app(app,port=8000)
    else:
        subprocess.call(['gunicorn','-b','0.0.0.0:8000','-k','aiohttp.worker.GunicornWebWorker','--reload','-w','1','-t','60','app:app','--log-level','DEBUG'])

@run.command()
def create_example_data():
    from app import models
    with app['engine'].begin() as conn:
        with open('users.json','r') as f:
            ins = models.user.insert()
            data = json.loads(f.read())
            conn.execute(ins,data)
        with open('transaction.json','r') as f:
            ins = models.transaction.insert()
            transactions = []
            for data in json.loads(f.read()):
                data['date'] = datetime.fromtimestamp(data['date'])
                transactions.append(data)
            conn.execute(ins,transactions)

if __name__ == '__main__':
    run()
