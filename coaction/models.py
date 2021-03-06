from .extensions import db, bcrypt, login_manager
from marshmallow import Schema, fields, ValidationError
from flask.ext.login import UserMixin
from sqlalchemy import func, and_
from datetime import date, timedelta, datetime
from flask import request, url_for

@login_manager.user_loader
def load_user(id):
    return User.query.get(id)


class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    title = db.Column(db.String(255), nullable=False)
    description = db.Column(db.String(255))
    status = db.Column(db.String(255))
    due_date = db.Column(db.String(40))
    owner_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    assigned_id = db.Column(db.Integer, db.ForeignKey('user.id'))

    def __init__(self, title, description, status, due_date):
        self.title = title
        self.description = description
        self.status = status
        self.due_date = due_date


class TaskSchema(Schema):
    class Meta:
        fields = ("id", "title", "description", "status", "due_date", "owner_id", "assigned_id")

def must_not_be_blank(data):
    if not data:
        raise ValidationError("Data not provided.")


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    encrypted_password = db.Column(db.String(60))
    owned_tasks = db.relationship('Task', backref='owner', lazy='dynamic', foreign_keys="Task.owner_id")
    assigned_tasks = db.relationship('Task', backref='assigned', lazy='dynamic', foreign_keys="Task.assigned_id")


    def get_password(self):
        return getattr(self, "_password", None)

    def set_password(self, password):
        self._password = password
        self.encrypted_password = bcrypt.generate_password_hash(password)

    password = property(get_password, set_password)

    def check_password(self, password):
        return bcrypt.check_password_hash(self.encrypted_password, password)

    def __repr__(self):
        return "<User {}>".format(self.email)

class UserSchema(Schema):
    owned_tasks = fields.Nested(TaskSchema, many=True)
    assigned_tasks = fields.Nested(TaskSchema, many=True)
    class Meta:
        fields = ("id", "name", "email", "owned_tasks", "assigned_tasks")
