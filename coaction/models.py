from .extensions import db
from marshmallow import Schema, fields, ValidationError

"""Add your models here."""


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(255))
    due_date = db.Column(db.Date)

    def __init__(self, title, description, status, due_date):
        self.title = title
        self.description = description
        self.status = status
        self.due_date = due_date

class TaskSchema(Schema):
    class Meta:
        fields = ("id", "title", "description", "status", "due_date")

def must_not_be_blank(data):
    if not data:
        raise ValidationError("Data not provided.")


