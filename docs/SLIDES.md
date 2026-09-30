# AushadhiSetu: 12-Slide Deck Outline

## Slide 1: Title
- **Visual:** Project Logo, App Screenshot, "AushadhiSetu: Last-Mile PHC Stock Guardian".
- **Talk Track:** Introduce the team and project name. State our mission to prevent essential drug stockouts in rural India.
- **Evidence:** Clean UI mockup of the Vercel PWA.

## Slide 2: The Problem
- **Visual:** Photo of a messy paper register. Callout box: "CAG Rajasthan 2022: 27% of PHCs < 50% essential drugs."
- **Talk Track:** Explain the delay between paper registers and digital DVDMS entry. Explain how blind spots lead to critical stockouts.
- **Evidence:** CAG report citation.

## Slide 3: Personas
- **Visual:** 3 Icons (Pharmacist, MOIC, District Officer) with a short quote for each.
- **Talk Track:** Pharmacist is overwhelmed by 100+ daily entries. MOIC approves indents blindly. District lacks real-time visibility.
- **Evidence:** Maharashtra IT Audit findings on missed tracking.

## Slide 4: Existing System vs. Our Gap Fill
- **Visual:** Table comparing DVDMS (State-level, Delayed, Complex) vs. AushadhiSetu (PHC-level, Real-time OCR, Simple PWA).
- **Talk Track:** We are not replacing DVDMS. We are digitizing the "first mile" (the paper register) so DVDMS gets accurate data faster.
- **Evidence:** "No live DVDMS integration" constraint highlighted as a feature (modular).

## Slide 5: Solution Flow
- **Visual:** Flowchart: Paper Register -> Photo (Next.js PWA) -> Gemini 2.5 Flash -> Local JS Forecast -> Human Approved CSV Indent.
- **Talk Track:** Walk through the user journey from snapping a photo to generating an approved indent.
- **Evidence:** Step-by-step UI wireframes.

## Slide 6: The AI (Vision & Voice)
- **Visual:** Code snippet showing Gemini JSON schema and a bounding box example.
- **Talk Track:** We use Gemini 2.5 Flash via AI Studio. It extracts tabular data into strict JSON and supports Hindi voice updates.
- **Evidence:** Show a few-shot prompt example.

## Slide 7: Live Screenshot (Risk Board)
- **Visual:** Screenshot of the RED/AMBER/GREEN cards and the JS forecast chart (p10-p90).
- **Talk Track:** Show the local JS forecasting in action. Highlight the 9-day RED alert for Paracetamol and AMBER expiry warning for ORS.
- **Evidence:** The JS forecast formula (`avg 14d, days=on_hand/avg`).

## Slide 8: Data Architecture (Disclosure)
- **Visual:** Architecture diagram showing local `seed.json` array bypassing heavy DBs.
- **Talk Track:** Built for the hackathon using Vercel Next.js API Routes and a local `seed.json`. All data is synthetic "Demo Data".
- **Evidence:** Explicit mention of avoiding BQML/Cloud Run for cost constraints.

## Slide 9: Pilot, Scale, & Cost
- **Visual:** Graph showing scaling to 25k patients. Callout box: "Vercel Free Tier = Rs 0 infrastructure cost per PHC."
- **Talk Track:** We can pilot this for 30 days immediately. Vercel hosting costs nothing for this edge-compute setup.
- **Evidence:** Rs 12k/mo saved per PHC by preventing emergency purchases.

## Slide 10: Safeguards & Ethics
- **Visual:** 3 pillars: "No PII", "Human-in-the-Loop", "Offline Fallback".
- **Talk Track:** We track drug volumes, never patient names. Auto-ordering is strictly blocked; MOIC approval is mandatory. 
- **Evidence:** Screenshot of the manual MOIC approval checkbox.

## Slide 11: Team, Stack & GitHub
- **Visual:** Team photos, logos of Next.js, Vercel, Gemini AI Studio.
- **Talk Track:** Introduce the builders. Point out that the code is fully open-source on GitHub.
- **Evidence:** GitHub repository link.

## Slide 12: Ask + QR Code
- **Visual:** Massive QR code linking to `https://aushadhisetu.vercel.app`. "Try it now."
- **Talk Track:** Thank the judges. Invite them to scan the QR code and test the PWA live.
- **Evidence:** Live deployed Vercel URL.
