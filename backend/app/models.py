from . import db

class RecommendedPlace(db.Model):
    __tablename__ = 'recommended_places'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(128), nullable=False)
    place_id = db.Column(db.String(128), nullable=False)
    
    def __repr__(self):
        return f'<RecommendedPlace {self.place_id}>' 