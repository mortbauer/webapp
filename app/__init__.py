import os

if os.environ.get('PRODUCTION'):
    from .config import ProductionConfig
    config = ProductionConfig()
else:
    from .config import TestingConfig
    config = TestingConfig()

