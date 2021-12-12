import socket
from threading import Lock

from flask import Flask, render_template, request
from flask_socketio import SocketIO
from redis_manager import RedisManager
from tools import get_git_data

app = Flask(__name__)

app.keys = ["style", "language"]
app.threads = {}
for thing in app.keys:
    app.threads[thing] = {
        "thread": None,
        "lock": Lock(),
    }

app.env = "production"
app.redis_manager = RedisManager(namespace=app.env)
app.sleep_time = 1

socketio = SocketIO(app, cors_allowed_origins="*")


@app.route("/", methods=["GET"])
def index():
    """Root route."""
    if request.accept_mimetypes["text/html"]:
        return render_template(
            "index.html",
            host_name=socket.gethostname(),
            styles=app.redis_manager.valids("style"),
            languages=app.redis_manager.valids("language"),
            git_metadata=get_git_data(),
        )

    return {"status": "OK"}


@socketio.event
def connect():
    """Make first connection to the client."""
    for item in ["style", "language"]:
        with app.threads[item]["lock"]:
            app.threads[item]["thread"] = socketio.start_background_task(
                get_thread, item
            )

            socketio.emit(item, {item: app.redis_manager.current(item)})


@socketio.on("message")
def handle_message(data):
    """Handle an incoming request."""
    key, value = list(data.items())[0]
    if key in app.keys:
        if value in app.redis_manager.valids(key):
            app.redis_manager.set(key, value)


def get_thread(name):
    """Get a thread."""
    while True:
        try:
            if app.redis_manager.is_changed(name):
                socketio.emit(name, {name: app.redis_manager.current(name)})
                app.redis_manager.resolve(name)
                socketio.sleep(app.sleep_time)
        except TypeError:
            pass

        socketio.sleep(app.sleep_time)


if __name__ == "__main__":  # nocov
    socketio.run(app, host="0.0.0.0", debug=True)
