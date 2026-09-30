# AushadhiSetu: 12-Slide Deck Outline

## Slide 1: Title
- **Visual:** Project Title & Subtitle. Clean deep teal styling.
- **Talk Track:** Hello, we present AushadhiSetu (Last-Mile PHC Stock Guardian) for Track 3 Smart Health, Build with AI Code for Communities 2.0.
- **Evidence:** Vercel PWA deployed demo.

## Slide 2: The Problem
- **Visual:** Photo/mock of a messy paper register. Callout box: "CAG Rajasthan 2022: 27% of PHCs < 50% essential drugs."
- **Talk Track:** Rural pharmacists rely on paper. DVDMS entry is delayed by days, leading to stockouts and expired drugs.
- **Evidence:** CAG report citation and Maharashtra IT audit (demand module unused).

## Slide 3: Personas
- **Visual:** 3 Icons (Pharmacist, MOIC, District Officer) with a short quote for each.
- **Talk Track:** Pharmacist is overwhelmed by 100+ daily entries. MOIC approves indents blindly. District lacks real-time visibility.
- **Evidence:** Our design specifically targets these three roles.

## Slide 4: Existing System vs. Our Gap Fill
- **Visual:** Table comparing DVDMS (State-level, Delayed) vs. AushadhiSetu (PHC-level, Real-time OCR).
- **Talk Track:** We are not replacing DVDMS. We are digitizing the "first mile" (the paper register) using AI so the state gets accurate data faster.
- **Evidence:** Constraint highlighted: No live DVDMS integration, we act as a bridge.

## Slide 5: Solution Flow
- **Visual:** Flowchart: Paper Register -> Photo (Next.js PWA) -> Gemini 2.5 Flash -> Local JS Forecast -> Human Approved CSV Indent.
- **Talk Track:** The pharmacist snaps a photo or speaks in Hindi. AI extracts the data. Our forecast model calculates risk and generates a draft indent.
- **Evidence:** End-to-end user journey.

## Slide 6: The AI (Vision & Voice)
- **Visual:** Mock code snippet showing Gemini JSON schema extraction.
- **Talk Track:** We use Gemini 2.5 Flash via AI Studio. It accurately extracts tabular data into strict JSON and supports Hindi voice updates.
- **Evidence:** JSON output with bounding boxes / confidence scores.

## Slide 7: Live Screenshot (Risk Board)
- **Visual:** 3 Risk Cards (RED Paracetamol 0-9d, AMBER ORS expiry 60d, GREEN Iron Folic).
- **Talk Track:** Our local JS forecasting dynamically categorizes 60 drugs. Notice the RED alerts for Paracetamol and Amoxicillin, and an AMBER alert for ORS expiring in 60 days.
- **Evidence:** Demo proves 7 RED / 15 AMBER / 38 GREEN distribution.

## Slide 8: Data Architecture & Disclosures
- **Visual:** Disclosure Box listing the technical and ethical constraints.
- **Talk Track:** For this hackathon, we strictly used synthetic Demo Data. We use local JS forecasts instead of BQML to keep it free, and process no PII.
- **Evidence:** Synthetic Data, JS Forecast, No live DVDMS, No PII.

## Slide 9: Pilot, Scale, & Cost
- **Visual:** Graph/Boxes showing scaling to 25k patients. Callout box: "Vercel Free Tier = Rs.0/PHC."
- **Talk Track:** We can pilot this immediately. Since we run a Vercel Next.js PWA with local data, infrastructure costs are zero per PHC.
- **Evidence:** Next.js PWA + Vercel API Routes architecture.

## Slide 10: Safeguards & Ethics
- **Visual:** 3 pillars: "No PII", "Human-in-the-Loop", "Offline Fallback".
- **Talk Track:** We track drug volumes, never patient names. Auto-ordering is strictly blocked; MOIC manual approval is mandatory for all indents.
- **Evidence:** MOIC approval checkbox on the Indent screen.

## Slide 11: Team, Stack & GitHub
- **Visual:** Stack logos (Next.js, Vercel, Gemini) + GitHub URL (https://github.com/bc2ykys/aushadhisetu).
- **Talk Track:** Built using Next.js, Vercel, and Gemini 2.5 Flash. The entire project is open-source under Apache-2.0.
- **Evidence:** GitHub repository link.

## Slide 12: Ask + QR Code
- **Visual:** Massive QR code linking to `https://aushadhisetu-blond.vercel.app/`. "Try it now."
- **Talk Track:** Thank you. Please scan the QR code and test the live PWA demo yourself.
- **Evidence:** Live deployed Vercel URL.
