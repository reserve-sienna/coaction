from flask import Blueprint, flash, jsonify, request
from .models import Task, TaskSchema, User, UserSchema
from .forms import TaskForm, LoginForm, RegistrationForm
from .extensions import db
from flask.ext.login import login_user, logout_user, current_user


coaction = Blueprint("coaction", __name__, static_folder="./static")


@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


@coaction.route("/api/tasks", methods=["GET"])
def tasks():
    tasks = Task.query.all()
    if tasks:
        serializer = TaskSchema(many=True)
        result = serializer.dump(tasks)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "There are no tasks  "}}), 400


@coaction.route("/api/tasks", methods=["POST"])
def add_task():
    task_data = request.get_json()
    print(task_data)
    form = TaskForm(data=task_data)
    form.status.data = "New"
    if form.validate():
        task = Task(**form.data)
        db.session.add(task)
        db.session.commit()
        serializer = TaskSchema()
        result = serializer.dump(task)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "Could not insert."}}), 400

@coaction.route("/api/task/<int:id>", methods=["GET"])
def get_task(id):
    task = Task.query.get(id)
    if task:
        serializer = TaskSchema()
        result = serializer.dump(task)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "Could not find task."}}), 400


@coaction.route("/api/task/<int:id>", methods=["PUT"])
def update_task(id):
    task = Task.query.get(id)
    task_data = request.get_json()
    form = TaskForm(data=task_data)
    if form.validate():
        form.populate_obj(task)
        db.session.commit()
        serializer = TaskSchema()
        result = serializer.dump(task)
        return jsonify({"status": "success",
                    "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "Could not update."}}), 400


@coaction.route("/api/task/<int:id>", methods=["DELETE"])
def delete_task(id):
    task = Task.query.get(id)
    if task:
        db.session.delete(task)
        db.session.commit()
        serializer = TaskSchema()
        result = serializer.dump(task)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "Could not delete."}}), 400



@coaction.route("/api/login", methods=["POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            serializer = UserSchema()
            result = serializer.dump(user)
            return jsonify({"status": "success",
                            "data": result.data})
        else:
            return jsonify({"status": "fail", "data": {"title": "Could not login user."}}), 400


@coaction.route("/api/logout", methods=["POST"])
def logout():
    user = current_user
    logout_user()
    serializer = UserSchema()
    result = serializer.dump(user)
    return jsonify({"status": "success",
                    "data": result.data})


@coaction.route("/api/register", methods=["POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            return jsonify({"status": "fail", "data": {"title": "This user already exists"}}), 400
        else:
            user = User(name=form.name.data,
                        email=form.email.data,
                        password=form.password.data)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            serializer = UserSchema()
            result = serializer.dump(user)
            return jsonify({"status": "success",
                    "data": result.data})
