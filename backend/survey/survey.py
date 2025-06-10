# survey.py
import json 
import os
from collections import defaultdict
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
import sqlite3
# from googleLogin.db import save_survey_result   # 실제 DB 저장이 필요하면 주석 해제

survey_bp = Blueprint('survey', __name__)

@survey_bp.route('', methods=['POST'])
@survey_bp.route('/', methods=['POST'])
# @login_required  # Temporarily commented out for testing
def submit_survey():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
            
        data = request.get_json()
        print("Received survey data:", data)  # 디버깅용

        if not data or 'travel_style' not in data:
            return jsonify({"error": "Invalid data format"}), 400

        # Load existing profile if it exists
        try:
            with open("user_profile.json", "r", encoding="utf-8") as f:
                existing_profile = json.load(f)
                # Merge new data with existing data
                if 'survey_data' not in existing_profile:
                    existing_profile['survey_data'] = {}
                # Accumulate data instead of overwriting (추가됨: 설문 데이터가 누적되도록 변경)
                for key, value in data.items():
                    # For travel_style, always update
                    if key == 'travel_style':
                        existing_profile['survey_data'][key] = value
                    # For priorities, places, and purposes, replace the entire list
                    elif key in ['priorities', 'places', 'purposes']:
                        existing_profile['survey_data'][key] = value
                    # For other fields, update as is
                    else:
                        existing_profile['survey_data'][key] = value
                data = existing_profile['survey_data']
        except FileNotFoundError:
            # If no existing profile, create new one
            existing_profile = {'survey_data': data}

        # 1) 태그별 가중치 점수 & 필터 태그 계산
        user_weights, filter_tags = compute_user_tag_scores(data)
        total_score = sum(user_weights.values())

        # 2) 사용자 프로필 JSON으로 저장
        profile = {
            "weights": user_weights,
            "filter_tags": filter_tags,
            "total_score": total_score,
            "survey_data": data  # Store the complete survey data
        }
        # with open("user_profile.json", "w", encoding="utf-8") as f:
        #     json.dump(profile, f, ensure_ascii=False, indent=2)

        base_dir = os.path.dirname(__file__)               # backend 폴더 경로
        json_path = os.path.join(base_dir, "..", "user_profiles", "user_profile.json")
        json_path = os.path.abspath(json_path)  
        with open(json_path, "w", encoding="utf-8") as f:
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
            "status": "success",
            "message": "설문 저장 완료",
            "data": profile
        }), 200
        
    except Exception as e:
        print("Error in submit_survey:", str(e))  # 디버깅용
        return jsonify({"error": str(e)}), 500

@survey_bp.route('/history', methods=['GET'])
@login_required
def check_survey_history():
    try:
        # DB에서 사용자의 설문 이력 확인
        conn = sqlite3.connect("sqlite_db")
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT COUNT(*) FROM survey_results 
            WHERE user_id = ?
        """, (current_user.id,))
        
        count = cursor.fetchone()[0]
        conn.close()
        
        return jsonify({
            "hasHistory": count > 0
        }), 200
    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500

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
    print("Computing scores for:", survey_answers)  # 디버깅용

    # (1) 여행 스타일 – 30점 (균등)
    style_map = {
        "인증형": ["사진명소", "이색"],
        "맛집탐방형": ["맛집"],
        "관광형": ["문화", "역사", "도심"],
        "휴식형": ["힐링", "자연"]
    }
    style = survey_answers.get("travel_style")
    if style:
        for tag in style_map.get(style, []):
            weights[tag] += 30
        print(f"Style scores for {style}:", {tag: weights[tag] for tag in style_map.get(style, [])})  # 디버깅용

    # (2) 중요 요소 – 1순위 15, 2순위 10, 3순위 5
    priority_map = {
        "음식점": ["맛집"],
        "액티비티": ["액티비티", "가족"],
        "관광지": ["문화", "역사", "도심", "사진명소", "이색"]
    }
    priority_scores = [15, 10, 5]
    priorities = survey_answers.get("priorities", [])
    
    if priorities:  # Only process if priorities exist
        for i, choice in enumerate(priorities[:3]):
            tags = priority_map.get(choice, [])
            for tag in tags:
                weights[tag] += priority_scores[i]
        print(f"Priority scores:", {p: priority_scores[i] for i, p in enumerate(priorities[:3])})  # 디버깅용

    # (3) 선호 장소 – 다중 선택 최대2개
    place_map = {
        "바다": "자연", "자연": "자연", "도심": "도심",
        "이색거리": "문화", "역사": "역사", "휴양지": "힐링"
    }
    # places = [place_map[p] for p in survey_answers.get("places", []) if p in place_map]
    # places = list(dict.fromkeys(places))  # 중복 제거
    # if len(places) == 1:
    #     weights[places[0]] += 18
    # elif len(places) >= 2:
    #     for tag in places[:2]:
    #         weights[tag] += 12
    # if places:
    #     print(f"Place scores:", {p: 18 if len(places) == 1 else 12 for p in places[:2]})  # 디버깅용
    # 여기서 cursor 가 total score 변겨 안됨 이슈로 아래로 변경함
    
    places = survey_answers.get("places", [])
    if places:  # Only process if places exist
        mapped_places = [place_map[p] for p in places if p in place_map]
        mapped_places = list(dict.fromkeys(mapped_places))  # 중복 제거
        if len(mapped_places) == 1:
            weights[mapped_places[0]] += 18
        elif len(mapped_places) >= 2:
            for tag in mapped_places[:2]:
                weights[tag] += 12
        print(f"Place scores:", {p: 18 if len(mapped_places) == 1 else 12 for p in mapped_places[:2]})  # 디버깅용

    # (4) 여행 목적 – 다중 선택 최대2개
    purpose_map = {
        "지식 쌓기": ["역사", "문화"],
        "체험": ["액티비티", "가족"],
        "힐링": ["힐링"],
        "탐험": ["자연"]
    }
    # selected = []
    # for p in survey_answers.get("purposes", []):
    #     selected.extend(purpose_map.get(p, []))
    # selected = list(dict.fromkeys(selected))
    # if len(selected) == 1:
    #     weights[selected[0]] += 12
    # elif len(selected) >= 2:
    #     for tag in selected[:2]:
    #         weights[tag] += 8
    # if selected:
    # 여기서 cursor 가 total score 변겨 안됨 이슈로 아래로 변경함
    
    purposes = survey_answers.get("purposes", [])
    if purposes:  # Only process if purposes exist
        selected = []
        for p in purposes:
            selected.extend(purpose_map.get(p, []))
        selected = list(dict.fromkeys(selected))  # 중복 제거
        if len(selected) == 1:
            weights[selected[0]] += 12
        elif len(selected) >= 2:
            for tag in selected[:2]:
                weights[tag] += 8
        print(f"Purpose scores:", {p: 12 if len(selected) == 1 else 8 for p in selected[:2]})  # 디버깅용

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

    print("Final weights:", dict(weights))  # 디버깅용
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