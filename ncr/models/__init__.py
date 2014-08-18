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
    UUIDField,
    EmbeddedDocument,
    FloatField,
    DynamicField,
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

    meta = {
        'indexes': [
            'is_public',
            {
                'fields': ['name'],
                'unique': True
            },
            'read_access',
            'write_access',
        ]
    }


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


class Tag(Document):

    tag_name = StringField(max_length=64)
    tag_description = StringField(max_length=128)
    tag_background_color = StringField(max_length=7)
    tag_text_color = StringField(max_length=7)


class Entity(Document):
    """The entity is the main simulation construct in NCS.

    Entities include neurons, synapses, channels, etc.
    """
    id = UUIDField(primary_key=True)
    entity_type = StringField(max_length=64)
    entity_name = StringField(max_length=64)
    description = StringField(max_length=512)
    author = StringField(max_length=128)
    author_email = EmailField(max_length=128)
    tags = ListField(
        ReferenceField(Tag, reverse_delete_rule=mongoengine.PULL)
    )

    meta = {
        'allow_inheritance': True,
        'indexes': [
            'entity_type',
            # This is supposed to be a full-text-search index, but the
            # correct way in mongoengine to add a text-index yeilds an error
            # when performed here:
            # http://docs.mongoengine.org/guide/text-indexes.html
            {
                'fields': [
                    'entity_name',
                    'description',
                    'author',
                    'author_email',
                ],
                'default_language': 'english',
            },
        ]
    }


class Normal(EmbeddedDocument):
    """ Class for a normal distribution.

    """
    mean = FloatField()
    stdev = FloatField()


class Uniform(EmbeddedDocument):
    """ Class for a uniform distribution.

    """
    min = FloatField()
    max = FloatField()


class Neuron(Entity):
    """The neuron entity represents an individual cell type in a simulation.

    Examples of possible neurons include purkinje, pyramidal, etc.
    """
    neuron_type = StringField(max_length=64)

    meta = {
        'indexes': ['neuron_type']
    }


class IzhNeuron(Neuron):
    """A neuron type making use of the Izhikevich neuron model.

    Stuff about Izhikevich.
    """
    a = DynamicField(choices=[Normal, Uniform, FloatField])
    b = DynamicField(choices=[Normal, Uniform, FloatField])
    c = DynamicField(choices=[Normal, Uniform, FloatField])
    d = DynamicField(choices=[Normal, Uniform, FloatField])
    u = DynamicField(choices=[Normal, Uniform, FloatField])
    v = DynamicField(choices=[Normal, Uniform, FloatField])
    threshold = DynamicField(choices=[Normal, Uniform, FloatField])
