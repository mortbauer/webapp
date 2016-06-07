from sqlalchemy import Table, Column, Integer, ForeignKey
from sqlalchemy.orm import relationship

from . import db, bcrypt


class User(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    email = db.Column(db.String(255), unique=True)
    password = db.Column(db.String(255))
    username = db.Column(db.String(255))
    name = db.Column(db.String(255))
    surname = db.Column(db.String(255))
    group_id = db.Column(db.Integer(), ForeignKey('group.id'))
    group = relationship('Group',back_populates='users')

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

class Group(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    name = db.Column(db.String(255))
    users = relationship('User', back_populates='group')


class Transaction(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    our_iban = db.Column(db.String(25))
    date = db.Column(db.Date())
    bic_blz = db.Column(db.String(25))
    transaction_number = db.Column(db.String(25))
    iban_knr = db.Column(db.String(25))
    amount = db.Column(db.Float())
    comment = db.Column(db.String(255))

