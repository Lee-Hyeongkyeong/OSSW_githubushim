import os
import openai

client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def extract_parameters_with_openai(user_input):
    prompt = f"""
    사용자의 요청 문장에서 아래 항목을 JSON으로 추출해줘.
    - category: 추천받고 싶은 장소/음식 카테고리(예: 중식, 카페, 초밥 등)
    - radius: 숫자(미터 단위, 없으면 2000)
    - sort_by: "distance", "rating", "user_ratings_total" 중 하나(없으면 "rating")
    예시 입력: "반경 3km 이내의 중식집 추천해줘."
    예시 출력: {{"category": "중식", "radius": 3000, "sort_by": "rating"}}
    입력: "{user_input}"
    출력:
    """
    response = client.chat.completions.create(
        model="gpt-4.1-nano",  # 여기만 변경
        messages=[
            {"role": "system", "content": "너는 입력 문장에서 category, radius, sort_by를 추출해 JSON으로 반환하는 파서야."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=60,
        temperature=0
    )
    import json
    try:
        result = json.loads(response.choices[0].message.content.strip())
        return {
            "category": result.get("category", ""),
            "radius": int(result.get("radius", 2000)),
            "sort_by": result.get("sort_by", "rating")
        }
    except Exception:
        # 파싱 실패 시 기본값
        return {
            "category": user_input.strip(),
            "radius": 2000,
            "sort_by": "rating"
        }

def extract_search_keywords(user_input):
    return [user_input.strip()] if user_input.strip() else []

def parse_request(request_data):
    user_input = request_data.get("user_input", "")
    params = extract_parameters_with_openai(user_input)
    return {
        "location": "현재 위치",
        "search_keywords": [params["category"]],
        "radius": params["radius"],
        "sort_by": params["sort_by"]
    }