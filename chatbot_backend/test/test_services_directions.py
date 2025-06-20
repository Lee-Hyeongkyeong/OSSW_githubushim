# tests/test_services_directions.py
import json
import pytest
import requests
from flask import Response

from app.services.directions import get_directions as flask_get_directions
import app.config as config

class DummyOK:
    def __init__(self, data):
        self._data = data
    def json(self):
        return self._data

class DummyErr:
    def __init__(self, data):
        self._data = data
    def json(self):
        return self._data


def test_get_directions_success(monkeypatch, app):
    """
    성공 케이스: status OK 응답을 가정하고, JSON 구조를 확인
    """
    # API 키 모킹
    monkeypatch.setattr(config, "GOOGLE_MAPS_API_KEY", "fake-key")

    # 응답 모킹: status OK 시나리오
    sample = {
        "status": "OK",
        "routes": [{
            "legs": [{
                "distance": {"text": "1 km"},
                "duration": {"text": "5 mins"},
                "start_address": "A",
                "end_address": "B",
                "steps": [{
                    "html_instructions": "Go",
                    "distance": {"text": "1 km"},
                    "duration": {"text": "5 mins"}
                }]
            }]
        }]
    }
    monkeypatch.setattr(requests, "get", lambda url, params=None: DummyOK(sample))

    # app context 내에서 호출
    with app.app_context():
        resp = flask_get_directions("A", "B")

    assert isinstance(resp, Response)
    data = json.loads(resp.get_data(as_text=True))
    assert data["status"] == "success"
    assert data["data"]["distance"] == "1 km"
    assert data["data"]["steps"][0]["instruction"] == "Go"


def test_get_directions_not_found(monkeypatch, app):
    """
    실패 케이스: ZERO_RESULTS 시 status error, 코드 404
    """
    monkeypatch.setattr(config, "GOOGLE_MAPS_API_KEY", "fake-key")
    monkeypatch.setattr(requests, "get", lambda url, params=None: DummyErr({"status": "ZERO_RESULTS"}))

    with app.app_context():
        resp, code = flask_get_directions("X", "Y")

    assert code == 404
    data = json.loads(resp.get_data(as_text=True))
    assert data["status"] == "error"
    assert "ZERO_RESULTS" in data["message"]


def test_get_directions_exception(monkeypatch, app):
    """
    예외 케이스: requests.get 예외 발생 시 status error, 코드 500
    """
    monkeypatch.setattr(config, "GOOGLE_MAPS_API_KEY", "fake-key")
    def boom(url, params=None):
        raise RuntimeError("fail")
    monkeypatch.setattr(requests, "get", boom)

    with app.app_context():
        resp, code = flask_get_directions("A", "B")

    assert code == 500
    data = json.loads(resp.get_data(as_text=True))
    assert data["status"] == "error"
    assert "오류" in data["message"]
