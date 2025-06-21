import os
import sys

# 스크립트가 backend/ 안에서 실행될 때,
# project root 를 모듈 탐색 경로에 추가
script_dir = os.path.dirname(__file__)       # .../project/backend
project_root = os.path.abspath(os.path.join(script_dir, ".."))
sys.path.insert(0, project_root)

from app import app
# print(app.url_map)
if __name__ == "__main__":
    # 프로젝트 루트 기준 certs 폴더 위치로 경로 수정
   # project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
   # cert_path = os.path.join(project_root, 'certs', 'localhost+2.pem')
   # key_path  = os.path.join(project_root, 'certs', 'localhost+2-key.pem')

    # 파일 존재 여부 확인 (디버그용)
    #if not os.path.isfile(cert_path) or not os.path.isfile(key_path):
    #    print(f"[ERROR] 인증서 파일을 찾을 수 없음: {cert_path}, {key_path}")
    #    exit(1)

    # HTTPS 서버 실행
    #app.run(
    #    host='127.0.0.1',
    #    port=5000,
    #    ssl_context=(cert_path, key_path),
    #    debug=True
    #)
   # app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
    from waitress import serve
    serve(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        threads=4  # 필요에 따라 워커 스레드 수 조정
    )
    
