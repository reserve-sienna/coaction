from flask import Blueprint, flash, jsonify, request
from .models import Task, TaskSchema, User, UserSchema
from .forms import TaskForm, LoginForm, RegistrationForm
from .extensions import db, login_manager
from flask.ext.login import login_user, logout_user, current_user, login_required
from flask_mail import Message
from coaction import mail


coaction = Blueprint("coaction", __name__, static_folder="./static")






@coaction.route("/")
def index():
    return coaction.send_static_file("index.html")


# Gets all tasks in the system.
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


# Creates one task adding it to the database.
@coaction.route("/api/tasks", methods=["POST"])
@login_required
def add_task():
    user = User.query.get(current_user.id)
    task_data = request.get_json()
    form = TaskForm(data=task_data)
    form.status.data = "New"
    if form.validate():
        task = Task(**form.data)
        task.owner = current_user
        db.session.add(task)
        user.assigned_tasks.append(task)
        db.session.commit()
        serializer = TaskSchema()
        result = serializer.dump(task)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "Could not insert."}}), 400


# Gets all tasks that are incomplete.
@coaction.route("/api/tasks/incomplete", methods=["GET"])
def get_incomplete_tasks():
    tasks = Task.query.filter(Task.status != "Done").order_by(Task.due_date).all()
    if tasks:
        serializer = TaskSchema(many=True)
        result = serializer.dump(tasks)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "There are no incomplete tasks  "}}), 404


# Gets a specific task with the task id.
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


# Updates a task with task ID.
@coaction.route("/api/task/<int:id>", methods=["PUT"])
def update_task(id):
    task_data = request.get_json()
    task = Task.query.get(id)
    if task:
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


# Deletes a task with task ID.
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


# Assigns a task to a user.
@coaction.route("/api/task/<int:id>/assign/<int:user_id>", methods=["POST"])
def assign_task(id, user_id):
    task = Task.query.get(id)
    user = User.query.get(user_id)
    if user:
        if task:
            user.assigned_tasks.append(task)
            db.session.commit()
            print(task.assigned)
            serializer = TaskSchema()
            result = serializer.dump(task)
            return jsonify({"status": "success",
                            "data": result.data})
        else:
            return jsonify({"status": "fail", "data": {"title": "Task not found."}}), 404
    else:
        return jsonify({"status": "fail", "data": {"title": "User not found."}}), 404


# Show all tasks owned by a user.
@coaction.route("/api/tasks/owned/<int:user_id>")
def get_owned_tasks(user_id):
    user = User.query.get(user_id)
    if current_user.id == user_id:
            serializer = UserSchema(exclude=('assigned_tasks', ))
            result = serializer.dump(user)
            return jsonify({"status": "success",
                            "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "This user is not authorized."}}), 401



# Show all tasks assuigned to a user.
@coaction.route("/api/tasks/assigned/<int:user_id>")
def get_assigned_tasks(user_id):
    user = User.query.get(user_id)
    tasks = user.assigned_tasks
    if current_user.id == user_id:
        if tasks:
            serializer = UserSchema(exclude=('owned_tasks', ))
            result = serializer.dump(user)
            return jsonify({"status": "success",
                            "data": result.data})
        else:
            return jsonify({"status": "fail", "data": {"title": "There are no tasks  "}}), 404
    else:
        return jsonify({"status": "fail", "data": {"title": "This user is not authorized."}}), 401




# Logs in the user to the app.
@coaction.route("/api/login", methods=["POST"])
def login():
    user_data = request.get_json()
    form = LoginForm(data=user_data)
    if form.validate_on_submit():
        user = User.query.filter_by(email=form.email.data).first()
        if user and user.check_password(form.password.data):
            login_user(user)
            serializer = UserSchema(exclude=('owned_tasks', 'assigned_tasks', ))
            result = serializer.dump(user)
            return jsonify({"status": "success",
                            "data": result.data})
        else:
            message = Message(
                              "Hello",
                              sender="python.tiy@gmail.com",
                              recipients=[form.email.data]
                              )
            message.body = "Hi, you need to create an account." \
                           " https://polar-escarpment-1079.herokuapp.com/#/users"
            mail.send(message)
            return jsonify({"status": "fail", "data": {"title": "Could not login user."}}), 401
    else:
        return jsonify({"status": "fail", "data": {"title": "Invalid data"}}), 400


# Logs out a user from the app.
@coaction.route("/api/logout", methods=["POST"])
def logout():
    logout_user()
    return jsonify({"status": "success"})


# Gets all users.
@coaction.route("/api/users", methods=["GET"])
def get_users():
    users = User.query.all()
    if users:
        serializer = UserSchema(many=True, exclude=('owned_tasks', ))
        result = serializer.dump(users)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "There are no users  "}}), 404


@coaction.route("/api/authenticated")
def authenticated():
    if current_user.is_active():
        user = User.query.get(current_user.id)
        serializer = UserSchema(exclude=('owned_tasks', 'assigned_tasks', ))
        result = serializer.dump(user)
        return jsonify({"status": "success",
                        "data": result.data})
    else:
        return jsonify({"status": "fail"})

# Adds a user.
@coaction.route("/api/users", methods=["POST"])
def create_user():
    user_data = request.get_json()
    form = RegistrationForm(data=user_data)
    if form.validate():
        user = User.query.filter_by(email=form.email.data).first()
        if user:
            return jsonify({"status": "fail", "data": {"title": "This user already exists"}}), 409
        else:
            user = User(**form.data)
            db.session.add(user)
            db.session.commit()
            login_user(user)
            serializer = UserSchema()
            result = serializer.dump(user)
            return jsonify({"status": "success",
                            "data": result.data})
    else:
        return jsonify({"status": "fail", "data": {"title": "Invalid data"}}), 400






