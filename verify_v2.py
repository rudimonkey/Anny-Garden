import asyncio
from playwright.async_api import async_playwright
import os

async def run():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Set viewport to a standard desktop size
        await page.set_viewport_size({"width": 1280, "height": 800})

        os.makedirs('verification/screenshots', exist_ok=True)

        print("Taking Home page screenshot...")
        await page.goto("http://localhost:3000/")
        await page.wait_for_timeout(5000) # Wait for images to load
        await page.screenshot(path="verification/screenshots/home_v2.png", full_page=True)

        print("Taking Search page screenshot...")
        await page.goto("http://localhost:3000/search")
        await page.wait_for_timeout(5000)
        await page.screenshot(path="verification/screenshots/search_v2.png", full_page=True)

        print("Taking Detail page (Monstera) screenshot...")
        await page.goto("http://localhost:3000/plants/monstera")
        await page.wait_for_timeout(5000)
        await page.screenshot(path="verification/screenshots/detail_monstera_v2.png", full_page=True)

        print("Taking Detail page (Aloe Vera) screenshot...")
        await page.goto("http://localhost:3000/plants/aloe-vera")
        await page.wait_for_timeout(5000)
        await page.screenshot(path="verification/screenshots/detail_aloe_v2.png", full_page=True)

        await browser.close()
        print("Screenshots taken successfully.")

if __name__ == "__main__":
    asyncio.run(run())
