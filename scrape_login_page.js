import puppeteer from 'puppeteer';
// Or import puppeteer from 'puppeteer-core';
import fs from 'fs';

// using dotenv to load environment variables from a .env file
import dotenv from 'dotenv';
dotenv.config();

const TWITTER_USERNAME = process.env.X_USERNAME;
const TWITTER_PASSWORD = process.env.X_PASSWORD;

// Launch the browser and open a new blank page.
const browser = await puppeteer.launch({
    headless: false,
    args: [
        '--disable-blink-features=AutomationControlled',
        '--start-maximized'
    ]
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080 });
await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

// Navigate the page to a URL.
await page.goto('https://x.com/', {
    waitUntil: 'networkidle2',
});

// Wait for the sign in button to be rendered and click it.
await page.waitForSelector('a[href="/login"]');
await page.click('a[href="/login"]');

// wait for when this selector is visible: 'input[name="text"]', with a timeout of 10 seconds
await page.waitForSelector('input[name="text"]', { visible: true, timeout: 10000 });

// then on the form for username, fill in the username
await page.type('input[name="text"]', TWITTER_USERNAME, { delay: 100 });
await new Promise(r => setTimeout(r, 500 + Math.random() * 500));

// click on the next button of role button and text "Next</span></span>"
const nextButtonSelector = 'xpath///button[@role="button"][.//span[contains(text(), "Next")]]';
await page.waitForSelector(nextButtonSelector);
const nextButton = await page.$(nextButtonSelector);
await nextButton.scrollIntoView();
const box = await nextButton.boundingBox();
const x = box.x + (Math.random() * box.width);
const y = box.y + (Math.random() * box.height);

// Move mouse randomly before clicking
await page.mouse.move(100, 100);
await page.mouse.move(x, y, { steps: 10 });
await new Promise(r => setTimeout(r, 200 + Math.random() * 300));

await page.mouse.click(x, y);

// wait for when this selector is visible: 'input[name="password"]', with a timeout of 10 seconds
await page.waitForSelector('input[name="password"]', { visible: true, timeout: 10000 });

// Take a screenshot of the page.
await page.screenshot({
    path: 'login_page.png',
});


// Scrape the HTML content of the page.
const html = await page.content();
// write html to a new file called login_page.html

fs.writeFileSync('login_page.html', html);

// console.log(html);


await browser.close();