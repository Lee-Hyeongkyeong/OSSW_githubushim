import json

# 사용자 설문 응답 (자유롭게 수정 가능)
user_survey = {
    "여행 스타일": "휴식형",
    "중요 요소": ["관광지", "맛집", "액티비티"],
    "선호 장소": ["자연", "역사"],
    "여행 목적": ["힐링", "체험"],
    "필수 장소": ["트렌디"]
}

# 설문 보기 → 태그 연결 매핑
survey_tag_map = {
    "여행 스타일": {
        "인증형": ["트렌디", "랜드마크"],
        "맛집탐방형": ["맛집"],
        "관광형": ["관광지"],
        "휴식형": ["힐링", "휴양지"]
    },
    "중요 요소": {
        "음식점": "맛집",
        "액티비티": "액티비티",
        "관광지": "관광지"
    },
    "선호 장소": {
        "바다": "자연",
        "자연": "자연",
        "도심": "도심",
        "이색거리": "문화",
        "역사": "역사",
        "휴양지": "휴양지"
    },
    "여행 목적": {
        "지식 쌓기": ["역사", "문화"],
        "체험": ["액티비티"],
        "힐링": ["힐링"],
        "탐험": ["자연"]
    },
    "필수 장소": {
        "스테디셀러": "스테디셀러",
        "트렌디": "트렌디",
        "홍대병 스팟": "로컬"
    }
}

# 태그 점수 계산 함수
def compute_user_tag_scores(survey_answers):
    tag_scores = {}

    # Q1. 여행 스타일 (단일 선택, 30점)
    style = survey_answers.get("여행 스타일")
    for tag in survey_tag_map["여행 스타일"].get(style, []):
        tag_scores[tag] = tag_scores.get(tag, 0) + 30

    # Q2. 중요 요소 (순위 선택, 30점: 15,10,5)
    importance = survey_answers.get("중요 요소", [])
    weights = [15, 10, 5]
    for i, choice in enumerate(importance[:3]):
        tag = survey_tag_map["중요 요소"].get(choice)
        if tag:
            tag_scores[tag] = tag_scores.get(tag, 0) + weights[i]

    # Q3. 선호 장소 (최대 24점, 항목당 4점)
    places = survey_answers.get("선호 장소", [])
    for place in places:
        tag = survey_tag_map["선호 장소"].get(place)
        if tag:
            tag_scores[tag] = tag_scores.get(tag, 0) + 4

    # Q4. 여행 목적 (최대 16점, 항목당 4점)
    purposes = survey_answers.get("여행 목적", [])
    for purpose in purposes:
        for tag in survey_tag_map["여행 목적"].get(purpose, []):
            tag_scores[tag] = tag_scores.get(tag, 0) + 4

    # Q5. 필수 장소 (가중치 없음, 필터용)
    must_go = survey_answers.get("필수 장소", [])
    tag_scores["필터"] = [
        survey_tag_map["필수 장소"].get(p)
        for p in must_go if survey_tag_map["필수 장소"].get(p)
    ]

    return tag_scores

# 실행
if __name__ == "__main__":
    result = compute_user_tag_scores(user_survey)

    # 결과 저장
    with open("user_profile.json", "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    print("✅ 사용자 태그 점수 프로필 생성 완료!")
    print("📁 저장 파일: user_profile.json")
    print("\n🎯 태그 점수:")
    for k, v in result.items():
        print(f"{k}: {v}")
