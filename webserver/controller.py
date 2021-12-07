import json
import os
import socket
import subprocess
from threading import Lock
from time import sleep

import redis
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from redis_primer import RedisPrimer
from tools import get_git_data
from werkzeug.exceptions import BadRequest

app = Flask(__name__)

app.keys = ["style", "language"]
app.threads = {}
for thing in app.keys:
    app.threads[thing] = {
        "thread": None,
        "lock": Lock(),
    }

app.redis = redis.StrictRedis(encoding="utf-8", decode_responses=True)
RedisPrimer(app.redis).populate()
app.env = "production"
app.sleep_time = 1

ASYNC_MODE = None
socketio = SocketIO(app, async_mode=ASYNC_MODE, cors_allowed_origins="*")


@app.route("/", methods=["GET"])
def index():
    """Root route."""
    if request.accept_mimetypes["text/html"]:
        return render_template(
            "index.html",
            host_name=socket.gethostname(),
            styles=json.loads(app.redis.get(f"{app.env}:style:valids")),
            languages=json.loads(app.redis.get(f"{app.env}:language:valids")),
            git_metadata=get_git_data(),
        )

    return {"status": "OK"}


@app.route("/reload", methods=["POST"])
def reload():  # nocov
    """Reload the screen."""
    if "PLATFORM" in os.environ:
        if os.environ["PLATFORM"] == "docker":
            sleep(1)

            return {"status": "OK", "platform": "docker"}

    os.environ["DISPLAY"] = ":0"
    subprocess.run(("xdotool key F5").split(" "), check=True)
    sleep(1)

    return {"status": "OK"}


@app.route("/<key>", methods=["GET"])
def get_thing(key):
    """Get something."""
    if key in app.keys:
        return {"status": "OK", key: app.redis.get(f"{app.env}:{key}:current")}

    return four_o_four()


@app.route("/<key>", methods=["POST"])
def set_thing(key):
    """Set something."""
    if key in app.keys:
        try:
            value = request.json["value"]
        except BadRequest:
            return {"status": "not OK", "reason": "invalid payload"}, 400

        if value in json.loads(app.redis.get(f"{app.env}:{key}:valids")):
            app.redis.set(f"{app.env}:{key}:current", value)
            app.redis.set(f"{app.env}:{key}:changed", 1)
            return {"status": "OK", key: value}

        return {"status": "not OK", "reason": f"invalid {key}"}, 400

    return four_o_four()


def four_o_four():
    """Return a 404."""
    return {"status": "not OK", "reason": "that's not a thing I know about"}, 404


def get_thread(name):
    """Get a thread."""
    while True:
        try:
            if app.redis.get(f"{app.env}:{name}:changed"):
                socketio.emit(name, {name: app.redis.get(f"{app.env}:{name}:current")})
                app.redis.delete(f"{app.env}:{name}:changed")
                socketio.sleep(app.sleep_time)
        except TypeError:
            pass

        socketio.sleep(app.sleep_time)


@socketio.event
def connect():
    """Make first connection to the client."""
    for item in ["style", "language"]:
        with app.threads[item]["lock"]:
            app.threads[item]["thread"] = socketio.start_background_task(
                get_thread, item
            )

            socketio.emit(item, {item: app.redis.get(f"{app.env}:{item}:current")})


if __name__ == "__main__":  # nocov
    socketio.run(app, host="0.0.0.0", debug=True)
