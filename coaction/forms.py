from flask_wtf import Form
from wtforms import StringField, DateField, PasswordField
from wtforms.fields.html5 import EmailField
from wtforms.validators import DataRequired, Optional, Email, EqualTo


class APIForm(Form):
   def __init__(self, *args, **kwargs):
       default_kwargs = {"formdata": None, "csrf_enabled": False}
       default_kwargs.update(kwargs)
       super().__init__(*args, **default_kwargs)

class TaskForm(APIForm):
    title = StringField('title', validators=[DataRequired()])
    description = StringField('description', validators = [Optional()])
    status = StringField('status', validators=[DataRequired()])
    due_date = DateField('due date', format='%Y-%m-%d')


class LoginForm(APIForm):
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])


class RegistrationForm(APIForm):
    name = StringField('Name', validators=[DataRequired()])
    email = EmailField('Email', validators=[DataRequired(), Email()])
    password = StringField('Password', validators=[DataRequired()])
