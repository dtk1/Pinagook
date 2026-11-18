/**
 * Complete Phase 1 Manifest Discovery Generator for test-english.com
 * Crawls all CEFR levels & categories and generates crawl_manifest.json
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');

const CATEGORIES = [
  { slug: 'grammar-points', name: 'grammar' },
  { slug: 'vocabulary', name: 'vocabulary' },
  { slug: 'listening', name: 'listening' },
  { slug: 'reading', name: 'reading' },
  { slug: 'use-of-english', name: 'use-of-english' },
];

const LEVELS = ['a1', 'a2', 'b1', 'b1-2', 'b2', 'c1'];

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
            'Accept-Encoding': 'gzip, deflate, br',
          },
        },
        (res) => {
          if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            let redirectUrl = res.headers.location;
            if (!redirectUrl.startsWith('http')) {
              redirectUrl = 'https://test-english.com' + redirectUrl;
            }
            return resolve(fetchUrl(redirectUrl));
          }

          let stream = res;
          const encoding = res.headers['content-encoding'];
          if (encoding === 'gzip') stream = res.pipe(zlib.createGunzip());
          else if (encoding === 'deflate') stream = res.pipe(zlib.createInflate());
          else if (encoding === 'br') stream = res.pipe(zlib.createBrotliDecompress());

          let data = '';
          stream.on('data', (chunk) => (data += chunk.toString('utf-8')));
          stream.on('end', () => resolve(data));
          stream.on('error', (err) => resolve(data || ''));
        }
      )
      .on('error', reject);
  });
}

function parseItemsFromHtml(html, catSlug, levelSlug) {
  const items = [];
  const normalizedLevel = levelSlug === 'b1-2' ? 'B1+' : levelSlug.toUpperCase();
  const categoryName = catSlug === 'grammar-points' ? 'grammar' : catSlug;

  // Match links in section catalog
  const linkRegex = new RegExp(
    `<a\\s+[^>]*href=["'](https:\\/\\/test-english\\.com\\/${catSlug}\\/${levelSlug}\\/([^"']+)\\/?)["'][^>]*>(.*?)<\\/a>`,
    'gis'
  );

  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const sourceUrl = match[1];
    let slug = match[2].replace(/\/$/, '');
    const innerHtml = match[3];

    if (!slug || slug.startsWith('contents-') || slug.startsWith('page') || slug === levelSlug) {
      continue;
    }

    // Extract title from title="..." attribute or <h4> content
    let title = slug.replace(/-/g, ' ');
    const titleAttr = match[0].match(/title=["']([^"']+)["']/i);
    const h4Match = innerHtml.match(/<h4[^>]*>(.*?)<\/h4>/i);

    if (titleAttr && titleAttr[1]) {
      title = titleAttr[1].trim();
    } else if (h4Match && h4Match[1]) {
      title = h4Match[1].replace(/<[^>]+>/g, '').trim();
    }

    items.push({
      id: `${normalizedLevel.toLowerCase().replace('+', 'plus')}-${slug}`,
      level: normalizedLevel,
      category: categoryName,
      title: title,
      source_url: sourceUrl.endsWith('/') ? sourceUrl : sourceUrl + '/',
      status: 'pending',
    });
  }

  return items;
}

async function runFullManifestBuild() {
  console.log('📋 Starting Phase 1: Two-Phase Pipeline Manifest Discovery...');
  const manifestMap = new Map();

  for (const cat of CATEGORIES) {
    for (const level of LEVELS) {
      const targetUrl = `https://test-english.com/${cat.slug}/${level}/`;
      console.log(`Scanning [${level.toUpperCase()}] ${cat.name}...`);

      try {
        const html = await fetchUrl(targetUrl);
        const items = parseItemsFromHtml(html, cat.slug, level);
        console.log(`  -> Discovered ${items.length} items`);

        for (const item of items) {
          if (!manifestMap.has(item.source_url)) {
            manifestMap.set(item.source_url, item);
          }
        }
      } catch (err) {
        console.error(`  ❌ Failed scanning ${targetUrl}:`, err.message);
      }
    }
  }

  const allItems = Array.from(manifestMap.values());
  const manifest = {
    total_items: allItems.length,
    scanned_at: new Date().toISOString(),
    items: allItems,
  };

  const outputPath = path.join(process.cwd(), 'crawl_manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log(`\n🎉 Manifest successfully written!`);
  console.log(`Path: ${outputPath}`);
  console.log(`Total cataloged lessons: ${manifest.total_items}`);
}

runFullManifestBuild();
