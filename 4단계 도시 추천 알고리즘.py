import json
from collections import defaultdict, Counter
import re

# ✅ 사용자 프로필 로드
with open("user_profile.json", "r", encoding="utf-8") as f:
    user_tag_scores = json.load(f)

user_tags = [tag for tag in user_tag_scores if tag != "필터"]

# ✅ 태그 포함된 콘텐츠 데이터 로드
with open("tagged_contents.json", "r", encoding="utf-8") as f:
    contents = json.load(f)

# ✅ 주소에서 도시명 추출
def extract_city(addr):
    if not addr:
        return None
    match = re.findall(r'(?:특별시|광역시|도)?\s*([가-힣]+[시군구])', addr)
    return match[0] if match else None

# ✅ 도시별 태그 통계 생성
city_tag_data = defaultdict(Counter)
for item in contents:
    city = extract_city(item.get("addr1", ""))
    tags = item.get("tags", [])
    if city and tags:
        city_tag_data[city].update(tags)

# ✅ 도시 추천 함수
def recommend_cities(user_tag_scores, city_tag_data, top_n=5):
    scores = {}
    for city, tag_counter in city_tag_data.items():
        score = sum(tag_counter.get(tag, 0) * user_tag_scores.get(tag, 0) for tag in user_tag_scores if tag != "필터")
        scores[city] = score
    return sorted(scores.items(), key=lambda x: -x[1])[:top_n]

# ✅ 추천 실행
top_cities = recommend_cities(user_tag_scores, city_tag_data)

# ✅ 출력
print("🎯 사용자 태그:", user_tags)
print("\n🏆 추천 도시 Top 5:")
for i, (city, score) in enumerate(top_cities, 1):
    print(f"{i}. {city} – {score}점")
