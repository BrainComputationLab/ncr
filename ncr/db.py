from __future__ import unicode_literals, absolute_import
from mongoengine import (
    connect,
    Document,
    StringField,
    ReferenceField,
    EmailField,
    DateTimeField
)
from datetime import datetime
from ncr.crypt import Crypt


class Service(object):

    def __init__(self):
        # TODO: make this user specified
        self.conn = connect('ncr', host='localhost')

    def attempt_login(self, username, password):
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            return None
        hashed_pass = Crypt.hash_password(password, user.salt)
        if hashed_pass != user.password:
            return None
        session = Session.objects(username=user.username)
        if session:
            return session.token
        token = Crypt.gen_token()
        session = Session(username=user.username, token=token)
        session.save()
        return token

    def create_user(self, username, password, salt, first_name, last_name,
                    institution, email):
        salt = Crypt.gen_salt()
        hashed_pass = Crypt.hash_password(password, salt)
        user = User(
            username=username,
            password=hashed_pass,
            salt=salt,
            first_name=first_name,
            last_name=last_name,
            institution=institution,
            email=email
        )
        user.save()

    def verify_token(self, token):
        session = Session.objects(token=token)
        return True if session else False

    def create_entity_from_dict(self, entity, json):
        e = entity(**json)
        e.save()
        return True


class User(Document):

    username = StringField(
        max_length=128,
        required=True,
        unique=True,
        primary_key=True
    )
    password = StringField(max_length=64, required=True)
    salt = StringField(max_length=64, required=True)
    first_name = StringField(max_length=128)
    last_name = StringField(max_length=128)
    institution = StringField(max_length=128)
    email = EmailField(max_length=128)


class Permission(Document):

    name = StringField(max_length=128, required=True, unique=True)


class Session(Document):

    user = ReferenceField(User)
    token = StringField(max_length=64)
    created = DateTimeField(default=datetime.now)

    meta = {
        'indexes': [
            {
                'fields': ['created'],
                # expire after four hours
                'expireAfterSeconds': 60 * 60 * 4
            }
        ]
    }


class Entity(Document):

    id = StringField(max_length=64, primary_key=True)
    entity_type = StringField(max_length=64)
    entity_name = StringField(max_length=64)
    destription = StringField(max_length=512)
    author = StringField(max_length=128)
    author_email = EmailField(max_length=128)

    meta = {'allow_inheritance': True}

class Neuron(Entity):

    pass
