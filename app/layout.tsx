import './globals.css';
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
}
