/**
 * AushadhiSetu Seed Generator
 * Generates 90 days of synthetic_hackathon_demo data for 5 PHCs × 60 drugs.
 * Injected scenarios:
 *   - DRG001 Paracetamol @ PHC_MEERUT_RAMPUR → RED ~9 days stock
 *   - DRG004 Amoxicillin @ PHC_MEERUT_RAMPUR → RED ~12 days stock
 *   - DRG002 ORS @ PHC_MEERUT_RAMPUR → AMBER overstock + expiry 60 days
 */
const fs = require('fs');
const path = require('path');

// --- Config ---
const PHCS = [
  'PHC_MEERUT_RAMPUR',
  'PHC_MEERUT_HASTINAPUR',
  'PHC_MEERUT_DAURALA',
  'PHC_MEERUT_SARDHANA',
  'PHC_MEERUT_MAWANA'
];

// Load drug codes from CSV
const csvPath = path.join(__dirname, 'data', 'drugs_60.csv');
const csvLines = fs.readFileSync(csvPath, 'utf8').trim().split('\n');
const DRUGS = csvLines.slice(1).filter(l => l.trim()).map(line => {
  const [code, name_en, , , , max] = line.split(',');
  return { code: code.trim(), name: name_en.trim(), max: parseInt(max) || 3000 };
});

const TODAY = new Date('2026-09-30');
const DAYS = 90;

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generatePHC(phcId, rng) {
  const rows = [];

  for (const drug of DRUGS) {
    // Base daily issue rate scaled by max_month_norm
    const baseDailyIssue = Math.max(1, Math.floor(drug.max / 30 * (0.3 + rng() * 0.5)));

    // Assign batch + expiry
    const batchNum = Math.floor(rng() * 900) + 100;
    const batch = `B${batchNum}`;

    // Default expiry: 6-18 months from today
    let expiryDate = new Date(TODAY);
    expiryDate.setMonth(expiryDate.getMonth() + 6 + Math.floor(rng() * 12));
    let expiry = expiryDate.toISOString().split('T')[0];

    // --- Inject special scenarios for PHC_MEERUT_RAMPUR ---
    let overrideStock = null;

    if (phcId === 'PHC_MEERUT_RAMPUR') {
      if (drug.code === 'DRG001') {
        // Paracetamol: force RED ~9 days. High daily use, low current stock.
        overrideStock = { forceLowClosing: true, targetDays: 9 };
      }
      if (drug.code === 'DRG004') {
        // Amoxicillin: force RED ~12 days
        overrideStock = { forceLowClosing: true, targetDays: 12 };
      }
      if (drug.code === 'DRG002') {
        // ORS: overstock + expiry 60 days from today
        expiryDate = new Date(TODAY);
        expiryDate.setDate(expiryDate.getDate() + 60);
        expiry = expiryDate.toISOString().split('T')[0];
        overrideStock = { forceHighClosing: true };
      }
    }

    // Generate 90 days of transactions (newest first in array)
    let currentClosing = Math.floor(drug.max * (0.4 + rng() * 0.4)); // initial stock
    const drugRows = [];

    for (let d = DAYS - 1; d >= 0; d--) {
      const date = new Date(TODAY);
      date.setDate(date.getDate() - d);
      const dayOfWeek = date.getDay(); // 0=Sun
      const month = date.getMonth(); // 0-based

      // Weekly seasonality: lower on Sunday
      let seasonMult = 1.0;
      if (dayOfWeek === 0) seasonMult = 0.4;
      else if (dayOfWeek === 6) seasonMult = 0.6;
      else if (dayOfWeek === 1 || dayOfWeek === 2) seasonMult = 1.2;

      // Monsoon bump July-Sep
      if (month >= 6 && month <= 8) seasonMult *= 1.25;

      // Daily footfall 40-120
      const footfall = Math.floor(40 + rng() * 80);

      // Issued qty
      let issued = Math.max(0, Math.floor(baseDailyIssue * seasonMult * (0.7 + rng() * 0.6)));
      issued = Math.min(issued, currentClosing); // can't issue more than stock

      // Occasional receipt (every ~15 days, large batch)
      let received = 0;
      if (d % 15 === 0 && d > 0) {
        received = Math.floor(drug.max * (0.3 + rng() * 0.3));
      }

      const opening = currentClosing;
      const closing = opening + received - issued;

      drugRows.push({
        phcId,
        date: date.toISOString().split('T')[0],
        drugCode: drug.code,
        drugName: drug.name,
        batch,
        expiry,
        opening,
        received,
        issued,
        closing,
        footfall,
        source: 'synthetic_hackathon_demo'
      });

      currentClosing = closing;
    }

    // Override final closing stock for injected scenarios
    if (overrideStock && overrideStock.forceLowClosing && drugRows.length > 0) {
      // Calculate avg daily issue from last 14 rows
      const last14 = drugRows.slice(-14);
      const avgIssue = last14.reduce((s, r) => s + r.issued, 0) / last14.length;
      const targetClosing = Math.floor(avgIssue * overrideStock.targetDays);
      // Adjust the last row's closing
      const lastRow = drugRows[drugRows.length - 1];
      const diff = lastRow.closing - targetClosing;
      if (diff > 0) {
        lastRow.issued += diff;
        lastRow.closing = targetClosing;
      }
    }

    if (overrideStock && overrideStock.forceHighClosing && drugRows.length > 0) {
      // ORS overstock: inflate final closing to make expiry the risk
      const lastRow = drugRows[drugRows.length - 1];
      lastRow.received += 5000;
      lastRow.closing += 5000;
    }

    rows.push(...drugRows);
  }

  return rows;
}

// --- Main ---
const rng = seededRandom(42);
let allData = [];

for (const phc of PHCS) {
  const phcData = generatePHC(phc, rng);
  allData = allData.concat(phcData);
}

const dir = path.join(__dirname, 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
const outPath = path.join(dir, 'seed.json');
fs.writeFileSync(outPath, JSON.stringify(allData, null, 2));

// Summary
const phcCounts = {};
allData.forEach(r => { phcCounts[r.phcId] = (phcCounts[r.phcId] || 0) + 1; });
console.log(`✅ Seeded ${allData.length} rows to data/seed.json`);
console.log(`   PHCs: ${Object.keys(phcCounts).length}`);
console.log(`   Drugs: ${DRUGS.length}`);
console.log(`   Days: ${DAYS}`);
Object.entries(phcCounts).forEach(([k, v]) => console.log(`   ${k}: ${v} rows`));
