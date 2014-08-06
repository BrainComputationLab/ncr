from __future__ import unicode_literals, absolute_import
from datetime import datetime

import mongoengine

from mongoengine import (
    Document,
    StringField,
    ReferenceField,
    EmailField,
    DateTimeField,
    ListField,
    BooleanField,
)


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
    is_admin = BooleanField(default=False)


class Repository(Document):

    name = StringField(max_length=128, required=True, unique=True)
    read_access = ListField(
        ReferenceField(User, reverse_delete_rule=mongoengine.PULL)
    )
    write_access = ListField(
        ReferenceField(User, reverse_delete_rule=mongoengine.PULL)
    )
    is_public = BooleanField()


class Session(Document):

    user = ReferenceField(User)
    token = StringField(max_length=64)
    created = DateTimeField(default=datetime.now)

    # sessions should be TTL-ed after a set time period for security reasons
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
