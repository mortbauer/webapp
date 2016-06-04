import json
from datetime import datetime

from flask.ext.script import Manager
from flask.ext.migrate import Migrate, MigrateCommand

from application.app import app, db
from application import models

migrate = Migrate(app, db)
manager = Manager(app)

# migrations
manager.add_command('db', MigrateCommand)

@manager.command
def create_db():
    """Creates the db tables."""
    db.create_all()

@manager.command
def create_example_data():
    with open('users.json','r') as f:
        for data in json.loads(f.read()):
            user = models.User(**data)
            db.session.add(user)
            try:
                db.session.commit()
            except:
                db.session.rollback()
    with open('transaction.json','r') as f:
        for data in json.loads(f.read()):
            data['date'] = datetime.fromtimestamp(data['date'])
            tr = models.Transaction(**data)
            db.session.add(tr)
    db.session.commit()

@manager.command
def with_meinheld():
    from meinheld import server, middleware
    server.listen(("localhost", 5000))
    server.run(middleware.WebSocketMiddleware(app))

@manager.command
@manager.option('-n','--no-sockets', dest='no_sockets',help='do not run  under WebSocketMiddleware')
def run(no_sockets=False):
    # with WebSocketHandler debug doest work, maybe some solution from
    # http://flask.pocoo.org/snippets/34/
    if no_sockets:
        app.run('localhost',5000)
    else:
        from gevent import pywsgi
        from geventwebsocket.handler import WebSocketHandler
        server = pywsgi.WSGIServer(('localhost', 5000), app, handler_class=WebSocketHandler)
        server.serve_forever()

@manager.command
def build():
    js_path = 'static/src/constants/index.js'
    py_path = 'application/constants.py'
    with open(js_path,'w') as js,open(py_path,'w') as py,open('constants.txt','r') as c:
        for line in c:
            constant = line.strip()
            js.write('export const {0} = "{0}";\n'.format(constant))
            py.write('{0} = "{0}"\n'.format(constant))

if __name__ == '__main__':
    manager.run()
