
import asyncio
from playwright.async_api import async_playwright
import os
import http.server
import socketserver
import threading

def run_server():
    os.chdir("docs")
    with socketserver.TCPServer(("", 8001), http.server.SimpleHTTPRequestHandler) as httpd:
        print("serving at port 8001")
        httpd.serve_forever()

async def main():
    # Start server in thread
    t = threading.Thread(target=run_server, daemon=True)
    t.start()

    # Wait for server
    await asyncio.sleep(2)

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Capture screenshots for visual check of "Pro" design
        pages = [
            "index.html",
            "admin.html",
            "adminRutinas.html",
            "adminNutricion.html",
            "adminEntrenadores.html",
            "rutinas.html",
            "nutricion.html"
        ]

        if not os.path.exists('verification/pro_screenshots'):
            os.makedirs('verification/pro_screenshots')

        for pg in pages:
            print(f"Capturing {pg}...")
            await page.goto(f"http://localhost:8001/{pg}")
            await asyncio.sleep(1) # Wait for Supabase load
            await page.screenshot(path=f"verification/pro_screenshots/{pg.replace('.html', '.png')}")

        await browser.close()
        print("Final visual verification complete!")

if __name__ == "__main__":
    asyncio.run(main())
