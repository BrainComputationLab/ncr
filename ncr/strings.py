def json_message_wrapper(message):
    return {
        'message': message
    }

API_MISSING_ID = "missing id parameter"
API_MISSING_TOKEN = "missing access token"
API_BAD_TOKEN = "Invalid/Expired auth token"
API_INVALID_JSON = "Invalid JSON object"
API_NO_USERNAME = "No username provided"
API_NO_PASSWORD = "No password provided"
API_BAD_CREDENTIALS = "Incorrect username or password specified"

ENTITY_NO_ID = "No ID specified"
ENTITY_MULTIPLE_RESULTS = "Multiple resuts were found for this ID, this is an \
    NCR problem"
