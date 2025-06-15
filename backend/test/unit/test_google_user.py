import sqlite3
import pytest

from backend.googleLogin.user import User
import backend.googleLogin.db as db_mod


@pytest.fixture
def in_memory_db(monkeypatch):
    # 1) 메모리 DB 연결 및 테이블 생성
    conn = sqlite3.connect(":memory:", detect_types=sqlite3.PARSE_DECLTYPES)
    conn.row_factory = sqlite3.Row
    conn.execute("""
        CREATE TABLE user (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            profile_pic TEXT
        );
    """)
    conn.commit()

    # 2) get_db()가 이 메모리 DB를 반환하도록 패치
    monkeypatch.setattr(db_mod, "get_db", lambda: conn)
    return conn


def test_get_nonexistent_user(in_memory_db):
    # DB에 아무 레코드도 없을 때는 None 반환
    assert User.get(1) is None


def test_create_and_get_user(in_memory_db):
    # 1) 새 사용자 생성
    User.create(1, "Alice", "alice@example.com", "alice.png")

    # 2) User.get을 통해 객체 반환 확인
    user = User.get(1)
    assert user is not None
    assert isinstance(user, User)
    assert user.id == 1
    assert user.name == "Alice"
    assert user.email == "alice@example.com"
    assert user.profile_pic == "alice.png"

    # 3) 내부 DB 레코드도 정확히 저장되었는지 직접 쿼리로 확인
    cur = in_memory_db.execute("SELECT * FROM user WHERE id = ?", (1,))
    row = cur.fetchone()
    assert row["id"] == 1
    assert row["name"] == "Alice"
    assert row["email"] == "alice@example.com"
    assert row["profile_pic"] == "alice.png"


def test_create_duplicate_id_raises(in_memory_db):
    # 동일한 PK로 두 번 삽입 시 IntegrityError 발생
    User.create(2, "Bob", "bob@example.com", "bob.png")
    with pytest.raises(sqlite3.IntegrityError):
        User.create(2, "Bobby", "bobby@example.com", "bobby.png")
