FROM python:3.9-slim

# Install Playwright and its dependencies
RUN pip install flask
RUN pip install playwright
RUN playwright install-deps webkit
RUN playwright install webkit

# Add the script
COPY webpagescreener.py webpagescreener.py

ENTRYPOINT ["python", "webpagescreener.py"]
