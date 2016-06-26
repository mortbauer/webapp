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
def runserver(with_gunicorn):
    if not with_gunicorn:
        logging.basicConfig(level=logging.DEBUG)
        import asyncio
        from aiohttp import web
        web.run_app(app,port=5000)
    else:
        subprocess.call([
            'gunicorn','-b','0.0.0.0:5000','-k','aiohttp.worker.GunicornWebWorker',
            '--reload','-w','1','-t','60','app.app:app','--log-level','DEBUG',
        ])

@run.command()
def create_example_data():
    from app import models
    import requests
    with open('users.json','r') as f:
        ins = models.user.insert()
        data = json.loads(f.read())
        for user in data:
            requests.post('http://localhost:5000/api/users',json=user)
    with app['engine'].begin() as conn:
        with open('transaction.json','r') as f:
            ins = models.transaction.insert()
            transactions = []
            for data in json.loads(f.read()):
                data['date'] = datetime.fromtimestamp(data['date'])
                transactions.append(data)
            conn.execute(ins,transactions)

if __name__ == '__main__':
    run()
