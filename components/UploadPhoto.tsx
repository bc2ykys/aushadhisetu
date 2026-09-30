'use client';
import { useState } from 'react';

interface ExtractRow {
  drugCode: string;
  opening: number;
  received: number;
  issued: number;
  closing: number;
  batch: string;
  expiry: string;
  confidence: Record<string, number>;
  _checksum: boolean;
  _lowConfCells: string[];
}

export default function UploadPhoto({ lang = 'en' }: { lang?: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [rows, setRows] = useState<ExtractRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setSaved(false);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const res = await fetch('/api/extract', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: reader.result }),
        });
        const data = await res.json();
        setRows(data.rows || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    reader.onerror = () => { setLoading(false); };
  };

  const updateCell = (idx: number, field: string, value: number) => {
    setRows(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      // Recompute checksum live
      const r = updated[idx];
      updated[idx]._checksum = r.opening + r.received - r.issued === r.closing;
      return updated;
    });
  };

  const handleSave = () => {
    // In production: POST to an API route to append to seed.json
    console.log('Saving rows:', JSON.stringify(rows, null, 2));
    setSaved(true);
    alert(lang === 'hi' ? 'डेटा लेजर में सेव हो गया!' : 'Data saved to ledger!');
  };

  const isLowConf = (row: ExtractRow, cell: string) => {
    return row._lowConfCells?.includes(cell) || (row.confidence?.[cell] !== undefined && row.confidence[cell] < 0.75);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">{lang === 'hi' ? 'रजिस्टर ओसीआर' : 'Register OCR'}</h2>
      <div className="flex gap-2 items-center flex-wrap">
        <input type="file" accept="image/*" capture="environment" onChange={e => { setFile(e.target.files?.[0] || null); setSaved(false); }} />
        <button onClick={handleUpload} disabled={!file || loading} className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? (lang === 'hi' ? 'प्रोसेस हो रहा...' : 'Processing...') : (lang === 'hi' ? 'निकालें (जेमिनी)' : 'Extract (Gemini)')}
        </button>
      </div>

      {rows.length > 0 && (
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">{lang === 'hi' ? 'दवा' : 'Drug'}</th>
                <th className="p-2 border">{lang === 'hi' ? 'शुरुआती' : 'Opening'}</th>
                <th className="p-2 border">{lang === 'hi' ? 'प्राप्त' : 'Recv'}</th>
                <th className="p-2 border">{lang === 'hi' ? 'वितरित' : 'Issued'}</th>
                <th className="p-2 border">{lang === 'hi' ? 'शेष' : 'Close'}</th>
                <th className="p-2 border">{lang === 'hi' ? 'वैध?' : 'Valid?'}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={i} className={!row._checksum ? 'bg-red-50' : ''}>
                  <td className="p-2 border font-medium">{row.drugCode}</td>
                  {(['opening', 'received', 'issued', 'closing'] as const).map(field => (
                    <td key={field} className={`p-2 border ${isLowConf(row, field) ? 'bg-yellow-100 ring-2 ring-yellow-400' : ''}`}>
                      <input
                        type="number"
                        value={row[field]}
                        onChange={e => updateCell(i, field, parseInt(e.target.value) || 0)}
                        className="w-16 p-1 border rounded"
                      />
                      {isLowConf(row, field) && <span className="text-xs text-yellow-700 block">Low conf</span>}
                    </td>
                  ))}
                  <td className="p-2 border text-center text-lg">{row._checksum ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleSave} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            {saved ? '✅ Saved' : (lang === 'hi' ? 'लेजर में सेव करें' : 'Save to Ledger')}
          </button>
        </div>
      )}
    </div>
  );
}
