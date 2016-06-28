
class UserStore:
    def __init__(self,app):
        self.store = {}
        self.app = app

    def store_user(self,token):
