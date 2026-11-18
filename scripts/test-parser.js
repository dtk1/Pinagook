const { chromium } = require('playwright');

async function testParse() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const url = 'https://test-english.com/grammar-points/a1/a-some-any-countable-uncountable/';
  console.log(`Navigating to ${url}...`);
  await page.goto(url, { waitUntil: 'domcontentloaded' });

  // Extract explanation text & tables
  const explanation = await page.evaluate(() => {
    const expEl = document.querySelector('.explanation-content, #primary, article, .entry-content');
    return expEl ? expEl.innerText : '';
  });

  // Extract quiz questions
  const questions = await page.evaluate(() => {
    const qEls = Array.from(document.querySelectorAll('.watupro_question, .question, .test-item'));
    return qEls.map(el => el.innerText.trim()).filter(Boolean);
  });

  console.log('--- EXPLANATION SAMPLE ---');
  console.log(explanation.substring(0, 500));
  console.log('\n--- QUESTIONS SAMPLE ---');
  console.log(questions.slice(0, 3));

  await browser.close();
}

testParse();
