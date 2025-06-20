import os

from backend.app import app
print(app.url_map)
if __name__ == "__main__":
    # 프로젝트 루트 기준 certs 폴더 위치로 경로 수정
    base_dir = os.path.dirname(os.path.abspath(__file__))
    cert_path = os.path.join(base_dir, 'certs', 'localhost+2.pem')
    key_path  = os.path.join(base_dir, 'certs', 'localhost+2-key.pem')

    # 파일 존재 여부 확인 (디버그용)
    if not os.path.isfile(cert_path) or not os.path.isfile(key_path):
        print(f"[ERROR] 인증서 파일을 찾을 수 없음: {cert_path}, {key_path}")
        exit(1)

    # HTTPS 서버 실행
    app.run(
        host='127.0.0.1',
        port=5000,
        ssl_context=(cert_path, key_path),
        debug=True
    )