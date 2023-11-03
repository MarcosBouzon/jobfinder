from app import app, socketio

if __name__ == "__main__":
    # app.run(host="0.0.0.0", port=5100)
    socketio.run(app=app, host="0.0.0.0", port=5100)