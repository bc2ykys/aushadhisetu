import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const SAFETY_DAYS = 30; // target safety stock in days

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phcId = searchParams.get('phcId') || 'PHC_MEERUT_RAMPUR';

  const seedPath = path.join(process.cwd(), 'data', 'seed.json');
  let data: any[] = [];
  try { data = JSON.parse(fs.readFileSync(seedPath, 'utf8')); } catch (e) {
    return NextResponse.json({ error: 'seed.json not found' }, { status: 500 });
  }

  const phcRows = data.filter((r: any) => r.phcId === phcId);

  // Group by drugCode
  const grouped: Record<string, any[]> = {};
  phcRows.forEach((r: any) => {
    if (!grouped[r.drugCode]) grouped[r.drugCode] = [];
    grouped[r.drugCode].push(r);
  });

  const indents: any[] = [];
  for (const [drugCode, rows] of Object.entries(grouped)) {
    rows.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const latest = rows[0];
    const onHand = latest.closing;

    // 14-day average
    const last14 = rows.slice(0, 14);
    const avgUse = last14.reduce((s: number, r: any) => s + (r.issued || 0), 0) / last14.length;

    // qty = max(0, safety_days * avg_use - on_hand)
    const suggested = Math.max(0, Math.ceil(SAFETY_DAYS * avgUse - onHand));

    if (suggested > 0) {
      indents.push({
        drugCode,
        drug: latest.drugName || drugCode,
        onHand,
        avgUse: parseFloat(avgUse.toFixed(1)),
        suggested,
      });
    }
  }

  // Sort by suggested desc (most needed first)
  indents.sort((a, b) => b.suggested - a.suggested);

  return NextResponse.json(indents);
}
