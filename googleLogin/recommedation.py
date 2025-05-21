# 설문조사 결과 키워드에 맵핑
from googleLogin.survey import calculate_weights
from googleLogin.recommendation import recommend_destinations

tag_map = {
        "travle_style": {
            "인증형": "인스타스팟",
            "맛집탐방형": "맛집",
            "관광형": "문화",
            "휴식형": "힐링"
        },
        "priority": {
            "음식점": "맛집",
            "관광지": "문화",
            "액티비티": "체험"
        },
        "places": {
            "바다": "바다",
            "자연": "자연",
            "도심": "도심",
            "이색거리": "문화",
            "역사": "역사",
            "휴양지": "힐링"
        },
        "purposes": {
            "지식 쌓기": "역사",
            "체험": "체험",
            "힐링": "힐링",
            "탐험": "탐험"
        },
        "must_go": {
            "스테디셀러": "인기",
            "트렌디": "트렌디",
            "홍대병 스팟": "비밀스팟"
        }
    }

def map_survey_to_tags(survey_data):

    tags = set()
    # 여행 스타일
    style = survey_data.get("travel_style", "")
    if style:
        mapped = TAG_MAP["travel_style"].get(style)
        if mapped:
            tags.add(mapped)
    # 중요 요소
    for p in survey_data.get("priority", []):
        mapped = TAG_MAP["priority"].get(p)
        if mapped:
            tags.add(mapped)
    # 선호 장소
    for p in survey_data.get("places", []):
        mapped = TAG_MAP["places"].get(p)
        if mapped:
            tags.add(mapped)
    # 여행 목적
    for p in survey_data.get("purposes", []):
        mapped = TAG_MAP["purposes"].get(p)
        if mapped:
            tags.add(mapped)
    # 필수 장소 → 필터링용
    filters = [
        TAG_MAP["must_go"].get(p)
        for p in survey_data.get("must_go", [])
        if TAG_MAP["must_go"].get(p)
    ]
    return tags, filters
