
class EntityService(object):

    def __init__(self):
        # TODO: make this user specified
        self.conn = connect('ncr', host='localhost')

    def bootstrap(self):
        # admin user
        User(
            username="admin",
            password="password",
            salt=Crypt.gen_salt(),
            is_admin=True
        ).save()
        # default repository
        Repository(
            name="default",
        ).save()
