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
        from aiohttp import web
        from app_async import make_app
        web.run_app(make_app(),port=8000)
    else:
        subprocess.call(['gunicorn','-b','0.0.0.0:8000','-k','aiohttp.worker.GunicornWebWorker','--reload','-w','1','-t','60','thisapp:app','--log-level','DEBUG'])

def ma():
    loop = asyncio.get_event_loop()
    the_app = app(loop)
    handler = the_app.make_handler()
    f = loop.create_server(handler, '0.0.0.0', 8000)
    srv = loop.run_until_complete(f)
    print('serving on', srv.sockets[0].getsockname())
    try:
        loop.run_forever()
    except KeyboardInterrupt:
        pass
    finally:
        srv.close()
        loop.run_until_complete(srv.wait_closed())
        loop.run_until_complete(handler.finish_connections(1.0))
        loop.run_until_complete(the_app.finish())
        loop.close()

if __name__ == '__main__':
    run()
