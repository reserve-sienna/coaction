from flask import Blueprint , jsonify, request
from .models import Task, TaskSchema
from .forms import TaskForm
from .extensions import db

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
    form = TaskForm(data=task_data)
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
    task = Task.query.get_or_404(id)
    serializer = TaskSchema()
    result = serializer.dump(task)
    return jsonify({"status": "success",
                    "data": result.data})