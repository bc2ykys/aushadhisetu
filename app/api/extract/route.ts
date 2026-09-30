import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { image } = await req.json();
    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const GEMINI_KEY = process.env.GEMINI_KEY;

    // If no key, return demo mock with checksum validation
    if (!GEMINI_KEY || GEMINI_KEY === 'YOUR_AI_STUDIO_KEY_HERE') {
      const mockRows = [
        { drugCode: 'DRG001', opening: 500, received: 100, issued: 50, closing: 550, batch: 'B101', expiry: '2027-06-30', confidence: { opening: 0.95, received: 0.92, issued: 0.88, closing: 0.96, batch: 0.99, expiry: 0.90 } },
        { drugCode: 'DRG002', opening: 200, received: 0, issued: 50, closing: 100, batch: 'B202', expiry: '2026-11-30', confidence: { opening: 0.60, received: 0.95, issued: 0.72, closing: 0.55, batch: 0.90, expiry: 0.85 } },
        { drugCode: 'DRG004', opening: 300, received: 50, issued: 80, closing: 270, batch: 'B404', expiry: '2027-03-15', confidence: { opening: 0.91, received: 0.93, issued: 0.89, closing: 0.94, batch: 0.97, expiry: 0.92 } },
      ];
      return NextResponse.json({ rows: validateRows(mockRows), source: 'mock_demo' });
    }

    // TODO: Real Gemini 2.5 Flash call via AI Studio REST
    // const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_KEY}`;
    // const response = await fetch(url, { ... });
    // const geminiRows = parseGeminiResponse(response);
    // return NextResponse.json({ rows: validateRows(geminiRows), source: 'gemini' });

    return NextResponse.json({ rows: [], source: 'gemini_not_configured' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

/** Server-side checksum validation + flag generation */
function validateRows(rows: any[]) {
  return rows.map(row => {
    const checksum = row.opening + row.received - row.issued === row.closing;
    // Flag any confidence < 0.75
    const lowConfCells: string[] = [];
    if (row.confidence) {
      for (const [cell, conf] of Object.entries(row.confidence)) {
        if ((conf as number) < 0.75) lowConfCells.push(cell);
      }
    }
    return {
      ...row,
      _checksum: checksum,
      _lowConfCells: lowConfCells,
    };
  });
}
