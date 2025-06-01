from app import app

# Create a test client for our Flask app
client = app.test_client()

# 1) Test /initialize
resp1 = client.post(
    "/api/initialize",
    json={"code_path": "./core"}
)
print("INIT status:", resp1.status_code)
print("INIT data:  ", resp1.get_data(as_text=True))

# 2) Test /ask (only do this if INIT succeeded)
resp2 = client.post(
    "/api/ask",
    json={"question": "What does the embedder do?"}
)
print("ASK  status:", resp2.status_code)
print("ASK  data:  ", resp2.get_data(as_text=True))
