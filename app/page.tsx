'use client';
import { useState } from 'react';
import { t } from '../lib/i18n';
import UploadPhoto from '../components/UploadPhoto';
import VoiceNote from '../components/VoiceNote';
import RiskBoard from '../components/RiskBoard';
import IndentDraft from '../components/IndentDraft';

const PHCS = [
  { id: 'PHC_MEERUT_RAMPUR', label: 'Meerut — Rampur' },
  { id: 'PHC_MEERUT_HASTINAPUR', label: 'Meerut — Hastinapur' },
  { id: 'PHC_MEERUT_DAURALA', label: 'Meerut — Daurala' },
  { id: 'PHC_MEERUT_SARDHANA', label: 'Meerut — Sardhana' },
  { id: 'PHC_MEERUT_MAWANA', label: 'Meerut — Mawana' },
];

export default function Page() {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [tab, setTab] = useState('risk');
  const [phc, setPhc] = useState('PHC_MEERUT_RAMPUR');

  const dict = t[lang];

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center bg-white p-4 shadow rounded-lg">
        <h1 className="text-2xl font-bold text-blue-800">{dict.title}</h1>
        <div className="flex gap-3 items-center">
          <select value={phc} onChange={e => setPhc(e.target.value)} className="border p-1.5 rounded text-sm">
            {PHCS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
          </select>
          <button onClick={() => setLang(lang === 'en' ? 'hi' : 'en')} className="px-3 py-1.5 bg-gray-200 rounded text-sm font-medium hover:bg-gray-300">
            {lang === 'en' ? 'हिंदी' : 'English'}
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {(['photo', 'voice', 'risk', 'indent'] as const).map(k => (
          <button key={k} onClick={() => setTab(k)} className={`px-4 py-2 rounded font-medium transition ${tab === k ? 'bg-blue-600 text-white shadow' : 'bg-gray-200 hover:bg-gray-300'}`}>
            {dict[k]}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg shadow min-h-[400px]">
        {tab === 'photo' && <UploadPhoto lang={lang} />}
        {tab === 'voice' && <VoiceNote lang={lang} />}
        {tab === 'risk' && <RiskBoard phcId={phc} lang={lang} />}
        {tab === 'indent' && <IndentDraft phcId={phc} lang={lang} />}
      </div>
    </div>
  );
}
