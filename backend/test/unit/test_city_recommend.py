import pytest
from collections import Counter
import backend.survey.city_recommend as city_mod
from backend.survey.city_recommend import extract_city, recommend_cities

# 1) extract_city 함수 테스트
def test_extract_city_with_metropolis_and_province():
    # 특별시/광역시 매칭
    assert extract_city("서울특별시 종로구") == "서울특별시"
    assert extract_city("부산광역시 해운대구") == "부산광역시"
    # 도 매칭
    assert extract_city("경기도 수원시") == "경기도"

def test_extract_city_no_match_or_empty():
    assert extract_city("") is None
    assert extract_city(None) is None
    assert extract_city("Unknown address") is None

# 2) recommend_cities 함수 테스트
def test_recommend_cities_basic(monkeypatch):
    # fake city_tag_data 주입
    fake_data = {
        "A도시": Counter({"tag1": 2, "tag2": 1}),
        "B도시": Counter({"tag1": 1, "tag3": 3}),
        "C도시": Counter(),  # 태그 없음
    }
    monkeypatch.setattr(city_mod, 'city_tag_data', fake_data)

    # 사용자 태그 점수 정의 (필터 태그는 무시됨)
    user_tag_scores = {
        "tag1": 1,
        "tag2": 2,
        "필터": 5
    }

    # top_n=3 으로 계산
    result = recommend_cities(user_tag_scores, top_n=3)

    # A도시: (2*1 + 1*2) / (2+1) = 4/3 ≒ 1.3333
    # B도시: (1*1 + 0)     / (1+3) = 1/4 = 0.25
    # C도시: content_count=0 이므로 avg_score=0
    expected = [
        ("A도시", pytest.approx(4/3)),
        ("B도시", pytest.approx(0.25)),
        ("C도시", 0),
    ]

    assert result == expected
