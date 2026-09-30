# AushadhiSetu MVP

An AI-powered Last-Mile PHC Stock Guardian to prevent essential drug stockouts. 

🔗 **Live Demo:** [https://aushadhisetu.vercel.app](https://aushadhisetu.vercel.app)

## Quickstart (60 Seconds)

1. Clone the repo and install dependencies:
   ```bash
   git clone <repo-url>
   cd aushadhisetu
   npm install
   ```
2. Generate the synthetic demo data:
   ```bash
   node seed.js
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. **Deploy to Vercel (Free Tier):**
   ```bash
   npm i -g vercel
   vercel --prod
   # Be sure to set GEMINI_KEY in your Vercel Environment Variables.
   ```

## Architecture

```text
[ Mobile PWA (Next.js) ]
       |   ^
 (Photo) |   | (JSON Table)
       v   |
[ Next.js API Routes ] <---> [ Gemini 2.5 Flash (AI Studio REST) ]
       |
       v
[ local data/seed.json ] <---> [ lib/forecast.js (Local Time-Series) ]
```

## Data Disclosure
All data in this repository (`seed.json`, CSVs) is purely **synthetic_hackathon_demo** data. No real Patient Identifiable Information (PII) is used, collected, or stored.

## API Table
| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/extract` | POST | Sends base64 image to Gemini 2.5 Flash, returns structured JSON. |
| `/api/voice` | POST | Takes Hindi transcript, returns parsed drug & quantity delta. |
| `/api/risk` | GET | Calculates JS-based 14-day moving average and returns RED/AMBER/GREEN flags. |
| `/api/indent` | GET | Generates recommended restock quantities for MOIC review. |

## Team
- **Built for:** Google Cloud Build with AI Code for Communities 2.0 (Track 3: Smart Health)

## License
[Apache-2.0 License](LICENSE)
