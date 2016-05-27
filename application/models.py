from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from . import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    meta = relationship('UserMeta',uselist=False,back_populates='user')

    def __init__(self, email, password):
        self.email = email
        self.active = True
        self.password = User.hashed_password(password)

    @staticmethod
    def hashed_password(password):
        return bcrypt.generate_password_hash(password)

    @staticmethod
    def get_user_with_email_and_password(email, password):
        user = User.query.filter_by(email=email).first()
        if user and bcrypt.check_password_hash(user.password, password):
            return user
        else:
            return None

class UserMeta(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    username = db.Column(db.String(255))
    surname = db.Column(db.String(255))
    user_id = db.Column(db.Integer(), ForeignKey('user.id'))
    user = relationship('User',back_populates='meta')
