from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class RecommendedPlace(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(128), nullable=False)
    place_id = db.Column(db.String(128), nullable=False)