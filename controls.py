import os
import subprocess

from flask import Flask, render_template, request

app = Flask(__name__)


@app.route("/", methods=["GET"])
def index():
    if request.accept_mimetypes["text/html"]:
        return render_template(
            "index.html"
        )


@app.route("/cycle-style", methods=["POST"])
def cycle_style():
    os.environ["DISPLAY"] = ":0"
    subprocess.run(("xdotool click 1").split(" "))
    return {"status": "OK"}


@app.route("/reload", methods=["POST"])
def reload():
    os.environ["DISPLAY"] = ":0"
    subprocess.run(("xdotool key F5").split(" "))
    return {"status": "OK"}


if __name__ == "__main__":  # nocov
    app.run(host="0.0.0.0", debug=True)
