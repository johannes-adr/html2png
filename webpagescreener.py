from flask import Flask, request, send_file, jsonify
from io import BytesIO
from playwright.sync_api import sync_playwright

app = Flask(__name__)

# Define a password for the API
API_PASSWORD = "vAQ38U8CTuTk"

def capture_screenshot(url):
    try:
        with sync_playwright() as p:
            # Launch WebKit browser in headless mode
            browser = p.webkit.launch(headless=True)
            context = browser.new_context(viewport={"width": 1920, "height": 1080})
            page = context.new_page()

            # Navigate to the provided URL
            page.goto(url)

            # Capture a screenshot
            screenshot = page.screenshot()

            # Close the browser
            browser.close()

            return screenshot
    except Exception as e:
        return str(e)

@app.route("/screenshot", methods=["GET"])
def screenshot():
    # Get the URL and password from the query parameters
    url = request.args.get("url")
    password = request.args.get("password")

    # Check if the password is provided and correct
    if password != API_PASSWORD:
        return jsonify({"error": "Unauthorized: Incorrect password."}), 401

    # Check if the URL is provided
    if not url:
        return jsonify({"error": "Bad Request: 'url' parameter is required."}), 400

    # Capture the screenshot
    screenshot = capture_screenshot(url)

    # Handle errors during screenshot capture
    if isinstance(screenshot, str):
        return jsonify({"error": screenshot}), 500

    # Return the screenshot as a response
    return send_file(
        BytesIO(screenshot),
        mimetype="image/png",
        as_attachment=False,
        download_name="screenshot.png"
    )

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
