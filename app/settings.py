import os

basedir = os.path.abspath(os.path.dirname(__file__))

ONE_DAY = 60*60*24

class BaseConfig(object):
    TESTING = False
    SECRET_KEY = 'SO_SECURE'
    BCRYPT_HASH_PREFIX = b'2b'
    BCRYPT_LOG_ROUNDS = 12
    REDIS_HOST = 'localhost'
    REDIS_PORT = 6379

class TestingConfig(BaseConfig):
    """Development configuration."""
    TESTING = True
    DEBUG = True
    WTF_CSRF_ENABLED = False
    DEBUG_TB_ENABLED = True
    PRESERVE_CONTEXT_ON_EXCEPTION = False
    DATABASE_URI = 'sqlite:///app.db'
    TOKEN_EXPIRATION = ONE_DAY * 14

class ProductionConfig(BaseConfig):
    DEBUG = False
    WTF_CSRF_ENABLED = True
    SECRET_KEY = os.urandom(24).decode('latin1')
    DATABASE_URI = 'postgresql://localhost/webapp'
    TOKEN_EXPIRATION = ONE_DAY
