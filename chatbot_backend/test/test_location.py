import pytest
from flask import Flask
import requests

from app.services.location import (
    get_user_location,
    validate_location,
    get_location_data,
    get_current_location
)

@pytest.fixture
def app():
    return Flask(__name__)

def test_get_user_location_present(app):
    client = app.test_client()
    with app.test_request_context("/?latitude=10&longitude=20"):
        lat, lng = get_user_location()
        assert lat == "10" and lng == "20"

def test_get_user_location_absent(app):
    with app.test_request_context("/"):
        lat, lng = get_user_location()
        assert lat is None and lng is None

@pytest.mark.parametrize("lat,lng,expected", [
    ("90","180", True),
    ("-90","-180", True),
    ("91","0", False),
    ("abc","0", False),
])
def test_validate_location(lat, lng, expected):
    assert validate_location(lat, lng) is expected

def test_get_location_data():
    out = get_location_data("10","20")
    assert out["latitude"] == "10"
    assert out["longitude"] == "20"
    assert "message" in out

def test_get_current_location_success(monkeypatch):
    dummy = type("D",(object,),{"json": lambda self: {"latitude": 1,"longitude":2}})
    monkeypatch.setattr(requests, "get", lambda *a, **k: dummy())
    loc = get_current_location()
    assert loc == {"latitude":1,"longitude":2}

def test_get_current_location_fail(monkeypatch):
    def boom(*a, **k):
        raise RuntimeError("no")
    monkeypatch.setattr(requests, "get", boom)
    assert get_current_location() is None
