#5단계 콘텐츠 추천 알고리즘.py
import json
import os
import re
from collections import defaultdict, Counter
from flask_login import login_required, current_user

BASE_DIR = os.path.dirname(__file__)
PROFILES_DIR        = os.path.abspath(os.path.join(BASE_DIR, "..", "user_profiles"))
DEFAULT_PROFILE_PATH = os.path.abspath(os.path.join(BASE_DIR, "user_profile.json"))
TAGGED_CONTENTS_PATH = os.path.join(BASE_DIR, "tagged_contents.json")

# 디렉토리가 없으면 자동 생성
os.makedirs(PROFILES_DIR, exist_ok=True)

def load_user_profile() -> dict:
    print("▶▶ current_user:", current_user, "is_authenticated:", getattr(current_user, "is_authenticated", None))

    """
    로그인된 사용자의 user_profiles/{user_id}.json 을 우선 로드,
    아니면 DEFAULT_PROFILE_PATH 를 로드합니다.
    """
    # 비로그인(AnonymousUser)라면 바로 기본 프로필 반환
    if not getattr(current_user, "is_authenticated", False):
        profile_path = DEFAULT_PROFILE_PATH
        print(f"[DEBUG] Anonymous user → loading default profile: {profile_path}")

    else:
        # 로그인된 사용자일 때만 current_user.id 사용
        user_file    = os.path.join(PROFILES_DIR, f"{current_user.id}.json")
        profile_path = user_file if os.path.isfile(user_file) else DEFAULT_PROFILE_PATH

    with open(profile_path, "r", encoding="utf-8") as f:
        return json.load(f)

def load_user_tags() -> list[str]:
    """
    프로필에서 weights 키의 태그 목록 (필터 제외) 반환
    """
    profile     = load_user_profile()
    weights     = profile.get("weights", {})
    return [t for t in weights.keys() if t != "필터"]


def load_city_contents(city_name: str) -> list[dict]:
    """
    tagged_contents.json 에서 특정 도시에 해당하는 콘텐츠만 필터링
    """
    with open(TAGGED_CONTENTS_PATH, "r", encoding="utf-8") as f:
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

def recommend_grouped_contents(city_contents: list[dict],
                               user_tags: list[str],
                               top_n_each: int = 4) -> dict[str, list[dict]]:
    def score(content: dict) -> float:
        # 태그 기반 매칭 점수
        tags = content.get("tags", [])
        match_score = sum(1 for tag in tags if tag in user_tags)

        # 이미지 가산점
        if content.get("firstimage"):
            match_score += 0.5

        return match_score
    def has_image(content: dict) -> bool:
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
    def top_n(group: list[dict]) -> list[dict]:
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