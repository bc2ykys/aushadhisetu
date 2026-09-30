'use client';
import { useState, useEffect } from 'react';
import jsPDF from 'jspdf';

interface IndentItem {
  drugCode: string;
  drug: string;
  onHand: number;
  avgUse: number;
  suggested: number;
}

export default function IndentDraft({ phcId, lang = 'en' }: { phcId: string; lang?: string }) {
  const [indents, setIndents] = useState<IndentItem[]>([]);
  const [approved, setApproved] = useState(false);
  const [moicName, setMoicName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/indent?phcId=${phcId}`)
      .then(r => r.json())
      .then(data => { setIndents(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [phcId]);

  const updateQty = (idx: number, qty: number) => {
    setIndents(prev => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], suggested: qty };
      return copy;
    });
  };

  const downloadCSV = () => {
    const header = 'DrugCode,Drug,OnHand,AvgUse,IndentQty';
    const rows = indents.map(i => `${i.drugCode},${i.drug},${i.onHand},${i.avgUse},${i.suggested}`);
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `indent_${phcId}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('AushadhiSetu — Indent Draft', 14, 20);
    doc.setFontSize(10);
    doc.text(`PHC: ${phcId}  |  Date: ${new Date().toISOString().split('T')[0]}  |  DEMO DATA`, 14, 28);
    if (moicName) doc.text(`Approved by: ${moicName}`, 14, 34);

    let y = 44;
    doc.setFontSize(9);
    doc.text('Drug', 14, y); doc.text('On Hand', 80, y); doc.text('Avg Use', 105, y); doc.text('Indent Qty', 135, y);
    y += 6;
    doc.line(14, y - 2, 170, y - 2);

    indents.forEach(ind => {
      if (y > 270) { doc.addPage(); y = 20; }
      doc.text(ind.drug.substring(0, 30), 14, y);
      doc.text(String(ind.onHand), 80, y);
      doc.text(String(ind.avgUse), 105, y);
      doc.text(String(ind.suggested), 135, y);
      y += 5;
    });

    doc.save(`indent_${phcId}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleApprove = () => {
    if (!approved) { alert(lang === 'hi' ? 'कृपया MOIC स्वीकृति टिक करें' : 'Please tick MOIC Approval'); return; }
    if (!moicName.trim()) { alert(lang === 'hi' ? 'MOIC नाम भरें' : 'Enter MOIC name'); return; }
    alert(lang === 'hi' ? 'मांग पत्र स्वीकृत और सेव किया!' : 'Indent Approved & Saved!');
  };

  const total = indents.reduce((s, i) => s + i.suggested, 0);

  if (loading) return <div className="p-4 text-gray-500">Loading...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{lang === 'hi' ? 'सुझावित मांग पत्र' : 'Recommended Indent'}</h2>
      <p className="text-sm text-gray-500">{lang === 'hi' ? `गणना: max(0, 30 दिन × औसत उपयोग − वर्तमान स्टॉक)` : `Formula: max(0, 30d × avg_use − on_hand)`}</p>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">{lang === 'hi' ? 'दवा' : 'Drug'}</th>
              <th className="p-2 border">{lang === 'hi' ? 'स्टॉक' : 'On Hand'}</th>
              <th className="p-2 border">{lang === 'hi' ? 'औसत/दिन' : 'Avg/Day'}</th>
              <th className="p-2 border">{lang === 'hi' ? 'मांग मात्रा' : 'Indent Qty'}</th>
            </tr>
          </thead>
          <tbody>
            {indents.map((ind, i) => (
              <tr key={i}>
                <td className="p-2 border">{ind.drug}</td>
                <td className="p-2 border text-gray-600">{ind.onHand}</td>
                <td className="p-2 border text-gray-600">{ind.avgUse}</td>
                <td className="p-2 border">
                  <input type="number" value={ind.suggested} onChange={e => updateQty(i, parseInt(e.target.value) || 0)} className="p-1 border w-24 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 font-bold">
              <td className="p-2 border" colSpan={3}>{lang === 'hi' ? 'कुल' : 'Total'}</td>
              <td className="p-2 border">{total}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={downloadCSV} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">📥 {lang === 'hi' ? 'CSV डाउनलोड' : 'Download CSV'}</button>
        <button onClick={downloadPDF} className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">📄 {lang === 'hi' ? 'PDF डाउनलोड' : 'Download PDF'}</button>
      </div>

      <div className="border-t pt-4 space-y-2">
        <div className="flex items-center gap-2">
          <input type="checkbox" id="moic" checked={approved} onChange={e => setApproved(e.target.checked)} />
          <label htmlFor="moic" className="font-medium">{lang === 'hi' ? 'मैं (MOIC) इस मांग पत्र को मैन्युअल रूप से स्वीकृत करता/करती हूं।' : 'I (MOIC) approve this indent manually.'}</label>
        </div>
        <input type="text" placeholder={lang === 'hi' ? 'MOIC नाम' : 'MOIC Name'} value={moicName} onChange={e => setMoicName(e.target.value)} className="border p-2 rounded w-64" />
        <div>
          <button onClick={handleApprove} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">{lang === 'hi' ? 'मांग पत्र जमा करें' : 'Submit Indent'}</button>
        </div>
      </div>
    </div>
  );
}
