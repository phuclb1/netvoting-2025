from loguru import logger
import requests

from core.singleton import SingletonMeta


class AuthGateway(metaclass=SingletonMeta):
    def get_google_user(self, token):
        google_url = "https://www.googleapis.com/oauth2/v3/userinfo"

        headers = {
            "Authorization": f"Bearer {token}",
        }

        user_response = requests.get(
            google_url, headers=headers, timeout=10)
        status_code = user_response.status_code
        user_data = user_response.json()
        logger.info(f"Google user response: {user_data} - {status_code}")

        return user_data
