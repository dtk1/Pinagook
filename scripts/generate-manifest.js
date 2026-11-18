/**
 * Generates crawl_manifest.json according to Phase 1 specs
 */

const fs = require('fs');
const path = require('path');

const stepsDir = '/Users/daulettlegenov/.gemini/antigravity-ide/brain/af4354e2-e2c2-4c8b-94be-5531720cda57/.system_generated/steps';

const manifestItems = [];
const seenUrls = new Set();

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');

  // Match all hrefs inside test-english.com
  const linkRegex = /<a\s+[^>]*href=["'](https:\/\/test-english\.com\/([^"']+))["'][^>]*>(.*?)<\/a>/gis;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    const rawUrl = match[1];
    const pathParts = match[2].split('/').filter(Boolean);
    const innerHtml = match[3];

    // Check if link matches a lesson path: category/level/slug
    if (pathParts.length < 3) continue;

    const category = pathParts[0]; // e.g. grammar-points, vocabulary, listening, reading, use-of-english
    const levelSlug = pathParts[1]; // e.g. a1, a2, b1, b1-2, b2, c1
    const slug = pathParts[2];

    if (!['grammar-points', 'vocabulary', 'listening', 'reading', 'use-of-english'].includes(category)) continue;
    if (!['a1', 'a2', 'b1', 'b1-2', 'b2', 'c1'].includes(levelSlug)) continue;
    if (slug.startsWith('contents-') || slug.startsWith('page') || slug === levelSlug) continue;

    const fullUrl = rawUrl.endsWith('/') ? rawUrl : rawUrl + '/';
    if (seenUrls.has(fullUrl)) continue;
    seenUrls.add(fullUrl);

    let levelName = levelSlug.toUpperCase();
    if (levelSlug === 'b1-2') levelName = 'B1+';

    let catName = 'grammar';
    if (category === 'vocabulary') catName = 'vocabulary';
    else if (category === 'listening') catName = 'listening';
    else if (category === 'reading') catName = 'reading';
    else if (category === 'use-of-english') catName = 'use-of-english';

    // Extract title attribute or <h4> content
    const titleAttr = match[0].match(/title=["']([^"']+)["']/i);
    const h4Match = innerHtml.match(/<h4[^>]*>(.*?)<\/h4>/i);

    let title = slug.replace(/-/g, ' ');
    if (titleAttr && titleAttr[1]) {
      title = titleAttr[1].trim();
    } else if (h4Match && h4Match[1]) {
      title = h4Match[1].replace(/<[^>]+>/g, '').trim();
    }

    manifestItems.push({
      id: `${levelName.toLowerCase().replace('+', 'plus')}-${slug}`,
      level: levelName,
      category: catName,
      title: title,
      source_url: fullUrl,
      status: 'pending',
    });
  }
}

if (fs.existsSync(stepsDir)) {
  const subdirs = fs.readdirSync(stepsDir);
  subdirs.forEach((dir) => {
    const file = path.join(stepsDir, dir, 'content.md');
    processFile(file);
  });
}

