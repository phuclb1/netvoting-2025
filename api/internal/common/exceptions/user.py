from internal.common.exceptions.common import XBaseException, ExceptionObjectDeleted
from internal.common.types import ID


class ExceptionUserNotFound(XBaseException):
    def __init__(self, user_id: ID):
        super().__init__(status_code=400,
                         message=f"User {user_id} not found")


class ExceptionUserDeleted(ExceptionObjectDeleted):
    def __init__(self, user_id: ID):
        super().__init__(object_name=f"User {user_id}")


class ExceptionUserAlreadyExists(XBaseException):
    def __init__(self, email: str):
        super().__init__(status_code=400,
                         message=f"User with email {email} already exists")
