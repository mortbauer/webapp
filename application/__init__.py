import os

from flask import Flask
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.bcrypt import Bcrypt

app = Flask(__name__, static_folder="../static/dist", template_folder="../static")
if os.environ.get('PRODUCTION'):
    app.config.from_object('config.BaseConfig')
else:
    app.config.from_object('config.TestingConfig')
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
