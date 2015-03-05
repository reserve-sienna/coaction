#!/usr/bin/env python
import os

from flask.ext.script import Manager, Shell, Server
from flask.ext.migrate import MigrateCommand
from flask.ext.script.commands import ShowUrls, Clean
from datetime import datetime
from faker import Factory
from coaction import create_app, db
from coaction.models import Task


app = create_app()
manager = Manager(app)
manager.add_command('server', Server())
manager.add_command('db', MigrateCommand)
manager.add_command('show-urls', ShowUrls())
manager.add_command('clean', Clean())


@manager.shell
def make_shell_context():
    """ Creates a python REPL with several default imports
        in the context of the app
    """

    return dict(app=app, db=db)




@manager.command
def createdb():
    """Creates the database with all model tables. 
    Migrations are preferred."""
    db.create_all()


@manager.command
def seed_tasks():
    tasks = [("Running a mile", "Run"), ("Pull ups", "Gym"),
             ("Crunches", "Gym"), ("Eat breakfast", "Morning Routine"),
             ("write stories", "Write"), ("Commit to Github", "Code"),
             ("Teach class", "Job"), ("Make breakfast", "Morning Routine"),
             ("Read", "Evening Routine")]
    for description, title in tasks:
        task = Task(title=title,
                    description=description,
                    status="new",
                    due_date=datetime.today())
        db.session.add(task)
    db.session.commit()
    print("Tasks seeded.")


if __name__ == '__main__':
    manager.run()