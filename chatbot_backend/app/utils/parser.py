#utils/parser.py
"""
자연어 파싱 유틸리티 모듈
- OpenAI API를 사용한 자연어 처리
- 사용자 입력에서 검색 파라미터 추출
- 간단한 동의어 매핑(키워드 정규화)
"""

import os
import openai
import re

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def _parse_radius(value, default=1000):
    """
    '500', '500m', '0.8km', '2 km' → 모두 정수 미터 단위로 변환
    """
    if value is None:
        return default

    # 숫자·단위 분리
    if isinstance(value, (int, float)):
        return int(value)

    s = str(value).strip().lower()
    match = re.match(r"([\d\.]+)\s*(km|m)?", s)
    if not match:
        return default

    num, unit = match.groups()
    try:
        num = float(num)
    except ValueError:
        return default

    return int(num * 1000) if unit == "km" else int(num)


# ─── 간단 동의어 사전 ─────────────────────────────────
# key: 사용자가 입력할 수 있는 표현
# value: Google Maps API 에 넘길 표준 키워드
SYNONYMS = {
    "카페": "coffee",
    "커피숍": "coffee",
    "놀거리": "activity",
    "액티비티": "activity",
    "데이트하기 좋은 곳": "romantic",
    "분위기 좋은 곳": "romantic",
    "분위기 좋은곳": "romantic",
    "백화점": "department store",
    "방탈출": "escape room",
    "맛집": "restaurant",
    "식당": "restaurant",
    "레스토랑": "restaurant",
    "영화관": "movie theater",
    "박물관": "museum",
    "미술관": "museum",
    "호텔": "hotel",
    "전시회": "exhibition",
    "공연": "show",
    "콘서트": "concert",
    "놀이공원": "amusement park",
    "테마파크": "theme park",
    "공원": "park",
    "산책로": "walking trail",
    "해변": "beach",
    "바닷가": "beach",
    "시장": "market",
    "전통시장": "traditional market",
    "야시장": "night market",
    "쇼핑몰": "shopping mall",
    "바&펍": "bar",
    "펍": "bar",
    "클럽": "club",
    "산": "mountain",
    "강": "river",
    "호수": "lake",
    "산책": "stroll",
    "등산": "hiking",
    # 추가 동의어
    "캠핑": "camping",
    "낚시": "fishing",
    "스키장": "ski resort",
    "스키": "skiing",
    "스노우보드": "snowboarding",
    "자전거": "cycling",
    "드라이브": "driving",
    "와인 시음": "wine tasting",
    "와이너리": "winery",
    "맥주 양조장": "brewery",
    "술집": "pub",
    "전망대": "observatory",
    "등대": "lighthouse",
    "유적지": "historic site",
    "사찰": "temple",
    "교회": "church",
    "성당": "cathedral",
    "왕궁": "palace",
    "성": "castle",
    "동물원": "zoo",
    "수족관": "aquarium",
    "식물원": "botanical garden",
    "워터파크": "water park",
    "온천": "hot spring",
    "스파": "spa",
    "피트니스": "gym",
    "헬스장": "gym",
    "클라이밍": "climbing",
    "볼링장": "bowling alley",
    "당구장": "billiards",
    "노래방": "karaoke",
    "VR 체험": "VR experience",
    "키즈카페": "kids cafe",
    "아쿠아리움": "aquarium",  # aquarium의 다른 표기
    "전통 공연": "traditional show",
}



def normalize_keyword(word: str) -> str:
    """
    동의어 사전을 기반으로 단어를 표준 키워드로 정규화합니다.
    """
    key = word.strip().lower()
    return SYNONYMS.get(key, key)

# ─── OpenAI 기반 파라미터 추출 ─────────────────────────────────

def extract_parameters_with_openai(user_input, last_request=None):
    """
    OpenAI API를 사용하여 사용자 입력에서 검색 파라미터 추출
    - category, radius, sort_by
    - 'more_recommendations' 처리
    """
    # 추가 요청 처리
    if user_input in ("more_recommendations", "더 많은 장소 추천받기", "더보기") and last_request:
        return {
            "category": last_request.get('categories', [''])[0] or '',
            "radius": last_request.get('radius', 1000),
            "sort_by": last_request.get('sort_by', 'rating'),
            "is_more_request": True
        }

    prompt = f"""
    사용자의 요청 문장에서 아래 JSON을 추출해줘.
    - category: 추천 카테고리 (예: 카페, 맛집, 박물관 등)
    - radius: 숫자(미터 단위, 없으면 1000)
    - sort_by: "distance" 또는 "rating"(없으면 "rating")
    입력: "{user_input}"
    출력:
    """
    try:
        resp = client.chat.completions.create(
            model="gpt-4.1-nano",
            messages=[
                {"role": "system", "content": "JSON으로 category, radius, sort_by를 반환하는 파서입니다."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=60,
            temperature=0
        )
        import json
        result = json.loads(resp.choices[0].message.content.strip())
    except Exception:
        result = {}

    radius_meters = _parse_radius(result.get("radius"), default=1000)

    return {
        "category": result.get("category", "").strip(),
        "radius": int(result.get("radius", 1000)),
        "sort_by": result.get("sort_by", "rating"),
        "is_more_request": False
    }

# ─── 키워드 추출 및 정규화 ─────────────────────────────────

def extract_search_keywords(user_input: str):
    """
    단순히 입력 전체를 하나의 키워드로 쓰되,
    동의어 사전을 통해 정규화해서 돌려줍니다.
    """
    kw = user_input.strip()
    if not kw:
        return []
    # 동의어 정규화
    return [normalize_keyword(kw)]

# ─── 최종 파싱 함수 ─────────────────────────────────

def parse_request(request_data):
    """
    요청 데이터 파싱
    - OpenAI 추출 + 동의어 정규화
    """
    user_input = request_data.get("user_input", "")
    last_req = request_data.get("last_request")
    params = extract_parameters_with_openai(user_input, last_req)

    raw_category = params["category"] or user_input
    keywords = extract_search_keywords(raw_category)

    return {
        "location": "현재 위치",
        "search_keywords": keywords or None,
        "radius": params["radius"],
        "sort_by": params["sort_by"],
        "is_more_request": params.get("is_more_request", False)
    }
