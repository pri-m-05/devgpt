"""
app.py

Main Flask application entrypoint.
"""
from flask import Flask, request
from routes.api import api


# 1. Create Flask app
app = Flask(__name__)

# 2. Register the API blueprint under /api
app.register_blueprint(api, url_prefix='/api')
@app.before_request
def log_request():
    print("\n--- Received Request ---")
    print("Method:", request.method)
    print("Path:  ", request.path)
    print("Body:  ", request.get_data(as_text=True))
    print("------------------------\n")

print(app.url_map)

if __name__ == '__main__':
    # 3. Run the server in debug mode on port 5000
    app.run(host='0.0.0.0', port=5000, debug=True)
