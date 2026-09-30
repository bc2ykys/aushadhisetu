'use client';
import { useState, useRef, useEffect } from 'react';

export default function VoiceNote({ lang = 'en' }: { lang?: string }) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Check if Web Speech API is available
  const [speechSupported, setSpeechSupported] = useState(false);
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    setSpeechSupported(!!SpeechRecognition);
  }, []);

  const startRecording = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      // Fallback: use text input mock for demo
      setTranscript('पैरासिटामोल के सौ पत्ते बांटे गए');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: any) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      setRecording(false);
    };

    recognition.onerror = () => {
      setRecording(false);
      // Fallback on error
      setTranscript('पैरासिटामोल के सौ पत्ते बांटे गए (fallback)');
    };

    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
    recognition.start();
    setRecording(true);
    setResult(null);
  };

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setRecording(false);
  };

  const handleConfirm = async () => {
    if (!transcript) return;
    setLoading(true);
    try {
      const res = await fetch('/api/voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript }),
      });
      setResult(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{lang === 'hi' ? 'आवाज़ से एंट्री (हिंदी)' : 'Voice Entry (Hindi)'}</h2>
      
      {!speechSupported && (
        <p className="text-sm text-amber-600 bg-amber-50 p-2 rounded">
          ⚠ Web Speech API not available in this browser. Using fallback demo text.
        </p>
      )}

      <div className="flex gap-2">
        <button
          onMouseDown={startRecording}
          onMouseUp={stopRecording}
          onTouchStart={startRecording}
          onTouchEnd={stopRecording}
          className={`px-6 py-3 rounded-lg text-white font-medium ${recording ? 'bg-red-500 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {recording ? (lang === 'hi' ? '🎙 सुन रहे हैं...' : '🎙 Listening...') : (lang === 'hi' ? '🎤 बोलने के लिए दबाएं' : '🎤 Hold to Speak')}
        </button>
      </div>

      {transcript && (
        <div className="p-4 bg-gray-50 border rounded space-y-3">
          <p><strong>{lang === 'hi' ? 'ट्रांसक्रिप्ट:' : 'Transcript:'}</strong> {transcript}</p>
          <button onClick={handleConfirm} disabled={loading} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50">
            {loading ? '...' : (lang === 'hi' ? 'पुष्टि करें और सेव करें' : 'Confirm & Save')}
          </button>
        </div>
      )}

      {result && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-2">
          <h3 className="font-bold">{lang === 'hi' ? 'निकाला गया डेटा:' : 'Extracted Data:'}</h3>
          <table className="text-sm">
            <tbody>
              <tr><td className="pr-4 font-medium">{lang === 'hi' ? 'दवा' : 'Drug'}:</td><td>{result.drug}</td></tr>
              <tr><td className="pr-4 font-medium">{lang === 'hi' ? 'मात्रा' : 'Qty'}:</td><td>{result.qty}</td></tr>
              <tr><td className="pr-4 font-medium">{lang === 'hi' ? 'बैच' : 'Batch'}:</td><td>{result.batch}</td></tr>
              <tr><td className="pr-4 font-medium">{lang === 'hi' ? 'एक्सपायरी' : 'Expiry'}:</td><td>{result.expiry}</td></tr>
            </tbody>
          </table>
          {result.confirm_hi && <p className="text-sm italic text-gray-600 mt-2">💬 {result.confirm_hi}</p>}
        </div>
      )}
    </div>
  );
}
