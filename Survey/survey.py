from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from googleLogin.db import save_survey_result
from collections import defaultdict
from Survey.survey import calculate_weights

survey_bp = Blueprint('survey', __name__)

@survey_bp.route('/api/survey', methods=['POST'])
@login_required
def submit_survey():
    data = request.json

    # 1) 태그별 가중치 점수 & 필터 태그 계산
    user_weights, filter_tags = calculate_weights(data)
    total = sum(user_weights.values())

    # 3) DB에 저장 (리스트 항목은 문자열로 합쳐서 저장)
    save_survey_result(
        user_id=current_user.id,
        travel_style=data.get("travel_style", ""),
        priority=",".join(data.get("priority", [])),
        places=",".join(data.get("places", [])),
        purposes=",".join(data.get("purposes", [])),
        must_go=",".join(data.get("must_go", [])),
        total_score=total
    )

    # 4) 응답
    return jsonify({
+        "message":      "설문 저장 완료",
+        "weights":      user_weights,
+        "filter_tags":  filter_tags,
+        "total_score":  total
+    }), 200
    

#태구별 가중치 부여
def calculate_weights(survey):
    weights = defaultdict(int)

    # (1) 여행 스타일 - 단일 선택 (30점)
    style_weight = {
        "인증형": ["트렌디", "랜드마크"],
        "맛집탐방형": ["맛집"],
        "관광형": ["관광지"],
        "휴식형": ["힐링", "휴양지"]
    }
    selected = survey.get("travel_style")
    if selected and selected in style_weight:
        for tag in style_weight[selected]:
            weights[tag] += 30

    # (2) 중요 요소 - 순위 (15, 10, 5점)
    priority_weight = {
        "음식점": "맛집",
        "액티비티": "액티비티",
        "관광지": "관광지"
    }
    scores = [15, 10, 5]
    for i, p in enumerate(survey.get("priority", [])):
        if i < 3 and p in priority_weight:
            weights[priority_weight[p]] += scores[i]

    # (3) 선호 장소 - 다중 선택 (각 4점)
    place_weight = {
        "바다": "자연", "자연": "자연", "도심": "도심",
        "이색거리": "문화", "역사": "역사", "휴양지": "휴양지"
    }
    for p in survey.get("places", []):
        if p in place_weight:
            weights[place_weight[p]] += 4

    # (4) 여행 목적 - 다중 선택 (각 4점)
    purpose_weight = {
        "지식 쌓기": ["역사", "문화"],
        "체험": ["액티비티"],
        "힐링": ["힐링"],
        "탐험": ["자연"]
    }
    for p in survey.get("purposes", []):
        for tag in purpose_weight.get(p, []):
            weights[tag] += 4

    # (5) 필수 장소 - 필터용
    must_go_map = {
        "스테디셀러": "스테디셀러",
        "트렌디": "트렌디",
        "홍대병 스팟": "로컬"
    }
    filters = [must_go_map[p] for p in survey.get("must_go", []) if p in must_go_map]

    return dict(weights), filters

