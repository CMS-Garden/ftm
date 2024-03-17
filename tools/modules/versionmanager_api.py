import io
import json
import math
import uuid

import requests
from requests import Response
from tqdm import tqdm


class VersionmanagerApi:
    def __init__(self, username, password, endpoint):
        self.username = username
        self.password = password
        self.endpoint = endpoint
        self.access_token = self.__get_jwt_token()
        self.request_headers = {
            'Authorization': 'Bearer ' + self.access_token,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }

    def __get_jwt_token(self) -> tuple:
        """
        Make a POST-Request to /auth/login and return the access_token and refresh_token as tuple.
        """
        url = self.endpoint + '/auth/login'
        payload = {'username': self.username, 'password': self.password}
        headers = {'Content-Type': 'application/json'}
        response = requests.post(url, json=payload, headers=headers)

        return response.json()['data']['token']

    def create_systems(self, items: list) -> Response:
        """
        Make a POST-Request to /create_systems/ and return the response as JSON with system ids.
        """
        payload = {
            'url': items,
            'wartung': 'true',
            'autocrawl': 'true',
        }

        # dict to json
        url = self.endpoint + '/create_systems/'
        response = requests.get(url, json=json.dumps(payload), headers=self.request_headers)
        return response.json()

    def get_systems(self) -> Response:
        """
        Make a GET-Request to /systems/ and return the response as JSON with system ids.
        """
        url = self.endpoint + '/systems/'
        response = requests.get(url, headers=self.request_headers)
        return response.json()

