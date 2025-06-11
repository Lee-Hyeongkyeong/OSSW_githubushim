#4단계 도시 추천 알고리즘
import json
from collections import defaultdict, Counter
import re
import os

BASE_DIR = os.path.dirname(__file__)

# ✅ 태그 포함된 콘텐츠 데이터 로드
with open(os.path.join(BASE_DIR, "tagged_contents.json"), "r", encoding="utf-8") as f:
    contents = json.load(f)


# ✅ 주소에서 도시명 추출
def extract_city(addr):
    if not addr:
        return None
    match = re.search(r'([가-힣]+)(특별시|광역시|도)', addr)
    return match[0] if match else None

# ✅ 도시별 태그 통계 생성
city_tag_data = defaultdict(Counter)
for item in contents:
    city = extract_city(item.get("addr1", ""))
    tags = item.get("tags", [])
    if city and tags:
        city_tag_data[city].update(tags)

print(f"🏙️ 태그가 추출된 도시 수: {len(city_tag_data)}") #디버깅

# ✅ 도시 추천 함수
def recommend_cities(user_tag_scores, top_n=3):
    scores = {}
    for city, tag_counter in city_tag_data.items():
        # 총 점수 계산 (태그 가중치 × 도시 태그 빈도)
        total_score = sum(
            tag_counter.get(tag, 0) * user_tag_scores.get(tag, 0)
            for tag in user_tag_scores
            if tag != "필터"
        )

        # 콘텐츠 수 (도시 내 전체 태그 빈도 합)
        content_count = sum(tag_counter.values())

        # 평균 점수 계산
        avg_score = total_score / content_count if content_count > 0 else 0
        scores[city] = avg_score

        # ✅ 디버깅 출력
        print(f"📊 {city} 점수 계산:")
        print(f"    ├ 총 점수(raw): {total_score}")
        print(f"    ├ 콘텐츠 내 태그 총합: {content_count}")
        print(f"    └ 평균 점수: {avg_score:.4f}")

    # 점수 기준으로 상위 top_n 도시 추출
    sorted_scores = sorted(scores.items(), key=lambda x: -x[1])[:top_n]

    # ✅ 최종 추천 결과 출력
    print("\n✅ Top 추천 도시 결과:")
    for i, (city, score) in enumerate(sorted_scores, 1):
        print(f"    {i}. {city} – {score:.4f}점")

    return sorted_scores

# 아래는 모듈을 직접 실행할 때만 작동하도록 분리합니다.
if __name__ == "__main__":
    # 직접 파일로 실행(테스트)할 때만 profile을 불러와 추천을 돌리도록
    with open(os.path.join(BASE_DIR, "user_profile.json"), "r", encoding="utf-8") as f:
        profile = json.load(f)
        user_tag_scores = profile.get("weights", {})

    top_cities = recommend_cities(user_tag_scores, 5)
    print("🎯 사용자 태그:", list(user_tag_scores.keys()))
    print("\n🏆 추천 도시 Top 5:")
    for i, (city, score) in enumerate(top_cities, 1):
        print(f"{i}. {city} – {score}점")