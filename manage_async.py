import click
import logging
import subprocess


#logging.basicConfig(level=logging.DEBUG)

@click.group()
def run():
    pass

@run.command()
@click.option('-a','--with-aiohttp',is_flag=True)
@click.option('-d','--debug',is_flag=True)
def run(with_aiohttp,debug):
    if with_aiohttp:
        import asyncio
        from aiohttp import web
        from app import config
        from app.app import make_app
        loop = asyncio.get_event_loop()
        web.run_app(make_app(loop,config),port=8000)
    else:
        subprocess.call(['gunicorn','-b','0.0.0.0:8000','-k','aiohttp.worker.GunicornWebWorker','--reload','-w','1','-t','60','app:app','--log-level','DEBUG'])

if __name__ == '__main__':
    run()
