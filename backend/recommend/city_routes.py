import os
import json
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from backend.survey.city_recommend import recommend_cities  # 추천 로직 함수가 따로 있다면

city_recommend_bp = Blueprint("city_recommend", __name__)

@city_recommend_bp.route("/api/recommend/cities", methods=["POST"])
@login_required
def recommend_for_user():
    # 1) 요청 body에서 top_n만 꺼낸다 (기본값: 3)
    body = request.get_json(force=True)
    top_n = body.get("top_n", 3)

    # 2) DB 대신 JSON 파일에서 user_tag_scores 읽어오기
    base_dir = os.path.dirname(__file__)               # backend 폴더 경로
    # profiles 디렉토리, 폴더가 없으면 자동 생성
    profiles_dir = os.path.abspath(os.path.join(base_dir, "..", "user_profiles"))
    os.makedirs(profiles_dir, exist_ok=True)

    # ① 사용자 파일: user_profiles/{user_id}.json
    user_file    = os.path.join(profiles_dir, f"{current_user.id}.json")
    # ② 기본 파일: backend/survey/user_profile.json
    default_file = os.path.abspath(os.path.join(base_dir, "user_profile.json"))
    # ③ 우선순위: 사용자 파일 → 기본 파일
    json_path    = user_file if os.path.isfile(user_file) else default_file

    # 3) JSON 열어서 weights 추출 (파일 없거나 파싱 에러 시 빈 dict)
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            profile         = json.load(f)
            user_tag_scores = profile.get("weights", {})
    except Exception:
        user_tag_scores = {}

    # 3) 추천 로직 호출 (city_tag_data는 모듈 로드 시 이미 계산됨)
    recs_tuples = recommend_cities(user_tag_scores, top_n)
    # 예시 반환: [("서울특별시", 320), ("부산광역시", 287), …]

    # 4) 튜플 리스트를 JSON 직렬화 가능한 딕셔너리 리스트로 변환
    formatted = [{"city": city, "score": score} for city, score in recs_tuples]

    # 5) 응답 반환
    return jsonify({
        "message": "추천 완료",
        "total_requested": top_n,
        "recommendations": formatted
    })