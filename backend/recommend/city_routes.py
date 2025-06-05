import os
import json
from flask import Blueprint, request, jsonify
from flask_login import login_required
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
    json_path = os.path.join(base_dir, "..", "user_profiles", "user_profile.json")
    json_path = os.path.abspath(json_path)    
    try:
        with open(json_path, "r", encoding="utf-8") as f:
            profile = json.load(f)
            user_tag_scores = profile.get("weights", {})
    except FileNotFoundError:
        # 파일이 없으면 빈 dict로 처리
        user_profile = {}

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

    ''' #DB 이용 전달 방식
    # 2) 현재 로그인된 사용자의 태그 점수를 DB에서 가져온다
    user_id = current_user.id
    db = get_db()  # sqlite3 연결 객체 (예시)
    cursor = db.execute(
        "SELECT tag, score FROM user_tag WHERE user_id = ?", (user_id,)
    )
    rows = cursor.fetchall()
    # 예: rows = [("여행", 5), ("맛집", 3), ("쇼핑", 2)]
    user_tag_scores = { tag: score for (tag, score) in rows }

    # 만약 해당 사용자가 아직 태그 정보가 하나도 없다면, 기본값으로 빈 dict
    if not user_tag_scores:
        user_tag_scores = {}

    # 3) 추천 로직 호출
    recs_tuples = recommend_cities(user_tag_scores, city_tag_data, top_n)
    # 예시 반환: [("서울특별시", 320), ("부산광역시", 287), …]

    # 4) 튜플 리스트를 JSON 직렬화 가능한 딕셔너리 리스트로 바꾼다
    formatted = [{"city": city, "score": score} for city, score in recs_tuples]

    # 5) 최종 응답
    return jsonify({
        "message": "추천 완료",
        "total_requested": top_n,
        "recommendations": formatted
    })
'''
