from __future__ import absolute_import, unicode_literals

from ncr.views import EntityResource
from ncr.schemas.user import user_schema
from ncr.models import User


class NeuronResource(EntityResource):

    def __init__(self):
        super(NeuronResource, self).__init__(
            entity_type=Neuron,
            schema=user_schema
        )
