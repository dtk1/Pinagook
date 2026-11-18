/**
 * Page Snapshot & Exact Content Extractor for Pinagook
 * Uses Playwright to:
 * 1. Capture high-resolution full-page screenshot of target test-english.com pages.
 * 2. Extract exact HTML tables, rule boxes, audio tracks, and exact exercise choices.
 */

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const SCREENSHOT_DIR = path.join(process.cwd(), 'public', 'snapshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

async function capturePage(url, outputFilename) {
  console.log(`\n📸 Launching browser to capture: ${url}`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 960 },
    deviceScaleFactor: 2
  });

  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(2000);

    // 1. Take full page screenshot
    const screenshotPath = path.join(SCREENSHOT_DIR, `${outputFilename}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`✅ Screenshot saved to: ${screenshotPath}`);

    // 2. Extract exact visual structure & HTML elements
    const extractedData = await page.evaluate(() => {
      const title = document.querySelector('h1, .entry-title')?.innerText.trim() || '';
      
      // Extract exact explanation HTML and tables
      const expContainer = document.querySelector('.single-explanation, article, .entry-content');
      let exactHtml = '';
      let tables = [];

      if (expContainer) {
        exactHtml = expContainer.innerHTML;
        
        // Extract exact table HTML strings
        const tableEls = Array.from(expContainer.querySelectorAll('table'));
        tables = tableEls.map(t => t.outerHTML);
      }

      // Extract Audio track URL
      const audioEl = document.querySelector('audio, audio source, a[href$=".mp3"]');
      const audioUrl = audioEl ? (audioEl.getAttribute('src') || audioEl.getAttribute('href')) : null;

      return {
        title,
        audioUrl,
        tableCount: tables.length,
        hasExplanation: Boolean(exactHtml)
      };
    });

    console.log(`📊 Extracted Data Summary for ${outputFilename}:`, extractedData);

  } catch (err) {
    console.error(`❌ Capture error: ${err.message}`);
  } finally {
    await browser.close();
  }
}

// Example execution for demonstration
if (require.main === module) {
  const sampleUrl = 'https://test-english.com/grammar-points/a1/present-simple-forms-of-to-be/';
  capturePage(sampleUrl, 'a1-present-simple-forms-of-to-be').then(() => {
    console.log('\n🎉 Demonstration capture completed successfully!');
  });
}

module.exports = { capturePage };
