import os
import openai

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return openai.OpenAI(api_key=api_key)

def extract_parameters_with_openai(user_input, last_request=None):
    # (todo-list: more_recommendations 요청인 경우 이전 요청 정보 사용)
    if user_input == "more_recommendations" and last_request:
        return {
            "category": last_request.get('categories', [''])[0] if last_request.get('categories') else '',
            "radius": last_request.get('radius', 2000),
            "sort_by": last_request.get('sort_by', 'rating')
        }

    try:
        client = get_openai_client()
        prompt = f"""
        사용자의 요청 문장에서 아래 항목을 JSON으로 추출해줘.
        - category: 추천받고 싶은 장소/음식 카테고리(예: 중식, 카페, 초밥 등)
        - radius: 숫자(미터 단위, 없으면 2000)
        - sort_by: "distance", "rating" 중 하나(없으면 "rating")
        예시 입력: "반경 3km 이내의 중식집 거리 순으로 추천해줘."
        예시 출력: {{"category": "중식", "radius": 3000, "sort_by": "distance"}}
        입력: "{user_input}"
        출력:
        """
        response = client.chat.completions.create(
            model="gpt-4.1-nano",
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
    except Exception as e:
        print(f"OpenAI API 호출 중 오류 발생: {str(e)}")
        # API 호출 실패 시 기본값
        return {
            "category": user_input.strip(),
            "radius": 2000,
            "sort_by": "rating"
        }

def extract_search_keywords(user_input):
    return [user_input.strip()] if user_input.strip() else []

def parse_request(request_data):
    user_input = request_data.get("user_input", "")
    # last_request = request_data.get("last_request", None) #(todo-list)
    params = extract_parameters_with_openai(user_input) # (user_input, last_request)
    
    return {
        "location": "현재 위치",
        "search_keywords": [params["category"]] if params["category"] else None,
        "radius": params["radius"],
        "sort_by": params["sort_by"]
    } 