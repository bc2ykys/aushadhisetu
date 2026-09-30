import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { transcript } = await req.json();
    if (!transcript) {
      return NextResponse.json({ error: 'No transcript provided' }, { status: 400 });
    }

    const GEMINI_KEY = process.env.GEMINI_KEY;

    // If no key, return mock extraction with batch + expiry
    if (!GEMINI_KEY || GEMINI_KEY === 'YOUR_AI_STUDIO_KEY_HERE') {
      // Simple keyword matching for demo
      let drug = 'Unknown';
      let qty = 0;
      let action = 'issued';
      let batch = 'DEMO_BATCH';
      let expiry = '2027-06-30';

      const t = transcript.toLowerCase();
      if (t.includes('पैरासिटामोल') || t.includes('paracetamol')) { drug = 'Paracetamol 500mg'; qty = 100; }
      else if (t.includes('ओआरएस') || t.includes('ors')) { drug = 'ORS Sachet'; qty = 50; }
      else if (t.includes('आयरन') || t.includes('iron')) { drug = 'Iron Folic Acid'; qty = 20; }
      else if (t.includes('एमोक्सिसिलिन') || t.includes('amoxicillin')) { drug = 'Amoxicillin 250mg'; qty = 30; }

      if (t.includes('मिल') || t.includes('आई') || t.includes('received')) action = 'received';
      if (t.includes('बांट') || t.includes('दी') || t.includes('issued')) action = 'issued';

      const confirm_hi = `क्या आपने ${drug} की ${qty} ${action === 'issued' ? 'बांटी' : 'प्राप्त की'}? बैच ${batch}, एक्सपायरी ${expiry}। कृपया पुष्टि करें।`;

      return NextResponse.json({ drug, qty, action, batch, expiry, confirm_hi, source: 'mock_demo' });
    }

    // TODO: Real Gemini 2.5 Flash call for transcript extraction
    return NextResponse.json({ error: 'Gemini not configured' }, { status: 501 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
