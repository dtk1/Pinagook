/**
 * Test-English Two-Phase Pipeline: Phase 1 Inventory & Discovery Script
 * Scans all CEFR levels & skill categories from test-english.com
 * Produces crawl_manifest.json with absolute URLs, levels, and categories.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');

const CATEGORIES = [
  { slug: 'grammar-points', name: 'Grammar' },
  { slug: 'vocabulary', name: 'Vocabulary' },
  { slug: 'listening', name: 'Listening' },
  { slug: 'reading', name: 'Reading' },
  { slug: 'use-of-english', name: 'Use of English' },
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
              'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept-Encoding': 'gzip, deflate, br',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
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
          if (encoding === 'gzip') {
            stream = res.pipe(zlib.createGunzip());
          } else if (encoding === 'deflate') {
            stream = res.pipe(zlib.createInflate());
          } else if (encoding === 'br') {
            stream = res.pipe(zlib.createBrotliDecompress());
          }

          let data = '';
          stream.on('data', (chunk) => (data += chunk.toString('utf-8')));
          stream.on('end', () => resolve(data));
          stream.on('error', (err) => resolve(data || ''));
        }
      )
      .on('error', reject);
  });
}

function extractLessonLinks(html, categorySlug, levelSlug) {
  const items = [];
  const normalizedLevel =
    levelSlug === 'b1-2'
      ? 'B1+'
      : levelSlug.toUpperCase();

  // Match hrefs with class="pill hoverable" or test-english.com links
  const hrefRegex = /href=["'](https:\/\/test-english\.com\/[^"']+)["']/gi;
  let match;

  while ((match = hrefRegex.exec(html)) !== null) {
    const href = match[1];

    if (!href.includes(`/${categorySlug}/${levelSlug}/`)) {
      continue;
    }

    const relativePath = href.split(`/${categorySlug}/${levelSlug}/`)[1];
    if (!relativePath) continue;

    const slug = relativePath.replace(/\/$/, '').split('/')[0];
    if (!slug || slug.startsWith('contents-') || slug.startsWith('page') || slug === levelSlug) {
      continue;
    }

    // Snippet around match to grab title="..." or <h4>...</h4>
    const contextSnippet = html.substring(match.index, match.index + 400);
    const titleAttr = contextSnippet.match(/title=["']([^"']+)["']/i);
    const h4Attr = contextSnippet.match(/4>([^<]+)<\/h4>/i);

    let title = slug.replace(/-/g, ' ');
    if (titleAttr && titleAttr[1]) {
      title = titleAttr[1].trim();
    } else if (h4Attr && h4Attr[1]) {
      title = h4Attr[1].trim();
    }

    items.push({
      id: `${normalizedLevel.toLowerCase().replace('+', 'plus')}-${slug}`,
      level: normalizedLevel,
      category: categorySlug === 'grammar-points' ? 'Grammar' : categorySlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      title: title,
      source_url: href.endsWith('/') ? href : href + '/',
      status: 'pending',
    });
  }

  return items;
}

async function runInventoryDiscovery() {
  console.log('🔍 Phase 1: Starting Inventory & Discovery Crawl of test-english.com...');
  const manifestMap = new Map();

  for (const cat of CATEGORIES) {
    for (const level of LEVELS) {
      const indexUrl = `https://test-english.com/${cat.slug}/${level}/`;
      console.log(`Scanning [${level.toUpperCase()}] ${cat.name}: ${indexUrl}`);

      try {
        const html = await fetchUrl(indexUrl);
        const discovered = extractLessonLinks(html, cat.slug, level);
        console.log(` -> Discovered ${discovered.length} items.`);

        for (const item of discovered) {
          if (!manifestMap.has(item.source_url)) {
            manifestMap.set(item.source_url, item);
          }
        }
      } catch (err) {
        console.error(` ❌ Error scanning ${indexUrl}:`, err.message);
      }
    }
  }

  const manifestItems = Array.from(manifestMap.values());
  const manifestData = {
    total_items: manifestItems.length,
    scanned_at: new Date().toISOString(),
    items: manifestItems,
  };

  const outputPath = path.join(process.cwd(), 'crawl_manifest.json');
  fs.writeFileSync(outputPath, JSON.stringify(manifestData, null, 2), 'utf-8');

  console.log(`\n✅ Phase 1 Inventory Discovery Complete!`);
  console.log(`Total unique lessons cataloged: ${manifestData.total_items}`);
  console.log(`Manifest written to: ${outputPath}`);
}

runInventoryDiscovery();
