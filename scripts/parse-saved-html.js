const fs = require('fs');

const filePath = '/Users/daulettlegenov/.gemini/antigravity-ide/brain/af4354e2-e2c2-4c8b-94be-5531720cda57/.system_generated/steps/473/content.md';
const content = fs.readFileSync(filePath, 'utf-8');

const regex = /<a\s+[^>]*href=["'](https:\/\/test-english\.com\/grammar-points\/a1\/([^"']+)\/?)["'][^>]*>(.*?)<\/a>/gis;

const items = [];
let match;

while ((match = regex.exec(content)) !== null) {
  const url = match[1];
  const slug = match[2];
  const inner = match[3];

  if (slug === 'contents-a1' || slug.startsWith('page') || !slug) continue;

  const titleMatch = match[0].match(/title=["']([^"']+)["']/i) || inner.match(/4>([^<]+)<\/h4>/i);
  const title = titleMatch ? titleMatch[1].trim() : slug.replace(/-/g, ' ');

  items.push({
    id: `a1-${slug}`,
    level: 'A1',
    category: 'Grammar',
    title: title,
    source_url: url.endsWith('/') ? url : url + '/',
    status: 'pending'
  });
}

console.log(`Extracted ${items.length} A1 Grammar items:`);
console.log(JSON.stringify(items, null, 2));
