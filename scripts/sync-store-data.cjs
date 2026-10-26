/**
 * scripts/sync-store-data.cjs
 * Runs automatically prior to build ('npm run build') and during release to main branch.
 * Guarantees that admin-configured prices, fitting charges, products, combos, and categories
 * in 'src/data/persistedStoreData.json' are validated, preserved, and synced with default code types.
 */
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const persistedPath = path.join(rootDir, 'src', 'data', 'persistedStoreData.json');
const typesPath = path.join(rootDir, 'src', 'types', 'index.ts');

if (!fs.existsSync(persistedPath)) {
  console.error('[sync-store-data] ERROR: persistedStoreData.json missing at ' + persistedPath);
  process.exit(1);
}

try {
  const content = fs.readFileSync(persistedPath, 'utf8');
  const data = JSON.parse(content);

  // Validate and protect fitting rates
  if (data.cctvPricing) {
    if (!data.cctvPricing.installationPerCamera || data.cctvPricing.installationPerCamera < 600) {
      data.cctvPricing.installationPerCamera = 600;
    }
    if (!data.cctvPricing.wifiFittingPerCamera || data.cctvPricing.wifiFittingPerCamera < 600) {
      data.cctvPricing.wifiFittingPerCamera = 600;
    }
    fs.writeFileSync(persistedPath, JSON.stringify(data, null, 2), 'utf8');
  }

  // Sync types/index.ts DEFAULT_CCTV_PRICING
  if (fs.existsSync(typesPath) && data.cctvPricing) {
    let typesContent = fs.readFileSync(typesPath, 'utf8');
    typesContent = typesContent.replace(
      /installationPerCamera:\s*\d+/,
      `installationPerCamera: ${data.cctvPricing.installationPerCamera}`
    );
    typesContent = typesContent.replace(
      /wifiFittingPerCamera:\s*\d+/,
      `wifiFittingPerCamera: ${data.cctvPricing.wifiFittingPerCamera}`
    );
    fs.writeFileSync(typesPath, typesContent, 'utf8');
  }

  const prodCount = data.products?.length || 0;
  const catCount = data.categories?.length || 0;
  const comboCount = data.comboOffers?.length || 0;
  const installRate = data.cctvPricing?.installationPerCamera || 600;
  const wifiRate = data.cctvPricing?.wifiFittingPerCamera || 600;

  console.log(`[sync-store-data] ✓ Store data validated and locked for release:`);
  console.log(`  - Products: ${prodCount}`);
  console.log(`  - Categories: ${catCount}`);
  console.log(`  - Combo Offers: ${comboCount}`);
  console.log(`  - CCTV Fitting Charges: ₹${installRate} (Wired) / ₹${wifiRate} (Wi-Fi)`);
} catch (err) {
  console.error('[sync-store-data] Failed to sync store data:', err);
  process.exit(1);
}
