import os

BASE_DIR = r"d:\LockFolder\Events\Build with AI Code for Communities — Second Edition\aushadhisetu"

FILES = {
"package.json": """{
  "name": "aushadhisetu",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "seed": "node seed.js"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "^18",
    "react-dom": "^18",
    "recharts": "^2.12.7",
    "jspdf": "^2.5.1",
    "lucide-react": "^0.379.0"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "postcss": "^8",
    "tailwindcss": "^3.4.1",
    "eslint": "^8",
    "eslint-config-next": "14.2.3"
  }
}""",
"tsconfig.json": """{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": false,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{"name": "next"}],
    "paths": {"@/*": ["./*"]}
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}""",
"tailwind.config.ts": """import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {} },
  plugins: [],
};
export default config;""",
"postcss.config.js": """module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}""",
"app/globals.css": """@tailwind base;
@tailwind components;
@tailwind utilities;
body { background: #f3f4f6; color: #1f2937; }
""",
"app/layout.tsx": """import './globals.css';
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="bg-red-600 text-white text-center py-1 font-bold text-sm">
          ⚠️ Demo Data - AI assist, MOIC approval required
        </div>
        {children}
      </body>
    </html>
  );
}""",
"lib/i18n.ts": """export const t = {
  en: { title: "AushadhiSetu", photo: "Photo", voice: "Voice", risk: "Risk Board", indent: "Indent Draft", phc: "Select PHC" },
  hi: { title: "औषधि सेतु", photo: "फोटो", voice: "आवाज़", risk: "जोखिम बोर्ड", indent: "मांग पत्र", phc: "पीएचसी चुनें" }
};""",
"lib/api.ts": """export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || '';
export const fetchApi = async (endpoint: string, options?: RequestInit) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, options);
  if (!res.ok) throw new Error('API Error');
  return res.json();
};""",
"lib/forecast.js": """// Forecast logic for AushadhiSetu
export function calculateForecast(drugTransactions, currentStock) {
    if (!drugTransactions || drugTransactions.length === 0) return { avg: 0, days: -1, code: 'GREEN' };
    const last14 = drugTransactions.slice(0, 14);
    const sum = last14.reduce((s, tx) => s + (tx.issued || 0), 0);
    const avg = sum / (last14.length || 1);
    const days = avg === 0 ? 999 : Math.floor(currentStock / avg);
    
    let code = 'GREEN';
    if (days <= 14) code = 'RED';
    else if (days <= 30) code = 'AMBER';
    
    const stockout_date = new Date(Date.now() + days * 86400000).toISOString().split('T')[0];
    return { avg, days, stockout_date, code, currentStock };
}""",
"app/page.tsx": """'use client';
import { useState } from 'react';
import { t } from '../lib/i18n';
import UploadPhoto from '../components/UploadPhoto';
import VoiceNote from '../components/VoiceNote';
import RiskBoard from '../components/RiskBoard';
import IndentDraft from '../components/IndentDraft';

export default function Page() {
  const [lang, setLang] = useState<'en'|'hi'>('en');
  const [tab, setTab] = useState('photo');
  const [phc, setPhc] = useState('PHC_MEERUT_RAMPUR');

  const dict = t[lang];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg">
        <h1 className="text-2xl font-bold text-blue-800">{dict.title}</h1>
        <div className="flex gap-4">
          <select value={phc} onChange={e => setPhc(e.target.value)} className="border p-1 rounded">
            <option value="PHC_MEERUT_RAMPUR">Meerut Rampur</option>
            <option value="PHC_TEST">Test PHC</option>
          </select>
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-3 py-1 bg-gray-200 rounded">
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </div>
      
      <div className="flex gap-2">
        {['photo', 'voice', 'risk', 'indent'].map(k => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded ${tab === k ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            {dict[k as keyof typeof dict]}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow min-h-[400px]">
        {tab === 'photo' && <UploadPhoto />}
        {tab === 'voice' && <VoiceNote />}
        {tab === 'risk' && <RiskBoard phcId={phc} lang={lang} />}
        {tab === 'indent' && <IndentDraft phcId={phc} />}
      </div>
    </div>
  );
}""",
"components/UploadPhoto.tsx": """'use client';
import { useState } from 'react';

export default function UploadPhoto() {
  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    // In a real app we'd convert to base64, mock for now
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        try {
            const res = await fetch('/api/extract', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: reader.result })
            });
            setData(await res.json());
        } catch(e) { console.error(e) }
        setLoading(false);
    };
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Register OCR</h2>
      <input type="file" accept="image/*" capture="environment" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={handleUpload} disabled={!file || loading} className="ml-2 bg-blue-500 text-white px-4 py-1 rounded">
        {loading ? 'Processing...' : 'Extract (Gemini)'}
      </button>
      
      {data && data.rows && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Drug</th><th className="p-2 border">Opening</th>
                <th className="p-2 border">Recv</th><th className="p-2 border">Issued</th>
                <th className="p-2 border">Close</th><th className="p-2 border">Valid?</th>
              </tr>
            </thead>
            <tbody>
              {data.rows.map((row: any, i: number) => {
                const isValid = row.opening + row.received - row.issued === row.closing;
                return (
                  <tr key={i} className={row.confidence?.opening < 0.75 ? 'bg-red-50' : ''}>
                    <td className="p-2 border">{row.drugCode}</td>
                    <td className="p-2 border"><input type="number" defaultValue={row.opening} className="w-16 p-1 border"/></td>
                    <td className="p-2 border"><input type="number" defaultValue={row.received} className="w-16 p-1 border"/></td>
                    <td className="p-2 border"><input type="number" defaultValue={row.issued} className="w-16 p-1 border"/></td>
                    <td className="p-2 border"><input type="number" defaultValue={row.closing} className="w-16 p-1 border"/></td>
                    <td className="p-2 border">{isValid ? '✅' : '❌'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">Save to Ledger</button>
        </div>
      )}
    </div>
  );
}""",
"components/VoiceNote.tsx": """'use client';
import { useState } from 'react';

export default function VoiceNote() {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const handleStart = () => {
    setRecording(true);
    // Mock web speech due to hackathon / browser sandbox
    setTimeout(() => {
        setRecording(false);
        setTranscript("पैरासिटामोल के सौ पत्ते बांटे गए");
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Voice Entry (Hindi)</h2>
      <button onMouseDown={handleStart} className={`px-4 py-2 rounded text-white ${recording ? 'bg-red-500 animate-pulse' : 'bg-blue-600'}`}>
        {recording ? 'Listening...' : 'Hold to Speak'}
      </button>
      {transcript && (
        <div className="p-4 bg-gray-50 border rounded">
          <p><strong>Transcript:</strong> {transcript}</p>
          <button className="mt-2 bg-green-500 text-white px-3 py-1 rounded">Confirm & Save</button>
        </div>
      )}
    </div>
  );
}""",
"components/RiskBoard.tsx": """'use client';
import { useEffect, useState } from 'react';

export default function RiskBoard({ phcId, lang }: { phcId: string, lang: 'en'|'hi' }) {
  const [risks, setRisks] = useState([]);
  
  useEffect(() => {
    fetch(`/api/risk?phcId=${phcId}`).then(r => r.json()).then(setRisks);
  }, [phcId]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Stockout Risk (Next 30 Days)</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((r: any, i: number) => (
          <div key={i} className={`p-4 rounded shadow border-l-8 ${r.code === 'RED' ? 'border-red-500 bg-red-50' : r.code === 'AMBER' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
            <h3 className="font-bold text-lg">{r.drug}</h3>
            <p className="text-sm">Days Left: {r.days} (Est. out by {r.stockout_date})</p>
            <details className="mt-2 cursor-pointer text-sm text-gray-700">
              <summary>Why?</summary>
              Avg use {r.avg.toFixed(1)}/day. Current stock: {r.currentStock}. 
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}""",
"components/IndentDraft.tsx": """'use client';
import { useState, useEffect } from 'react';

export default function IndentDraft({ phcId }: { phcId: string }) {
  const [indents, setIndents] = useState([]);
  const [approved, setApproved] = useState(false);

  useEffect(() => {
    fetch(`/api/indent?phcId=${phcId}`).then(r => r.json()).then(setIndents);
  }, [phcId]);

  const handleApprove = () => {
    if(!approved) { alert("Please tick MOIC Approval"); return; }
    alert("Indent Approved & Saved!");
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Recommended Indent</h2>
      <table className="w-full text-left border-collapse mt-2">
        <thead><tr className="bg-gray-100"><th className="p-2 border">Drug</th><th className="p-2 border">Suggested Qty</th></tr></thead>
        <tbody>
          {indents.map((ind: any, i: number) => (
            <tr key={i}>
              <td className="p-2 border">{ind.drug}</td>
              <td className="p-2 border"><input type="number" defaultValue={ind.suggested} className="p-1 border w-24"/></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center gap-2 mt-4">
        <input type="checkbox" id="moic" checked={approved} onChange={e => setApproved(e.target.checked)}/>
        <label htmlFor="moic">I (MOIC) approve this indent manually.</label>
      </div>
      <button onClick={handleApprove} className="bg-blue-600 text-white px-4 py-2 rounded">Submit Indent</button>
    </div>
  );
}""",
"app/api/extract/route.ts": """import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // TODO: Implement actual Gemini REST API call here using process.env.GEMINI_KEY
  // Expected to receive base64 image, send to generateContent with response_schema
  // MOCK RESPONSE for Hackathon Starter
  const data = await req.json();
  return NextResponse.json({
    rows: [
      { drugCode: "DRG001", opening: 500, received: 100, issued: 50, closing: 550, confidence: { opening: 0.95 } },
      { drugCode: "DRG002", opening: 200, received: 0, issued: 50, closing: 100, confidence: { opening: 0.6 } } // Bad checksum & conf demo
    ]
  });
}""",
"app/api/voice/route.ts": """import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // TODO: Call Gemini Flash REST to extract JSON from transcript
  const { transcript } = await req.json();
  return NextResponse.json({
    drug: "Paracetamol 500mg",
    qty: 100,
    action: "issued",
    confirm_hi: "क्या आपने पैरासिटामोल के 100 पत्ते बांटे?"
  });
}""",
"app/api/risk/route.ts": """import { NextResponse } from 'next/server';
import { calculateForecast } from '../../../lib/forecast';
import fs from 'fs';
import path from 'path';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const phcId = searchParams.get('phcId') || 'PHC_MEERUT_RAMPUR';
  
  // Read local seed.json
  const seedPath = path.join(process.cwd(), 'data', 'seed.json');
  let data = [];
  try { data = JSON.parse(fs.readFileSync(seedPath, 'utf8')); } catch(e) {}
  
  // Group by drug for this PHC (Mocking logic)
  const risks = [
    calculateForecast([{issued: 50}, {issued: 60}, {issued: 55}], 100), // RED demo
    calculateForecast([{issued: 10}], 500), // GREEN demo
  ];
  risks[0].drug = "Paracetamol 500mg";
  risks[1].drug = "Albendazole 400mg";
  
  return NextResponse.json(risks);
}""",
"app/api/indent/route.ts": """import { NextResponse } from 'next/server';
export async function GET(req: Request) {
  return NextResponse.json([
    { drug: "Paracetamol 500mg", suggested: 1000 },
    { drug: "ORS Sachet", suggested: 500 }
  ]);
}""",
".env.example": """GEMINI_KEY=YOUR_AI_STUDIO_KEY_HERE
""",
"vercel.json": """{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install"
}""",
"seed.js": """const fs = require('fs');
const path = require('path');

const demoData = [
  { phcId: "PHC_MEERUT_RAMPUR", date: "2026-09-30", drugCode: "DRG001", batch: "B1", expiry: "2027-01-01", opening: 500, received: 0, issued: 50, closing: 450, source: "synthetic_hackathon_demo" },
  { phcId: "PHC_MEERUT_RAMPUR", date: "2026-09-29", drugCode: "DRG001", batch: "B1", expiry: "2027-01-01", opening: 550, received: 0, issued: 50, closing: 500, source: "synthetic_hackathon_demo" }
];

const dir = path.join(__dirname, 'data');
if (!fs.existsSync(dir)) fs.mkdirSync(dir);
fs.writeFileSync(path.join(dir, 'seed.json'), JSON.stringify(demoData, null, 2));
console.log("Seeded data/seed.json successfully!");
""",
"README.md": """# AushadhiSetu MVP (Option A)

Runnable Next.js App Router project for the PHC Stockout Predictor.

## Deployment Commands
```bash
# 1. Install dependencies
npm install

# 2. Run local seed
node seed.js

# 3. Start local dev
npm run dev

# 4. Deploy to Vercel
npm i -g vercel
vercel
vercel --prod
```

## Env Vars
- `GEMINI_KEY`: Set your Google AI Studio API key in `.env.local` and in Vercel settings.

## Tests
```bash
curl http://localhost:3000/api/risk?phcId=PHC_MEERUT_RAMPUR
```
"""
}

for filepath, content in FILES.items():
    full_path = os.path.join(BASE_DIR, filepath)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content.strip() + "\n")
print("Files generated successfully.")
