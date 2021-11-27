import os
import socket
import subprocess
from time import sleep

import redis
from flask import Flask, render_template, request
from tools import find_languages, find_styles, get_defaults

app = Flask(__name__)
app.redis = redis.Redis()
app.defaults = get_defaults()
app.valids = {"style": find_styles(), "language": find_languages()}


@app.route("/", methods=["GET"])
def index():
    """Root route."""
    if request.accept_mimetypes["text/html"]:
        return render_template(
            "index.html",
            host_name=socket.gethostname(),
            languages=app.valids["language"],
            styles=app.valids["style"],
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
        data = {"status": "OK", key: app.defaults[key]}

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
        value = request.json["value"]
        if value in app.valids[key]:
            app.redis.set(key, value)
            reload()
            return {"status": "OK", key: value}

        return {"status": "not OK", "reason": f"invalid {key}"}, 400

    return four_o_four()


def four_o_four():
    """Return a 404."""
    return {"status": "not OK", "reason": "that's not a thing I know about"}, 404


if __name__ == "__main__":  # nocov
    app.run(host="0.0.0.0", debug=True)
