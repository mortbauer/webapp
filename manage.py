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


if __name__ == '__main__':
    manager.run()
