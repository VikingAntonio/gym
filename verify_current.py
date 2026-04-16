import http.server
import threading
import socketserver
from playwright.sync_api import sync_playwright

PORT = 8004
DIRECTORY = "docs"

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        httpd.serve_forever()

threading.Thread(target=run_server, daemon=True).start()

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={'width': 375, 'height': 812})
    page.goto(f"http://localhost:{PORT}/pricing.html")
    page.wait_for_timeout(2000)
    page.screenshot(path="current_mobile.png")
    page.evaluate("window.scrollTo(0, 1000)")
    page.wait_for_timeout(1000)
    page.screenshot(path="current_mobile_scroll.png")
    browser.close()
