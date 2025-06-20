import json
import os
import pytest

from backend.survey.content_recommend import (
    load_city_contents,
    recommend_grouped_contents,
    recommend_grouped_detail,
    TAGGED_CONTENTS_PATH,
)

# 1) load_city_contents 함수 테스트
def test_load_city_contents_filters_by_city_and_tags(tmp_path, monkeypatch):
    # 임시 JSON 파일 생성
    sample = [
        {"areacode": "1", "tags": ["맛집"], "title": "서울맛집", "firstimage": ""},
        {"areacode": "1", "tags": [],       "title": "태그없음", "firstimage": ""},
        {"areacode": "2", "tags": ["액티비티"], "title": "인천액티", "firstimage": ""},
    ]
    file = tmp_path / "tagged_contents.json"
    file.write_text(json.dumps(sample, ensure_ascii=False), encoding="utf-8")

    # 모듈 상수 경로를 임시 파일로 덮어쓰기
    monkeypatch.setattr(
        "backend.survey.content_recommend.TAGGED_CONTENTS_PATH",
        str(file),
    )

    # 서울특별시 코드는 1
    results = load_city_contents("서울특별시")
    assert isinstance(results, list)
    # 태그가 있는 항목만 한 건 남아야 함
    assert len(results) == 1
    assert results[0]["title"] == "서울맛집"

# 2) recommend_grouped_contents 함수 테스트
def test_recommend_grouped_contents_ranking_and_grouping():
    # city_contents 샘플: 다양한 그룹·이미지 유무·점수 요소
    city_contents = [
        # group1 (맛집) + 이미지
        {"tags": ["맛집", "액티비티"], "firstimage": "img1",  "firstimage2": ""},
        # group1 (맛집) but no 이미지
        {"tags": ["맛집"],          "firstimage": "",      "firstimage2": ""},
        # group2 (액티비티) + 이미지
        {"tags": ["액티비티"],      "firstimage": "",      "firstimage2": "img2"},
        # group2 (액티비티) no 이미지
        {"tags": ["액티비티"],      "firstimage": "",      "firstimage2": ""},
        # group3 (기타) + 이미지
        {"tags": ["문화"],          "firstimage": "img3",  "firstimage2": ""},
        # 태그 없음 → 아예 무시
        {"tags": [],               "firstimage": "img_ignore", "firstimage2": ""},
    ]
    user_tags = ["맛집", "액티비티"]

    out = recommend_grouped_contents(city_contents, user_tags, top_n_each=2)

    # 반드시 세 개의 그룹이 존재
    assert set(out.keys()) == {"group1", "group2", "group3"}

    # group1: 맛집 포함된 항목만 → 2개
    g1 = out["group1"]
    assert all("맛집" in c["tags"] for c in g1)
    # 이미지 있는 항목이 먼저 와야 함
    assert g1[0]["firstimage"] == "img1"
    assert g1[1]["firstimage"] == ""

    # group2: 맛집 제외 + 액티비티 포함 → 2개
    g2 = out["group2"]
    assert all("액티비티" in c["tags"] and "맛집" not in c["tags"] for c in g2)
    # 이미지 있는 항목 우선
    assert g2[0]["firstimage2"] == "img2"

    # group3: 위 두 그룹에 속하지 않는 나머지(태그 있고)
    g3 = out["group3"]
    assert all(("맛집" not in c["tags"] and "액티비티" not in c["tags"]) for c in g3)
    #
