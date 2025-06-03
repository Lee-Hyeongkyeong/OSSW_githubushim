# CATEGORY_KEYWORDS = {
    # 독립 카테고리
#    "카페": ["카페", "브런치카페", "디저트카페", "테마카페"],
#    "한식": ["한식", "한식당", "비빔밥", "불고기", "삼겹살"],
#    "일식": ["일식", "초밥", "라멘", "돈까스"],
#    "중식": ["중식", "중국집", "짜장면", "양꼬치"],
#    "양식": ["양식", "피자", "파스타", "스테이크"],
#    
#    # 상위 카테고리
#    "문화": ["미술관", "박물관", "공연장", "전시관"],
#    "액티비티": ["클라이밍", "볼링장", "노래방", "방탈출"],
#    "역사": ["유적지", "고궁", "사적지"],
#    "자연": ["산", "호수", "강", "해변", "공원"],
#    "가족": ["키즈카페", "동물원", "수족관"],
#   "사진명소": ["전망대", "포토존", "야경"],
#   "쇼핑": ["백화점", "쇼핑몰", "시장"],
#   "이색": ["테마카페", "이색체험", "VR방"]
#} 

GOOGLE_PLACE_TYPE_MAP = {
    "카페": ["cafe"],
    "커피": ["cafe"],
    "커피숍": ["cafe"],
    "카페테리아": ["cafe"],
    "한식": ["restaurant"],  # 세부 한식은 구글에서 지원하지 않음
    "일식": ["restaurant"],
    "중식": ["restaurant"],
    "양식": ["restaurant"],
    "맛집": ["restaurant"],
    "식당": ["restaurant"],
    "음식점": ["restaurant"],
    "피자": ["restaurant"],
    "파스타": ["restaurant"],
    "초밥": ["restaurant"],
    "치킨": ["restaurant"],
    "술집": ["bar"],
    "펍": ["bar"],
    "미술관": ["art_gallery"],
    "박물관": ["museum"],
    "공연장": ["movie_theater", "stadium", "theater"],
    "전시관": ["museum"],
    "클라이밍": ["gym"],
    "볼링장": ["bowling_alley"],
    "노래방": ["night_club"],
    "방탈출": ["amusement_center"],
    "유적지": ["tourist_attraction"],
    "고궁": ["tourist_attraction"],
    "사적지": ["tourist_attraction"],
    "산": ["park"],
    "호수": ["park"],
    "강": ["park"],
    "해변": ["park"],
    "공원": ["park"],
    "키즈카페": ["cafe"],
    "동물원": ["zoo"],
    "수족관": ["aquarium"],
    "전망대": ["tourist_attraction"],
    "포토존": ["tourist_attraction"],
    "야경": ["tourist_attraction"],
    "백화점": ["shopping_mall", "department_store"],
    "쇼핑몰": ["shopping_mall"],
    "시장": ["shopping_mall"],
    "테마카페": ["cafe"],
    "이색체험": ["amusement_center"],
    "VR방": ["amusement_center"],
    # 영어 Place Type 직접 입력도 지원
    "cafe": ["cafe"],
    "restaurant": ["restaurant"],
    "bar": ["bar"],
    "museum": ["museum"],
    "art_gallery": ["art_gallery"],
    "park": ["park"],
    "zoo": ["zoo"],
    "aquarium": ["aquarium"],
    "shopping_mall": ["shopping_mall"],
    "department_store": ["department_store"],
    "movie_theater": ["movie_theater"],
    "bowling_alley": ["bowling_alley"],
    "gym": ["gym"],
    "night_club": ["night_club"],
    "stadium": ["stadium"],
    "theater": ["theater"],
    "amusement_center": ["amusement_center"],
    "tourist_attraction": ["tourist_attraction"]
}

def extract_search_keywords(user_input):
    # 입력어를 그대로 keyword로 사용
    return [user_input.strip()] if user_input.strip() else []

def parse_request(request_data):
    user_input = request_data.get("user_input", "")
    location = "현재 위치"
    search_keywords = extract_search_keywords(user_input)
    return {
        "location": location,
        "search_keywords": search_keywords
    }