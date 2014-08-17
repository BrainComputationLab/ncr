from __future__ import unicode_literals, absolute_import
from ncr.models import User
from ncr.util.crypt import gen_salt, hash_password


class UserService(object):

    @classmethod
    def create_user(cls, username, password, first_name, last_name,
                    institution, email):
        salt = gen_salt()
        hashed_pass = hash_password(password, salt)
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
        return user

    @classmethod
    def get_user(cls, username):
        try:
            return User.objects.get(username=username)
        except User.DoesNotExist:
            # TODO log something
            return None
