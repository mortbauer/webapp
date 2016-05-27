import os

basedir = os.path.abspath(os.path.dirname(__file__))

class BaseConfig(object):
    SECRET_KEY = "SO_SECURE"
    DEBUG = True


class TestingConfig(BaseConfig):
    """Development configuration."""
    TESTING = True
    DEBUG = True
    WTF_CSRF_ENABLED = False
    SQLALCHEMY_DATABASE_URI = 'sqlite:///%s/app.db'%basedir
    DEBUG_TB_ENABLED = True
    PRESERVE_CONTEXT_ON_EXCEPTION = False

class ProductionConfig(BaseConfig):
    SECRET_KEY = os.urandom(24).decode('latin1')
    SQLALCHEMY_DATABASE_URI = 'postgresql://localhost/yourdb'
