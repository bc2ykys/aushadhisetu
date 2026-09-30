import { NextResponse } from 'next/server';
import { calculateForecast } from '../../../lib/forecast';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phcId = searchParams.get('phcId') || 'PHC_MEERUT_RAMPUR';

  // Read local seed.json
  const seedPath = path.join(process.cwd(), 'data', 'seed.json');
  let data: any[] = [];
  try { data = JSON.parse(fs.readFileSync(seedPath, 'utf8')); } catch (e) {
    return NextResponse.json({ error: 'seed.json not found. Run: node seed.js' }, { status: 500 });
  }

  // Filter by PHC
  const phcRows = data.filter((r: any) => r.phcId === phcId);

  // Group by drugCode
  const grouped: Record<string, any[]> = {};
  phcRows.forEach((r: any) => {
    if (!grouped[r.drugCode]) grouped[r.drugCode] = [];
    grouped[r.drugCode].push(r);
  });

  // For each drug, sort newest-first and compute forecast
  const risks: any[] = [];
  for (const [drugCode, rows] of Object.entries(grouped)) {
    rows.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = rows[0];
    const currentStock = latest.closing;
    const nearestExpiry = latest.expiry;

    const forecast = calculateForecast(rows, currentStock, nearestExpiry);

    risks.push({
      drugCode,
      drug: latest.drugName || drugCode,
      ...forecast,
      batch: latest.batch,
      expiry: latest.expiry,
    });
  }

  // Sort: RED first, then AMBER, then GREEN
  const order: Record<string, number> = { RED: 0, AMBER: 1, GREEN: 2 };
  risks.sort((a, b) => (order[a.code] ?? 3) - (order[b.code] ?? 3));

  return NextResponse.json(risks);
}
