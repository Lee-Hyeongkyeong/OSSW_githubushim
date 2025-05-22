import requests
import json
import time

SERVICE_KEY = "NRdlL+U71nRQvCfT52NIjlUCv/0tRs9GNFQdKJQ92L/OapOqiZSKA6Ph0UPAuvL+FGJpFxaZxlvcfAI9leOQ9g=="
BASE_URL = "http://apis.data.go.kr/B551011/KorService2/areaBasedList2"

AREA_CODES = list(range(1, 40))  # 지역 코드 1~39
CONTENT_TYPE_IDS = [12, 14, 28, 32, 38, 39]  # 콘텐츠 타입 ID

collected_data = []

def fetch_with_retry(url, params, retries=3, delay=3):
    for attempt in range(retries):
        try:
            return requests.get(url, params=params, timeout=20)
        except requests.exceptions.ReadTimeout:
            print(f"[⚠️ RETRY] Read timeout, 재시도 중... ({attempt + 1}/{retries})")
            time.sleep(delay)
    raise Exception("❌ 최대 재시도 횟수 초과로 요청 실패")

for area_code in AREA_CODES:
    for content_type_id in CONTENT_TYPE_IDS:
        print(f"[INFO] 지역코드 {area_code}, 콘텐츠 {content_type_id} 수집 중...")
        page = 1

        while True:
            params = {
                "serviceKey": SERVICE_KEY,
                "numOfRows": 100,
                "pageNo": page,
                "MobileOS": "ETC",
                "MobileApp": "SmartTripApp",
                "areaCode": area_code,
                "contentTypeId": content_type_id,
                "_type": "json"
            }

            try:
                response = fetch_with_retry(BASE_URL, params)
                if not response.text.strip():
                    print(f"[ERROR] 빈 응답 (status code: {response.status_code})")
                    break

                try:
                    data = response.json()
                except json.JSONDecodeError:
                    if "LIMITED_NUMBER_OF_SERVICE_REQUESTS_EXCEEDS_ERROR" in response.text:
                        print("[❌ ERROR] 호출 횟수 제한 초과. 수집을 중단합니다.")
                        exit(1)
                    else:
                        print("[ERROR] JSON 파싱 실패: 응답이 JSON 형식이 아닙니다.")
                        print("[DEBUG] 응답 내용:", response.text[:300])
                        break

                header = data.get("response", {}).get("header", {})
                body = data.get("response", {}).get("body", {})
                items = body.get("items", {})

                if header.get("resultCode") != "0000":
                    print(f"[ERROR] API 오류: {header.get('resultMsg')}")
                    break

                if not isinstance(items, dict) or not items.get("item"):
                    break

                item_list = items["item"]
                if isinstance(item_list, dict):
                    item_list = [item_list]

                collected_data.extend(item_list)
                print(f"  - {len(item_list)}개 수집 (page {page})")

                total_count = body.get("totalCount", 0)
                num_of_rows = body.get("numOfRows", 0)
                if page * num_of_rows >= total_count:
                    break
                else:
                    page += 1
                    time.sleep(1)  # 과도한 호출 방지

            except Exception as e:
                print(f"[ERROR] 요청 또는 파싱 실패: {e}")
                break

# ✅ 수집 데이터 JSON으로 저장
output_filename = "tour_contents.json"
with open(output_filename, "w", encoding="utf-8") as f:
    json.dump(collected_data, f, ensure_ascii=False, indent=2)

print(f"\n✅ 총 수집된 콘텐츠 수: {len(collected_data)}")
print(f"✅ JSON 파일 저장 완료: {output_filename}")
