#5단계 콘텐츠 추천 알고리즘.py
import json
import os

BASE_DIR = os.path.dirname(__file__)
user_profile_path = os.path.join(BASE_DIR, "..", "user_profiles", "user_profile.json")
user_profile_path = os.path.abspath(user_profile_path)

with open(user_profile_path, "r", encoding="utf-8") as f:
    profile = json.load(f)

# 🔹 사용자 태그 (필터는 무시)
user_tags = list(profile["weights"].keys())
target_city = "서울"

# 콘텐츠 데이터 로드
with open(os.path.join(BASE_DIR, "tagged_contents.json"), "r", encoding="utf-8") as f:
    all_contents = json.load(f)

# 지역 코드 → 도시명 매핑
area_code_to_city = {
    1: "서울특별시", 2: "인천광역시", 3: "대전광역시", 4: "대구광역시", 5: "광주광역시", 6: "부산광역시", 7: "울산광역시",
    8: "세종특별자치시", 31: "경기도", 32: "강원특별자치도", 33: "충청북도", 34: "충청남도", 35: "경상북도",
    36: "경상남도", 37: "전북특별자치도", 38: "전라남도", 39: "제주특별자치도"
}

# 선택한 도시의 콘텐츠 필터링
city_contents = [
    item for item in all_contents
    if area_code_to_city.get(int(item.get("areacode", 0))) == target_city
    and item.get("tags")  # 태그가 있는 콘텐츠만
]

def load_user_tags():
    base_dir = os.path.dirname(__file__)  # 현재 파일: backend/survey/...
    user_profile_path = os.path.join(base_dir, "..", "user_profiles", "user_profile.json")
    user_profile_path = os.path.abspath(user_profile_path)
    
    with open(user_profile_path, "r", encoding="utf-8") as f:
        profile = json.load(f)
    user_tags = list(profile["weights"].keys())
    return user_tags


def load_city_contents(city_name):
    base_dir = os.path.dirname(__file__)
    content_path = os.path.join(base_dir, "..", "survey", "tagged_contents.json")
    with open(content_path, "r", encoding="utf-8") as f:
        all_contents = json.load(f)

    area_code_to_city = {
         1: "서울특별시", 2: "인천광역시", 3: "대전광역시", 4: "대구광역시", 5: "광주광역시", 6: "부산광역시", 7: "울산광역시",
        8: "세종특별자치시", 31: "경기도", 32: "강원특별자치도", 33: "충청북도", 34: "충청남도", 35: "경상북도",
        36: "경상남도", 37: "전북특별자치도", 38: "전라남도", 39: "제주특별자치도"
    }

    return [
        c for c in all_contents
        if area_code_to_city.get(int(c.get("areacode", 0))) == city_name and c.get("tags")
    ]

def recommend_grouped_contents(city_contents, user_tags, top_n_each=4):
    def score(content):
        # 태그 기반 매칭 점수
        tags = content.get("tags", [])
        match_score = sum(1 for tag in tags if tag in user_tags)

        # 이미지 가산점
        if content.get("firstimage"):
            match_score += 0.5

        return match_score
    def has_image(content):
        return bool(content.get("firstimage") or content.get("firstimage2"))

    # 그룹 필터링 조건
    group1 = []  # 맛집 포함
    group2 = []  # 맛집 미포함 + 액티비티 포함
    group3 = []  # 맛집, 액티비티 모두 미포함

    for content in city_contents:
        tags = content.get("tags", [])
        if not tags:
            continue

        if "맛집" in tags:
            group1.append(content)
        elif "액티비티" in tags:
            group2.append(content)
        else:
            group3.append(content)

    # 각 그룹 점수 계산 및 정렬
    def top_n(group):
        return sorted(group, key=lambda x: (not has_image(x), -score(x))  # 점수 ↓, 이미지 O 우선
        )[:top_n_each]

    top1 = top_n(group1)
    top2 = top_n(group2)
    top3 = top_n(group3)

    return {
        "group1": top1, 
        "group2": top2, 
        "group3": top3
    }

def recommend_grouped_detail(city_contents, user_tags):
    def score(content):
        # 태그 기반 매칭 점수
        tags = content.get("tags", [])
        match_score = sum(1 for tag in tags if tag in user_tags)

        return match_score
    def has_image(content):
        return bool(content.get("firstimage") or content.get("firstimage2"))

    # 그룹 필터링 조건
    group1 = []  # 맛집 포함
    group2 = []  # 맛집 미포함 + 액티비티, 가족 포함
    group3 = []  # 맛집, 액티비티 미포함 + 역사, 문화 포함
    group4 = []  # 맛집, 액티비티, 힐링, 역사, 문화 미포함 + 자연, 힐링 포함
    group5 = []

    for content in city_contents:
        tags = content.get("tags", [])
        if not tags:
            continue

        if "맛집" in tags:
            group1.append(content)
        elif "액티비티" in tags or "가족" in tags:
            group2.append(content)
        elif "역사" in tags or "문화" in tags:
            group3.append(content)
        elif "자연" in tags or "힐링" in tags:
            group4.append(content)
        else:
            group5.append(content)

    def sort_with_image_only(group):
        # has_image == True인 것만 남기고, score 기준 내림차순 정렬
        filtered = [c for c in group if has_image(c)]
        return sorted(filtered, key=lambda c: -score(c))

    top1 = sort_with_image_only(group1)
    top2 = sort_with_image_only(group2)
    top3 = sort_with_image_only(group3)
    top4 = sort_with_image_only(group4)
    top5 = sort_with_image_only(group5)

    return {
        "group1": top1, 
        "group2": top2, 
        "group3": top3,
        "group4": top4,
        "group5": top5
    }


# 🔽 아래는 모듈을 직접 실행할 때만 작동하도록 분리합니다.
if __name__ == "__main__":
    target_city = "서울"
    user_tags = load_user_tags()
    city_contents = load_city_contents(target_city)
    recommendations = recommend_grouped_contents(city_contents, user_tags)

    print(f"\n🎯 사용자 태그: {user_tags}")
    print(f"🏙️ 추천 도시: {target_city}")
    print(f"\n📍 추천 콘텐츠 Top {len(recommendations)}:")

    for i, content in enumerate(recommendations, 1):
        print(f"\n{i}. {content.get('title', '제목 없음')}")
        print(f"   🏷️ 태그: {', '.join(content.get('tags', []))}")
        print(f"   📍 주소: {content.get('addr1', '주소 없음')}")
        if content.get("firstimage"):
            print(f"   🖼️ 이미지: {content['firstimage']}")
