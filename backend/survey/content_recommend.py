import json, os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

with open(BASE_DIR / "tagged_contents.json", encoding="utf-8") as f:
    ALL_CONTENTS = json.load(f)

with open(BASE_DIR / "user_profile.json", encoding="utf-8") as f:
    PROFILE = json.load(f)

WEIGHTS = {k: v for k, v in PROFILE.items() if k != "필터"}
FILTER_TAGS = PROFILE.get("필터", [])              # 지금은 사용 안 함

AREA_CODE = {
    1:"서울특별시", 2:"인천광역시", 3:"대전광역시", 4:"대구광역시", 5:"광주광역시",
    6:"부산광역시", 7:"울산광역시", 8:"세종특별자치시",
    31:"경기도", 32:"강원특별자치도", 33:"충청북도", 34:"충청남도",
    35:"경상북도", 36:"경상남도", 37:"전북특별자치도", 38:"전라남도", 39:"제주특별자치도"
}

def recommend_contents(city:str, user_tags:list, top_n:int=5):
    city_contents = [
        c for c in ALL_CONTENTS
        if AREA_CODE.get(int(c.get("areacode",0))) == city and c.get("tags")
    ]

    scored = []
    for c in city_contents:
        score = sum(1 for t in c["tags"] if t in user_tags)
        if score:
            scored.append((c, score))

    scored.sort(key=lambda x: -x[1])
    return [c for c,_ in scored[:top_n]]

# ----------------- 단독 테스트 -----------------
if __name__ == "__main__":
    city = "서울특별시"     # 프런트에서 넘어오는 그대로
    rec = recommend_contents(city, WEIGHTS, top_n=5)

    print(f"\n🎯 사용자 태그(가중치): {WEIGHTS}")
    print(f"🏙️ 추천 도시: {city}")
    print(f"\n📍 추천 콘텐츠 Top {len(rec)}:")
    for i, c in enumerate(rec, 1):
        print(f"\n{i}. {c.get('title')}")
        print(f"   🏷️ {', '.join(c.get('tags', []))}")
        print(f"   📍 {c.get('addr1')}")
