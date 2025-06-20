import pytest

from app.utils.parser import (
    normalize_keyword,
    extract_search_keywords,
    parse_request,
)

# 모의 OpenAI 파서 반환값
@pytest.fixture(autouse=True)
def fake_openai(monkeypatch):
    monkeypatch.setattr(
        "app.utils.parser.extract_parameters_with_openai",
        lambda user_input, last_request=None: {
            "category": "카페",
            "radius": 1500,
            "sort_by": "distance",
            "is_more_request": False
        }
    )

def test_normalize_keyword_known():
    assert normalize_keyword("카페") == "coffee"
    assert normalize_keyword("unknown") == "unknown"

def test_extract_search_keywords():
    assert extract_search_keywords("  맛집 ") == ["restaurant"]
    assert extract_search_keywords("") == []

def test_parse_request_default():
    req = {"user_input":"카페"}
    out = parse_request(req)
    assert out["search_keywords"] == ["coffee"]
    assert out["radius"] == 1500
    assert out["sort_by"] == "distance"
    assert out["is_more_request"] is False
