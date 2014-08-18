from __future__ import unicode_literals, absolute_import

API_SUCCESS = "operation completed successfully"
API_MISSING_TOKEN = "missing access token"
API_BAD_TOKEN = "Invalid/Expired auth token"
API_INVALID_JSON = "Invalid JSON object"
API_NOT_JSON_TYPE = "This request is missing a Content-Type header for JSON"
API_NO_USERNAME = "No username provided"
API_NO_PASSWORD = "No password provided"
API_BAD_CREDENTIALS = "Incorrect username or password specified"

ENTITY_NO_ID = "No ID specified"
ENTITY_MULTIPLE_RESULTS = (
    "Multiple resuts were found for this ID, this is a "
    "NCR problem"
)
ENTITY_NOT_FOUND = "Entity with specified ID not found"
ENTITY_INVALID_TAGS = "Entity with specified ID not found"

USER_NO_USERNAME = "No username specified"
