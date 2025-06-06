from flask import Blueprint, jsonify, request
from backend.survey.content_recommend import recommend_grouped_detail, load_city_contents, load_user_tags

detail_recommend_bp = Blueprint('detail_recommend', __name__)

@detail_recommend_bp.route('/api/recommend/details', methods=['GET'])
def get_recommendations_deatil():
    # 예시: 서울 기준
    target_city = request.args.get("city", "서울")
    user_tags = load_user_tags()  # user_profile.json에서 태그 추출
    city_contents = load_city_contents(target_city)  # tagged_contents.json에서 해당 도시 콘텐츠 추출

    groups = recommend_grouped_detail(city_contents, user_tags)
    return jsonify({
        "group1": groups["group1"][:100],
        "group2": groups["group2"][:100],
        "group3": groups["group3"][:100],
        "group4": groups["group4"][:100],
        "group5": groups["group5"][:100]
    })


