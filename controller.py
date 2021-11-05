import os
import socket
import subprocess
from pathlib import Path
from time import sleep

import redis
from flask import Flask, render_template, request

app = Flask(__name__)
app.redis = redis.Redis()


@app.route("/", methods=["GET"])
def index():
    """Root route."""
    if request.accept_mimetypes["text/html"]:
        return render_template(
            "index.html",
            host_name=socket.gethostname(),
            arrow_svg=Path("templates/images/arrow.svg").read_text(encoding="UTF-8"),
        )


@app.route("/cycle-style", methods=["POST"])
def cycle_style():
    """Send a click to the screen to move to the next stylesheet."""
    os.environ["DISPLAY"] = ":0"
    subprocess.run(("xdotool click 1").split(" "), check=True)

    # the clock has a 1-second fade-out / 1-second fade-in
    sleep(2)

    return {"status": "OK"}


@app.route("/reload", methods=["POST"])
def reload():
    """Reload the screen."""
    os.environ["DISPLAY"] = ":0"
    subprocess.run(("xdotool key F5").split(" "), check=True)
    sleep(1)

    return {"status": "OK"}


@app.route("/language", methods=["GET"])
def get_language():
    """Get the language."""
    language = app.redis.get("language")

    if language:
        language = language.decode()
    else:
        language = "en"

    return {"language": language}


@app.route("/language", methods=["POST"])
def set_language():
    """Set the language."""
    app.redis.set("language", request.json["language"])
    reload()

    return {"status": "OK"}


if __name__ == "__main__":  # nocov
    app.run(host="0.0.0.0", debug=True)
