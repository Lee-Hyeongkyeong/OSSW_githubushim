# 설문조사 결과 키워드에 맵핑
from googleLogin.survey import calculate_weights
from googleLogin.recommendation import recommend_destinations

tag_map = {
        "travle_style": {
            "인증형": ["트렌디", "랜드마크"],
            "맛집탐방형": ["맛집"],
            "관광형": ["관광지"],
            "휴식형": ["힐링", "휴양지"]
        },
        "priority": {
            "음식점": "맛집",
            "액티비티": "액티비티",
            "관광지": "관광지"
        },
        "places": {
            "바다": "자연",
            "자연": "자연",
            "도심": "도심",
            "이색거리": "문화",
            "역사": "역사",
            "휴양지": "휴양지"
        },
        "purposes": {
            "지식 쌓기": ["역사", "문화"],
            "체험": ["액티비티"],
            "힐링": ["힐링"],
            "탐험": ["자연"]
        },
        "must_go": {
            "스테디셀러": "스테디셀러",
            "트렌디": "트렌디",
            "홍대병 스팟": "로컬"
        }
    }