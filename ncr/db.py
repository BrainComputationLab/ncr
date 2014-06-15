from __future__ import unicode_literals
from mongokit import Document, Connection
import datetime
from crypt import Crypt

class Controller(object):

    def __init__(self):
        self.conn = Connection()
        self.conn.register([User, Session, Neuron])
        # 12 hours?
        self.conn['ncr']['session'].ensure_index('created', expireAfterSeconds=43200)

    def login(self, username, password):
        u = User.find({"username": username})
        hashed_pass = Crypt.hash_pw(password, u['salt'])
        if hashed_pass != u['password']:
            return None
        ses = Session.find({"username": username})
        if ses:
            return ses['token']
        token = Crypt.gen_token()
        created = datetime.datetime.now()
        ses = Session({"username": username, "token": token,
                        "created": created})
        ses.save()
        return token

    def verify_token(self, token):
        ses = Session.find({"token": token})
        return True if ses else False

class User(Document):

    __database__ = "ncr"
    __collection__ = "user"

    structure = {
        "username": str,
        "password": str,
        "salt": str,
        "first_name": str,
        "last_name": str,
        "institution": str,
        "email": str
    }


class Session(Document):

    __database__ = "ncr"
    __collection__ = "session"

    structure = {
        "username": str,
        "token": str,
        "created": datetime.Datetime
    }


class Entity(Document):

    __database__ = "ncr"

    structure = {
        "_id": str,
        "entity_type": str,
        "entity_name": str,
        "description": str,
        "author": str,
        "author_email": str,
        "specification": dict
    }


class Neuron(Entity):

    __collection__ = "neuron"
