import json

# 사용자 태그 로드 (3단계 user_profile.json 기준)
with open("user_profile.json", "r", encoding="utf-8") as f:
    profile = json.load(f)

# 🔹 사용자 태그 (필터는 무시)
user_tags = [tag for tag in profile if tag != "필터"]
target_city = "서울"

# 콘텐츠 데이터 로드
with open("tagged_contents.json", "r", encoding="utf-8") as f:
    all_contents = json.load(f)

# 지역 코드 → 도시명 매핑
area_code_to_city = {
    1: "서울", 2: "인천", 3: "대전", 4: "대구", 5: "광주", 6: "부산", 7: "울산",
    8: "세종", 31: "경기", 32: "강원", 33: "충북", 34: "충남", 35: "경북",
    36: "경남", 37: "전북", 38: "전남", 39: "제주"
}

# 선택한 도시의 콘텐츠 필터링
city_contents = [
    item for item in all_contents
    if area_code_to_city.get(int(item.get("areacode", 0))) == target_city
    and item.get("tags")  # 태그가 있는 콘텐츠만
]

# 콘텐츠 추천 함수 (필터 무시)
def recommend_contents(city_contents, user_tags, top_n=5):
    scored = []
    for content in city_contents:
        content_tags = content.get("tags", [])
        match_score = sum(1 for tag in content_tags if tag in user_tags)
        if match_score > 0:
            scored.append((content, match_score))

    scored.sort(key=lambda x: -x[1])
    return [c[0] for c in scored[:top_n]]

# 추천 실행
recommended = recommend_contents(city_contents, user_tags)

# 결과 출력
print(f"\n🎯 사용자 태그: {user_tags}")
print(f"🏙️ 추천 도시: {target_city}")
print(f"\n📍 추천 콘텐츠 Top {len(recommended)}:")

for i, content in enumerate(recommended, 1):
    print(f"\n{i}. {content.get('title', '제목 없음')}")
    print(f"   🏷️ 태그: {', '.join(content.get('tags', []))}")
    print(f"   📍 주소: {content.get('addr1', '주소 없음')}")
    if content.get("firstimage"):
        print(f"   🖼️ 이미지: {content['firstimage']}")
