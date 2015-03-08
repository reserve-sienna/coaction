from flask import Flask, render_template
from . import models
from .extensions import db, migrate, config, login_manager, mail
from .views import coaction
import os


SQLALCHEMY_DATABASE_URI = "postgres://localhost/tasks"
DEBUG = True
SECRET_KEY = 'development-key'
MAIL_SERVER = 'smtp.googlemail.com'
MAIL_PORT = 465
MAIL_USE_TLS = False
MAIL_USE_SSL = True
MAIL_USERNAME = "xxxx@gmail.com"
MAIL_PASSWORD = "xxxx"


def create_app():
    app = Flask(__name__)
    app.config.from_object(__name__)
    app.register_blueprint(coaction)
    login_manager.init_app(app)
    mail.init_app(app)
    config.init_app(app)
    db.init_app(app)
    migrate.init_app(app, db)


    return app
