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
            languages=find_languages(),
            styles=find_styles(),
        )

    return {"status": "OK"}


@app.route("/reload", methods=["POST"])
def reload():
    """Reload the screen."""
    if "PLATFORM" in os.environ:
        if os.environ["PLATFORM"] == "docker":
            sleep(0.1)
            return {"status": "OK", "platform": "docker"}

    os.environ["DISPLAY"] = ":0"
    subprocess.run(("xdotool key F5").split(" "), check=True)
    sleep(1)
    return {"status": "OK"}


@app.route("/style", methods=["GET"])
def get_style():
    """Get the language."""
    style = app.redis.get("style")

    if style:
        style = style.decode()
    else:
        style = "blue-orange"

    return {"style": style}


@app.route("/style", methods=["POST"])
def set_style():
    """Set the language."""
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
        language = "en"

    return {"language": language}


@app.route("/language", methods=["POST"])
def set_language():
    """Set the language."""
    app.redis.set("language", request.json["value"])
    reload()

    return {"status": "OK"}


def find_styles():
    """Find the available styles."""
    return sorted(
        list(
            map(
                lambda x: Path(x).stem,
                filter(
                    lambda x: x.endswith(".css"), (os.listdir("../static/css/clocks"))
                ),
            )
        )
    )


def find_languages():
    """Find the available languages."""
    languages = {}
    lang_root = "../static/js/modules/internationalisation/languages"
    files = os.listdir(lang_root)
    for file in files:
        # we have to parse fucking ES6 because ES6 cannot natively read fucking JSON
        posix = Path(lang_root, file)
        content = posix.read_text(encoding="UTF-8")
        name = list(filter(lambda x: "name:" in x, content.split("\n")))[0].split('"')[
            1
        ]
        languages[posix.stem] = name

    return languages


if __name__ == "__main__":  # nocov
    app.run(host="0.0.0.0", debug=True)
