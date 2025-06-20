import os, sys
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
import os
import pytest
import werkzeug
setattr(werkzeug, "__version__", "2.1.0")

from app import create_app
from app.models import db


@pytest.fixture(scope="session")
def app():
    # 테스트용 Flask 앱
    os.environ["DATABASE_URL"] = "sqlite:///:memory:"
    os.environ["GOOGLE_MAPS_API_KEY"] = "fake-key"
    from app import create_app as _create_app
    app = _create_app()
    app.config.update({
        "TESTING": True,
    })
    with app.app_context():
        db.create_all()
    yield app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()
