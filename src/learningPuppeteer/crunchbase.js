import puppeteer from 'puppeteer';

export async function randomWait(fixedMs, randomdMs) {
  let ms = Math.floor(Math.random() * randomdMs);
  ms = ms + fixedMs;

  await new Promise((_func) => setTimeout(_func, ms));
}
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate to login page
  await page.goto('https://www.crunchbase.com/login', {
    waitUntil: 'networkidle0',
  });

  // Enter credentials and login
  await page.type('#mat-input-0', 'adil2mae@gmail.com');
  await page.type('#mat-input-1', 'Crunchbaseskhon1-');
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle0' }),
    page.click('.login-btn'),
  ]);

  // Navigate to OpenAI's company page
  await page.goto(
    'https://www.crunchbase.com/organization/openai/company_financials',
    { waitUntil: 'networkidle0' },
  );

  // Wait for the desired element to appear on the page
  await page.waitForSelector(
    '#mat-tab-nav-panel-0 > div > div > page-centered-layout.overview-divider.ng-star-inserted > div > row-card > div > div:nth-child(1) > profile-section > section-card > mat-card > div.section-content-wrapper > anchored-values > div:nth-child(6) > a > div > field-formatter > span',
  );

  // Get the HTML and parse it using a query selector
  const html = await page.evaluate(() => {
    const element = document.querySelector(
      '#mat-tab-nav-panel-0 > div > div > page-centered-layout.overview-divider.ng-star-inserted > div > row-card > div > div:nth-child(1) > profile-section > section-card > mat-card > div.section-content-wrapper > anchored-values > div:nth-child(6) > a > div > field-formatter > span',
    );

    return element.textContent;
  });

  console.log(html);

  // Close the browser
  await browser.close();
})();
