from typing import Any
from core.settings import settings


class BaseTrace:
    name: str
    user_id: str
    session_id: str
    metadata: dict
    tags: list[str]
    input: Any
    output: Any

    def __init__(self, user_id: str, user_email: str, session_id: str):
        self.user_id = user_id
        self.session_id = session_id
        self.metadata = {
            "user_email": user_email
        }
        self.tags = [settings.deployment_env]
