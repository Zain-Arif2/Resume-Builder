import puppeteer from "puppeteer";

let browser = null;
const pagePool = [];
const MAX_PAGES = 5;

async function launchBrowser() {
  if (browser) return browser;

  browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-background-timer-throttling",
      "--disable-renderer-backgrounding",
    ],
  });

  browser.on("disconnected", () => {
    browser = null;
    pagePool.length = 0;
    console.log("❌ Browser disconnected");
  });

  console.log("✅ Browser Started");

  return browser;
}

export async function getPage() {
  const browser = await launchBrowser();

  if (pagePool.length > 0) {
    return pagePool.pop();
  }

  return await browser.newPage();
}

export async function releasePage(page) {
  if (!page) return;

  try {
    await page.goto("about:blank");

    if (pagePool.length < MAX_PAGES) {
      pagePool.push(page);
    } else {
      await page.close();
    }
  } catch {
    try {
      await page.close();
    } catch {}
  }
}

export async function closeBrowser() {
  if (!browser) return;

  for (const page of pagePool) {
    try {
      await page.close();
    } catch {}
  }

  pagePool.length = 0;

  await browser.close();

  browser = null;
}