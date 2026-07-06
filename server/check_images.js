const mongoose = require('mongoose');
require('dotenv').config();
const Product = require('./models/Product');
const https = require('https');
const http = require('http');

async function checkImages() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopez');
  const products = await Product.find({}, '_id title mainImg');
  console.log('Total products:', products.length);

  const checkUrl = (url) => new Promise((resolve) => {
    try {
      const mod = url.startsWith('https') ? https : http;
      const req = mod.request(url, { method: 'HEAD', timeout: 5000 }, (res) => {
        resolve(res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.on('timeout', () => { req.destroy(); resolve(false); });
      req.end();
    } catch { resolve(false); }
  });

  const badIds = [];
  const batchSize = 20;

  for (let i = 0; i < products.length; i += batchSize) {
    const slice = products.slice(i, i + batchSize);
    const results = await Promise.all(slice.map(p => checkUrl(p.mainImg).then(ok => ({ ok, p }))));
    for (const { ok, p } of results) {
      if (!ok) {
        console.log('BAD:', p.title, '|', p.mainImg);
        badIds.push(p._id);
      }
    }
    process.stdout.write(`Checked ${Math.min(i + batchSize, products.length)}/${products.length}\r`);
  }

  if (badIds.length > 0) {
    await Product.deleteMany({ _id: { $in: badIds } });
    console.log('\nRemoved', badIds.length, 'products with broken image URLs');
  } else {
    console.log('\nAll product image URLs are reachable!');
  }

  await mongoose.disconnect();
}

checkImages().catch(console.error);
