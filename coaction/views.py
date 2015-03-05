from flask import Blueprint, flash, jsonify
from .models import Task, TaskSchema


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
        return jsonify({"status": "fail", "data": {"title": "There are no tasks  "}}), 400


@coaction.route("/api/task/<int:id>", methods=["GET"])
def get_task(id):
    task = Task.query.get_or_404(id)
    serializer = TaskSchema()
    result = serializer.dump(task)
    return jsonify({"status": "success",
                    "data": result.data})