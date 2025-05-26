# survey.py
import json
from collections import defaultdict
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
# from googleLogin.db import save_survey_result   # 실제 DB 저장이 필요하면 주석 해제

survey_bp = Blueprint('survey', __name__)

@survey_bp.route('/api/survey', methods=['POST'])
@login_required
def submit_survey():
    data = request.json

    # 1) 태그별 가중치 점수 & 필터 태그 계산
    user_weights, filter_tags = compute_user_tag_scores(data)
    total_score = sum(user_weights.values())

    # 2) 사용자 프로필 JSON으로 저장
    profile = {
        "weights":      user_weights,
        "filter_tags":  filter_tags,
        "total_score":  total_score
    }
    with open("user_profile.json", "w", encoding="utf-8") as f:
        json.dump(profile, f, ensure_ascii=False, indent=2)

    # 3) DB에 저장 (리스트 항목은 문자열로 합쳐서 저장)
    # save_survey_result(
    #     user_id=current_user.id,
    #     travel_style=data.get("travel_style", ""),
    #     priority=",".join(data.get("priority", [])),
    #     places=",".join(data.get("places", [])),
    #     purposes=",".join(data.get("purposes", [])),
    #     must_go=",".join(data.get("must_go", [])),
    #     total_score=total_score
    # )

    # 4) 응답
    return jsonify({
        "message":      "설문 저장 완료",
        **profile
    }), 200


def compute_user_tag_scores(survey_answers):
    """
    설문 응답을 받아서
    1) travel_style 30점 균등 배분
    2) priority 순위별 15/10/5점
    3) places(최대2) 하나=18점, 두개 각 12점
    4) purposes(최대2) 하나=12점, 두개 각 8점
    5) must_go → 필터용 태그 리스트
    """
    weights = defaultdict(int)

    # (1) 여행 스타일 – 30점 (균등)
    style_map = {
        "인증형": ["트렌디", "랜드마크"],
        "맛집탐방형": ["맛집"],
        "관광형": ["관광지"],
        "휴식형": ["힐링", "휴양지"]
    }
    style = survey_answers.get("travel_style")
    for tag in style_map.get(style, []):
        weights[tag] += 30

    # (2) 중요 요소 – 1순위 15, 2순위 10, 3순위 5
    priority_map = {
        "음식점": "맛집",
        "액티비티": "액티비티",
        "관광지": "관광지"
    }
    priority_scores = [15, 10, 5]
    for i, choice in enumerate(survey_answers.get("priority", [])[:3]):
        tag = priority_map.get(choice)
        if tag:
            weights[tag] += priority_scores[i]

    # (3) 선호 장소 – 다중 선택 최대2개
    place_map = {
        "바다": "자연", "자연": "자연", "도심": "도심",
        "이색거리": "문화", "역사": "역사", "휴양지": "휴양지"
    }
    places = [place_map[p] for p in survey_answers.get("places", []) if p in place_map]
    places = list(dict.fromkeys(places))  # 중복 제거
    if len(places) == 1:
        weights[places[0]] += 18
    elif len(places) >= 2:
        for tag in places[:2]:
            weights[tag] += 12

    # (4) 여행 목적 – 다중 선택 최대2개
    purpose_map = {
        "지식 쌓기": ["역사", "문화"],
        "체험": ["액티비티"],
        "힐링": ["힐링"],
        "탐험": ["자연"]
    }
    selected = []
    for p in survey_answers.get("purposes", []):
        selected.extend(purpose_map.get(p, []))
    selected = list(dict.fromkeys(selected))
    if len(selected) == 1:
        weights[selected[0]] += 12
    elif len(selected) >= 2:
        for tag in selected[:2]:
            weights[tag] += 8

    # (5) 필수 장소 – 필터용 (점수 없음)
    must_go_map = {
        "스테디셀러": "스테디셀러",
        "트렌디": "트렌디",
        "홍대병 스팟": "로컬"
    }
    filters = [
        must_go_map[p]
        for p in survey_answers.get("must_go", [])
        if p in must_go_map
    ]

    return dict(weights), filters


# standalone 테스트용
if __name__ == "__main__":
    sample_survey = {
        "travel_style": "휴식형",
        "priority": ["관광지", "음식점", "액티비티"],
        "places": ["자연", "역사"],
        "purposes": ["힐링", "체험"],
        "must_go": ["트렌디"]
    }
    w, f = compute_user_tag_scores(sample_survey)
    print("✅ 태그 점수:", json.dumps(w, ensure_ascii=False, indent=2))
    print("🔍 필터 태그:", f)
    # 파일로도 저장
    with open("user_profile.json", "w", encoding="utf-8") as f_json:
        json.dump({"weights": w, "filter_tags": f, "total_score": sum(w.values())},
                  f_json, ensure_ascii=False, indent=2)
    print("📁 user_profile.json 생성 완료")
