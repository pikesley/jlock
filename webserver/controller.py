import os
import socket
import subprocess
from threading import Lock
from time import sleep

import redis
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from tools import find_things, get_git_data, prime_redis
from werkzeug.exceptions import BadRequest

app = Flask(__name__)

app.data = {}
for thing in ["style", "language"]:
    app.data[thing] = {
        "valids": find_things(thing),
        "thread": None,
        "lock": Lock(),
    }

app.redis = redis.Redis()
prime_redis(app.redis)
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
            styles=app.data["style"]["valids"],
            languages=app.data["language"]["valids"],
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
    if key in app.data:
        return {"status": "OK", key: app.redis.get(key).decode()}

    return four_o_four()


@app.route("/<key>", methods=["POST"])
def set_thing(key):
    """Set something."""
    if key in app.data:
        try:
            value = request.json["value"]
        except BadRequest:
            return {"status": "not OK", "reason": "invalid payload"}, 400

        if value in app.data[key]["valids"]:
            app.redis.set(key, value)
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
            socketio.emit(name, {name: app.redis.get(name).decode()})
        except TypeError:
            pass

        socketio.sleep(app.sleep_time)


@socketio.event
def connect():
    """Make first connection to the client."""
    for item in ["style", "language"]:
        with app.data[item]["lock"]:
            app.data[item]["thread"] = socketio.start_background_task(get_thread, item)

            socketio.emit(item, {item: app.redis.get(thing).decode()})


if __name__ == "__main__":  # nocov
    socketio.run(app, host="0.0.0.0", debug=True)
