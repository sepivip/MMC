from playwright.sync_api import sync_playwright
import time

def verify_layout():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Helper to wait for hydration/loading
        def wait_for_page_load(page):
            page.wait_for_load_state('networkidle')
            time.sleep(2) # Extra buffer for animations/data fetching

        try:
            # Home
            print("Visiting Home...")
            page.goto("http://localhost:3000/")
            wait_for_page_load(page)
            page.screenshot(path="verification/home.png")

            # Watchlist
            print("Visiting Watchlist...")
            page.goto("http://localhost:3000/watchlist")
            wait_for_page_load(page)
            page.screenshot(path="verification/watchlist.png")

            # News
            print("Visiting News...")
            page.goto("http://localhost:3000/news")
            wait_for_page_load(page)
            page.screenshot(path="verification/news.png")

            # Alerts
            print("Visiting Alerts...")
            page.goto("http://localhost:3000/alerts")
            wait_for_page_load(page)
            page.screenshot(path="verification/alerts.png")

            # Metal Detail (using first metal ID from mock data usually 'GC=F' or similar)
            # Checking mockMetals in code to be sure.
            # GC=F is Gold.
            print("Visiting Metal Detail...")
            page.goto("http://localhost:3000/metal/GC=F")
            wait_for_page_load(page)
            page.screenshot(path="verification/metal.png")

        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_layout()
