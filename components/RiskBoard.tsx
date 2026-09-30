'use client';
import { useEffect, useState } from 'react';

interface RiskItem {
  drugCode: string;
  drug: string;
  avg: number;
  days: number;
  stockout_date: string | null;
  code: 'RED' | 'AMBER' | 'GREEN';
  currentStock: number;
  low_history: boolean;
  expiry_days: number | null;
  expiry: string;
}

export default function RiskBoard({ phcId, lang }: { phcId: string; lang: 'en' | 'hi' }) {
  const [risks, setRisks] = useState<RiskItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/risk?phcId=${phcId}`)
      .then(r => r.json())
      .then(data => { setRisks(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [phcId]);

  const reasonText = (r: RiskItem) => {
    if (lang === 'hi') {
      let text = `औसत उपयोग: ${r.avg}/दिन। वर्तमान स्टॉक: ${r.currentStock}।`;
      if (r.stockout_date) text += ` अनुमानित समाप्ति: ${r.stockout_date}।`;
      if (r.expiry_days !== null && r.expiry_days <= 90) text += ` ⚠ निकटतम बैच ${r.expiry_days} दिन में एक्सपायर (${r.expiry})।`;
      if (r.low_history) text += ' ⚠ कम इतिहास (<30 दिन)।';
      return text;
    }
    let text = `Avg use: ${r.avg}/day. Current stock: ${r.currentStock}.`;
    if (r.stockout_date) text += ` Est. stockout: ${r.stockout_date}.`;
    if (r.expiry_days !== null && r.expiry_days <= 90) text += ` ⚠ Nearest batch expires in ${r.expiry_days} days (${r.expiry}).`;
    if (r.low_history) text += ' ⚠ Low history (<30 days data).';
    return text;
  };

  const colorMap: Record<string, string> = {
    RED: 'border-red-500 bg-red-50',
    AMBER: 'border-yellow-500 bg-yellow-50',
    GREEN: 'border-green-500 bg-green-50',
  };

  const codeLabel: Record<string, Record<string, string>> = {
    RED: { en: '🔴 RED', hi: '🔴 लाल' },
    AMBER: { en: '🟡 AMBER', hi: '🟡 पीला' },
    GREEN: { en: '🟢 GREEN', hi: '🟢 हरा' },
  };

  if (loading) return <div className="p-4 text-gray-500">{lang === 'hi' ? 'लोड हो रहा है...' : 'Loading...'}</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{lang === 'hi' ? 'स्टॉकआउट जोखिम (अगले 30 दिन)' : 'Stockout Risk (Next 30 Days)'}</h2>
      <p className="text-sm text-gray-500">{lang === 'hi' ? `${risks.length} दवाइयाँ — लाल पहले` : `${risks.length} drugs — sorted RED first`}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.slice(0, 20).map((r, i) => (
          <div key={i} className={`p-4 rounded-lg shadow border-l-8 ${colorMap[r.code] || 'border-gray-300 bg-gray-50'}`}>
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{r.drug}</h3>
              <span className="text-xs font-mono">{codeLabel[r.code]?.[lang] || r.code}</span>
            </div>
            <p className="text-sm mt-1">
              {lang === 'hi' ? `${r.days} दिन शेष` : `${r.days} days left`}
              {r.stockout_date && <span className="text-gray-500"> ({lang === 'hi' ? 'अनुमानित समाप्ति' : 'est. out by'} {r.stockout_date})</span>}
            </p>
            {r.low_history && <span className="inline-block mt-1 text-xs bg-yellow-200 px-2 py-0.5 rounded">{lang === 'hi' ? '⚠ कम इतिहास' : '⚠ Low History'}</span>}
            <details className="mt-2 cursor-pointer text-sm text-gray-700">
              <summary className="font-medium">{lang === 'hi' ? 'क्यों?' : 'Why?'}</summary>
              <p className="mt-1">{reasonText(r)}</p>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
