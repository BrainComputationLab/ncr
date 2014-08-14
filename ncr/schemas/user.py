user_schema = {
    "type": "object",
    "properties": {
        "username": {
            "type": "string",
        },
        "password": {
            "type": "string",
        },
        "first_name": {
            "type": "string",
        },
        "last_name": {
            "type": "string",
        },
        "institution": {
            "type": "string",
        },
        "email": {
            "type": "string",
        },
        "is_admin": {
            "type": "boolean",
        }
    },
    "required": [
        "username",
        "password",
    ]
}
