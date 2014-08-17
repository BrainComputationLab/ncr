from mongoengine import connect
from ncr import config

mongo_session = connect(
    config.mongo_test_database,
    host=config.mongo_host,
    port=config.mongo_port,
    username=config.mongo_username,
    password=config.mongo_password,
)
