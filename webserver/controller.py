import os
import socket
import subprocess
from time import sleep

import redis
from flask import Flask, render_template, request
from tools import find_languages, find_styles, get_defaults

app = Flask(__name__)
app.redis = redis.Redis()

DEFAULTS = get_defaults()


@app.route("/", methods=["GET"])
def index():
    """Root route."""
    if request.accept_mimetypes["text/html"]:
        return render_template(
            "index.html",
            host_name=socket.gethostname(),
            languages=find_languages(),
            styles=find_styles(),
        )

    return {"status": "OK"}


@app.route("/reload", methods=["POST"])
def reload():
    """Reload the screen."""
    if "PLATFORM" in os.environ:
        if os.environ["PLATFORM"] == "docker":
            sleep(1)

            return {"status": "OK", "platform": "docker"}

    os.environ["DISPLAY"] = ":0"
    subprocess.run(("xdotool key F5").split(" "), check=True)
    sleep(1)

    return {"status": "OK"}


@app.route("/style", methods=["GET"])
def get_style():
    """Get the style."""
    style = app.redis.get("style")

    if style:
        style = style.decode()
    else:
        style = DEFAULTS["style"]

    return {"style": style}


@app.route("/style", methods=["POST"])
def set_style():
    """Set the style."""
    app.redis.set("style", request.json["value"])
    reload()

    return {"status": "OK"}


@app.route("/language", methods=["GET"])
def get_language():
    """Get the language."""
    language = app.redis.get("language")

    if language:
        language = language.decode()
    else:
        language = DEFAULTS["language"]

    return {"language": language}


@app.route("/language", methods=["POST"])
def set_language():
    """Set the language."""
    app.redis.set("language", request.json["value"])
    reload()

    return {"status": "OK"}


if __name__ == "__main__":  # nocov
    app.run(host="0.0.0.0", debug=True)
