from flask import Flask, request, abort
app = Flask(__name__)
WEBHOOK_SECRET = "mysecret"

@app.route("/webhook", methods=["POST"])
def webhook():
    if request.headers.get("X-Webhook-Secret") != WEBHOOK_SECRET:
        abort(401)
    data = request.json
    print("Received:", data)
    return "", 200

if __name__ == "__main__":
    app.run(port=8080)