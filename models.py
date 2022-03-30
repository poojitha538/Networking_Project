from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ProjectDetails(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(1000), nullable=False)
    skills = db.Column(db.String(200), nullable=False)
    start_date = db.Column(db.Date, nullable=True)
    end_date = db.Column(db.Date, nullable=True)

    def __init__(self, name, description, skills, start_date, end_date):
        self.name = name
        self.description = description
        self.skills = skills
        self.start_date = start_date
        self.end_date = end_date