import pytest
import requests
from flask import current_app

from app.services.google_maps_api import GoogleMapsAPI

class DummyResponse:
    def __init__(self, payload, status_code=200):
        self._payload = payload
        self.status_code = status_code
    def raise_for_status(self):
        if self.status_code >= 400:
            raise requests.HTTPError("Bad")
    def json(self):
        return self._payload

@pytest.fixture(autouse=True)
def set_api_key(monkeypatch, app):
    monkeypatch.setenv("GOOGLE_MAPS_API_KEY", "fake-key")
    yield

def test_search_places_empty(monkeypatch, app):
    monkeypatch.setattr(requests, "get", lambda *a, **k: DummyResponse({"results": []}))
    with app.app_context():
        client = GoogleMapsAPI()
        resp = client.search_places("cafe", 0, 0)
        assert "results" in resp and resp["results"] == []

def test_get_place_details(monkeypatch, app):
    detail = {"result": {"name": "X"}}
    monkeypatch.setattr(requests, "get", lambda *a, **k: DummyResponse(detail))
    with app.app_context():
        client = GoogleMapsAPI()
        resp = client.get_place_details("abc")
        assert resp["result"]["name"] == "X"

def test_get_directions_api(monkeypatch, app):
    directions = {"routes": []}
    monkeypatch.setattr(requests, "get", lambda *a, **k: DummyResponse(directions))
    with app.app_context():
        client = GoogleMapsAPI()
        resp = client.get_directions("A","B")
        assert resp == directions

def test_request_exception(monkeypatch, app):
    def boom(*a, **k):
        raise requests.RequestException("timeout")
    monkeypatch.setattr(requests, "get", boom)
    with app.app_context():
        client = GoogleMapsAPI()
        # nearbysearch
        r1 = client.search_places("x", 1,1)
        assert r1 == {"results": []}
        # details
        r2 = client.get_place_details("x")
        assert r2 == {}
