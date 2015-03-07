#!/usr/bin/env python
import os

from flask.ext.script import Manager, Shell, Server
from flask.ext.migrate import MigrateCommand
from flask.ext.script.commands import ShowUrls, Clean
from coaction import create_app, db
from coaction.models import Task, User
import random


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
                    due_date="2015-03-20")
        task.owner_id = random.randint(1, 4)
        db.session.add(task)
    db.session.commit()
    print("Tasks seeded.")

@manager.command
def seed_users():
    users = [("zach", "easy@gmail.com", "123"), ("tom", "example@gmail.com", "321"),
             ("paget", "for@gmail.com", "213"), ("ana", "you@gmail.com", "231")]
    for name, email, password in users:
        user = User(name=name,
                    email=email,
                    password=password)
        db.session.add(user)
    db.session.commit()
    print("Users seeded.")


if __name__ == '__main__':
    manager.run()