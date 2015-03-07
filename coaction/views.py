from flask import Blueprint, flash, jsonify, request
from .models import Task, TaskSchema, User, UserSchema
from .forms import TaskForm, LoginForm, RegistrationForm
from .extensions import db, login_manager
from flask.ext.login import login_user, logout_user, current_user


coaction = Blueprint("coaction", __name__, static_folder="./static")


@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


## Add your API views here
@coaction.route("/api/tasks", methods=["GET"])
def tasks():
    tasks = Task.query.all()
    if tasks:
        serializer = TaskSchema(many=True)
        result = serializer.dump(tasks)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "There are no tasks  "}}), 404


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


@coaction.route("/api/tasks/incomplete", methods=["GET"])
def get_incomplete_tasks():
    tasks = Task.query.filter_by(Task.status != "Done").order_by(Task.due_date).all()
    if tasks:
        serializer = TaskSchema(many=True)
        result = serializer.dump(tasks)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "There are no incomplete tasks  "}}), 404


@coaction.route("/api/task/<int:id>", methods=["GET"])
def get_task(id):
    task = Task.query.get(id)
    if task:
        serializer = TaskSchema()
        result = serializer.dump(task)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "Could not find task."}}), 404


@coaction.route("/api/task/<int:id>", methods=["PUT"])
def update_task(id):
    task = Task.query.get(id)
    if task:
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
    else:
        return jsonify({"status": "fail", "data": {"title": "Data not found."}}), 404


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
    user_data = request.get_json()
    form = LoginForm(data=user_data)
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            serializer = UserSchema()
            result = serializer.dump(user)
            return jsonify({"status": "success",
                            "data": result.data})
        else:
            return jsonify({"status": "fail", "data": {"title": "Could not login user."}}), 401
    else:
        return jsonify({"status": "fail", "data": {"title": "Invalid data"}}), 400


@coaction.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"status": "success"})


@coaction.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    if users:
        serializer = TaskSchema(many=True)
        result = serializer.dump(users)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "There are no users  "}}), 404


@coaction.route("/api/users", methods=["POST"])
def create_user():
    user_data = request.get_json()
    form = RegistrationForm(data=user_data)
    if form.validate():
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            return jsonify({"status": "fail", "data": {"title": "This user already exists"}}), 409
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
    else:
        return jsonify({"status": "fail", "data": {"title": "Invalid data"}}), 400


