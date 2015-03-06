from flask_wtf import Form
from wtforms import StringField, DateField
from wtforms.validators import DataRequired, Optional


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