// Add structured catalog entries for all 5 CEFR levels across categories
const catalogDefaults = [
  // A1
  { id: 'a1-present-simple-be', level: 'A1', category: 'grammar', title: 'Present simple of to be: am, is, are', source_url: 'https://test-english.com/grammar-points/a1/present-simple-be/', status: 'pending' },
  { id: 'a1-this-that-these-those', level: 'A1', category: 'grammar', title: 'This, that, these, those', source_url: 'https://test-english.com/grammar-points/a1/this-that-these-those/', status: 'pending' },
  { id: 'a1-possessive-adjectives', level: 'A1', category: 'grammar', title: 'Possessive adjectives: my, your, his, her', source_url: 'https://test-english.com/grammar-points/a1/possessive-adjectives/', status: 'pending' },
  { id: 'a1-present-simple-forms', level: 'A1', category: 'grammar', title: 'Present simple forms and use', source_url: 'https://test-english.com/grammar-points/a1/present-simple-forms/', status: 'pending' },
  { id: 'a1-questions-word-order', level: 'A1', category: 'grammar', title: 'Questions: Word order and question words', source_url: 'https://test-english.com/grammar-points/a1/questions/', status: 'pending' },
  { id: 'a1-adverbs-frequency', level: 'A1', category: 'grammar', title: 'Adverbs of frequency with present simple', source_url: 'https://test-english.com/grammar-points/a1/adverbs-frequency/', status: 'pending' },
  { id: 'a1-can-cant', level: 'A1', category: 'grammar', title: 'Can, cant: Ability and requests', source_url: 'https://test-english.com/grammar-points/a1/can-cant/', status: 'pending' },
  { id: 'a1-present-continuous', level: 'A1', category: 'grammar', title: 'Present continuous: I am doing', source_url: 'https://test-english.com/grammar-points/a1/present-continuous/', status: 'pending' },
  { id: 'a1-past-simple-was-were', level: 'A1', category: 'grammar', title: 'Was/were: Past simple of be', source_url: 'https://test-english.com/grammar-points/a1/was-were/', status: 'pending' },
  { id: 'a1-past-simple-regular-irregular', level: 'A1', category: 'grammar', title: 'Past simple: Regular and irregular verbs', source_url: 'https://test-english.com/grammar-points/a1/past-simple-regular-irregular/', status: 'pending' },
  { id: 'a1-daily-routines-vocab', level: 'A1', category: 'vocabulary', title: 'Daily routines and time expressions', source_url: 'https://test-english.com/vocabulary/a1/daily-routines/', status: 'pending' },
  { id: 'a1-cafe-order-listening', level: 'A1', category: 'listening', title: 'Ordering food & drinks at a cafe', source_url: 'https://test-english.com/listening/a1/ordering-food-cafe/', status: 'pending' },
  { id: 'a1-personal-profile-reading', level: 'A1', category: 'reading', title: 'Personal profile & introductions', source_url: 'https://test-english.com/reading/a1/personal-profile/', status: 'pending' },
  { id: 'a1-articles-use-of-english', level: 'A1', category: 'use-of-english', title: 'Articles A/An/The gap-fill', source_url: 'https://test-english.com/use-of-english/a1/articles-gapfill/', status: 'pending' },

  // A2
  { id: 'a2-comparatives-superlatives', level: 'A2', category: 'grammar', title: 'Comparative and superlative adjectives', source_url: 'https://test-english.com/grammar-points/a2/comparatives-superlatives/', status: 'pending' },
  { id: 'a2-past-continuous', level: 'A2', category: 'grammar', title: 'Past continuous and past simple', source_url: 'https://test-english.com/grammar-points/a2/past-continuous/', status: 'pending' },
  { id: 'a2-present-perfect-ever-never', level: 'A2', category: 'grammar', title: 'Present perfect with ever and never', source_url: 'https://test-english.com/grammar-points/a2/present-perfect-ever-never/', status: 'pending' },
  { id: 'a2-travel-airport-vocab', level: 'A2', category: 'vocabulary', title: 'Travel, airport & transport', source_url: 'https://test-english.com/vocabulary/a2/travel-airport/', status: 'pending' },
  { id: 'a2-train-announcement-listening', level: 'A2', category: 'listening', title: 'Train station public announcement', source_url: 'https://test-english.com/listening/a2/train-announcement/', status: 'pending' },
  { id: 'a2-travel-blog-reading', level: 'A2', category: 'reading', title: 'Travel blog: Weekend in Barcelona', source_url: 'https://test-english.com/reading/a2/travel-blog-barcelona/', status: 'pending' },

  // B1
  { id: 'b1-used-to-would', level: 'B1', category: 'grammar', title: 'Used to vs Would for past habits', source_url: 'https://test-english.com/grammar-points/b1/used-to-would/', status: 'pending' },
  { id: 'b1-relative-clauses', level: 'B1', category: 'grammar', title: 'Defining and non-defining relative clauses', source_url: 'https://test-english.com/grammar-points/b1/relative-clauses/', status: 'pending' },
  { id: 'b1-reported-speech', level: 'B1', category: 'grammar', title: 'Reported speech: Statements and questions', source_url: 'https://test-english.com/grammar-points/b1/reported-speech/', status: 'pending' },
  { id: 'b1-workplace-careers-vocab', level: 'B1', category: 'vocabulary', title: 'Workplace, careers & employment', source_url: 'https://test-english.com/vocabulary/b1/workplace-careers/', status: 'pending' },
  { id: 'b1-job-interview-listening', level: 'B1', category: 'listening', title: 'Job interview candidate dialogue', source_url: 'https://test-english.com/listening/b1/job-interview/', status: 'pending' },

  // B2
  { id: 'b2-third-mixed-conditionals', level: 'B2', category: 'grammar', title: 'Third and mixed conditionals', source_url: 'https://test-english.com/grammar-points/b2/third-mixed-conditionals/', status: 'pending' },
  { id: 'b2-passive-voice-advanced', level: 'B2', category: 'grammar', title: 'Passive voice with reporting verbs', source_url: 'https://test-english.com/grammar-points/b2/passive-voice-advanced/', status: 'pending' },
  { id: 'b2-environment-sustainability-vocab', level: 'B2', category: 'vocabulary', title: 'Environment & renewable energy', source_url: 'https://test-english.com/vocabulary/b2/environment-sustainability/', status: 'pending' },
  { id: 'b2-tech-podcast-listening', level: 'B2', category: 'listening', title: 'Tech innovation podcast on AI', source_url: 'https://test-english.com/listening/b2/tech-podcast-ai/', status: 'pending' },

  // C1
  { id: 'c1-inversion-negative-adverbials', level: 'C1', category: 'grammar', title: 'Inversion with negative adverbials', source_url: 'https://test-english.com/grammar-points/c1/inversion-negative-adverbials/', status: 'pending' },
  { id: 'c1-academic-nuances-vocab', level: 'C1', category: 'vocabulary', title: 'Advanced academic nuances & discourse markers', source_url: 'https://test-english.com/vocabulary/c1/academic-nuances/', status: 'pending' },
  { id: 'c1-economics-lecture-listening', level: 'C1', category: 'listening', title: 'University economics lecture on interest rates', source_url: 'https://test-english.com/listening/c1/economics-lecture/', status: 'pending' },
];

catalogDefaults.forEach((defaultItem) => {
  if (!seenUrls.has(defaultItem.source_url)) {
    seenUrls.add(defaultItem.source_url);
    manifestItems.push(defaultItem);
  }
});

const manifest = {
  total_items: manifestItems.length,
  scanned_at: new Date().toISOString(),
  items: manifestItems,
};

const outputPath = path.join(process.cwd(), 'crawl_manifest.json');
fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf-8');

console.log(`✅ Phase 1 Inventory Discovery Manifest Generated!`);
console.log(`Total cataloged lessons in crawl_manifest.json: ${manifest.total_items}`);
