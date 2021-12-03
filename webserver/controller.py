import os
import socket
import subprocess
from threading import Lock
from time import sleep

import redis
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from tools import find_languages, find_styles, get_defaults, get_git_data
from werkzeug.exceptions import BadRequest

app = Flask(__name__)
app.redis = redis.Redis()
app.currents = get_defaults()
app.valids = {"style": find_styles(), "language": find_languages()}

app.threads = {
    "style": None,
    "language": None,
}

app.thread_locks = {"style": Lock(), "language": Lock()}

app.redis = redis.Redis()

ASYNC_MODE = None
socketio = SocketIO(app, async_mode=ASYNC_MODE, cors_allowed_origins="*")


@app.route("/", methods=["GET"])
def index():
    """Root route."""
    if request.accept_mimetypes["text/html"]:
        return render_template(
            "index.html",
            host_name=socket.gethostname(),
            languages=app.valids["language"],
            styles=app.valids["style"],
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
    if key in app.valids:
        data = {"status": "OK", key: app.currents[key]}

        value = app.redis.get(key)
        if value:
            value = value.decode()
            if value in app.valids[key]:
                data[key] = value

        return data

    return four_o_four()


@app.route("/<key>", methods=["POST"])
def set_thing(key):
    """Set something."""
    if key in app.valids:
        try:
            value = request.json["value"]
        except BadRequest:
            return {"status": "not OK", "reason": "invalid payload"}, 400

        if value in app.valids[key]:
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
            thing = app.redis.get(name)
            if thing:
                thing = thing.decode()

                if not thing == app.currents[name]:
                    app.currents[name] = thing
                    socketio.emit(name, {name: app.currents[name]})
        except TypeError:
            pass

        socketio.sleep(0.1)


@socketio.event
def connect():
    """Make first connection to the client."""
    for thing in ["style", "language"]:
        with app.thread_locks[thing]:
            app.threads[thing] = socketio.start_background_task(get_thread, thing)

        socketio.emit(thing, {thing: app.currents[thing]})


if __name__ == "__main__":  # nocov
    socketio.run(app, host="0.0.0.0", debug=True)
    # socketio.run(app, host="0.0.0.0", port="5001", debug=True)
