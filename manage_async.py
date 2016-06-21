import click
import logging
import subprocess

#logging.basicConfig(level=logging.DEBUG)

@click.group()
def run():
    pass

@run.command()
@click.option('-a','--with-aiohttp',is_flag=True)
def run(with_aiohttp):
    if with_aiohttp:
        import asyncio
        from aiohttp import web
        from app import app
        web.run_app(app,port=8000)
    else:
        subprocess.call(['gunicorn','-b','0.0.0.0:8000','-k','aiohttp.worker.GunicornWebWorker','--reload','-w','1','-t','60','app:app','--log-level','DEBUG'])

if __name__ == '__main__':
    run()
