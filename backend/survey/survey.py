# survey.py
import json 
import os
from collections import defaultdict
from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
import sqlite3
# from googleLogin.db import save_survey_result   # 실제 DB 저장이 필요하면 주석 해제

survey_bp = Blueprint('survey', __name__)

# 공통: 프로필 디렉토리
BASE_DIR = os.path.dirname(__file__)
PROFILES_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "user_profiles"))
os.makedirs(PROFILES_DIR, exist_ok=True)  # 디렉토리 없으면 생성

def profile_path_for(user_id: int) -> str:
    return os.path.join(PROFILES_DIR, f"{user_id}.json")

@survey_bp.route('', methods=['POST'])
@survey_bp.route('/', methods=['POST'])
@login_required 
def submit_survey():
    try:
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
            
        data = request.get_json()
        print("Received survey data:", data)  # 디버깅용

        user_file = profile_path_for(current_user.id)
        print("▶▶▶ Writing survey profile to:", user_file)

        # 필수 필드 체크 수정
        if not data:
            return jsonify({"error": "Invalid data format"}), 400

        # Load existing profile if it exists
        try:
            with open(user_file, "r", encoding="utf-8") as f:
                existing_profile = json.load(f)
                existing_profile.setdefault('survey_data', {})
                # Merge new data with existing data
                if 'survey_data' not in existing_profile:
                    existing_profile['survey_data'] = {}
                # Accumulate data instead of overwriting
                for key, value in data.items():
                    # Remove old travel_style field if it exists
                    if key == 'travel_style':
                        continue
                    existing_profile['survey_data'][key] = value
                data = existing_profile['survey_data']
        except FileNotFoundError:
            # If no existing profile, create new one
            existing_profile = {'survey_data': data}
            # Remove old travel_style field if it exists
            if 'travel_style' in data:
                del data['travel_style']

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
          
        with open(user_file, "w", encoding="utf-8") as f:
            json.dump(profile, f, ensure_ascii=False, indent=2)

        # 3) 응답
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
    user_file = profile_path_for(current_user.id)
    has_history = os.path.isfile(user_file)
    return jsonify({"hasHistory": has_history}), 200

def compute_user_tag_scores(survey_answers):
    """
    설문 응답을 받아서
    1) travel_style_1 30점 균등 배분
    2) priority 순위별 15/10/5점
    3) travel_style_2 30점 균등 배분
    4) places(최대2) 하나=18점, 두개 각 12점
    5) purposes(최대2) 하나=12점, 두개 각 8점
    6) must_go → 필터용 태그 리스트
    """
    weights = defaultdict(int)
    print("Computing scores for:", survey_answers)  # 디버깅용

    # (1) 첫 번째 여행 스타일 – 30점 (균등)
    style_map_1 = {
        "인증형": ["사진명소", "이색"],
        "맛집탐방형": ["맛집"],
        "관광형": ["문화", "역사", "도심"],
        "휴식형": ["힐링", "자연"]
    }
    style_1 = survey_answers.get("travel_style_1")
    if style_1:
        for tag in style_map_1.get(style_1, []):
            weights[tag] += 30
        print(f"Style 1 scores for {style_1}:", {tag: weights[tag] for tag in style_map_1.get(style_1, [])})  # 디버깅용

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
        
    # (3) 두 번째 여행 스타일 – 30점 (균등)
    style_map_2 = {
        "관광형": ["문화", "역사", "도심"],
        "맛집탐방형": ["맛집"],
        "쇼핑형": ["쇼핑", "이색"],
        "휴식형": ["힐링", "자연"]
    }
    style_2 = survey_answers.get("travel_style_2")
    if style_2:
        for tag in style_map_2.get(style_2, []):
            weights[tag] += 30
        print(f"Style 2 scores for {style_2}:", {tag: weights[tag] for tag in style_map_2.get(style_2, [])})  # 디버깅용

    # (4) 선호 장소 – 다중 선택 최대2개
    place_map = {
        "바다": "자연", "자연": "자연", "도심": "도심",
        "이색거리": "문화", "역사": "역사", "휴양지": "힐링"
    }
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

    # (5) 여행 목적 – 다중 선택 최대2개
    purpose_map = {
        "지식 쌓기": ["역사", "문화"],
        "체험": ["액티비티", "가족"],
        "힐링": ["힐링"],
        "탐험": ["자연"]
    }
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

    # (6) 필수 장소 – 필터용 (점수 없음)
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
        "travel_style_1": "휴식형",
        "travel_style_2": "관광형",
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