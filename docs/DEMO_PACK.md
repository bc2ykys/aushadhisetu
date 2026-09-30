# AushadhiSetu: 4-Minute Demo Script

*Preparation: Have phone ready with PWA loaded at https://aushadhisetu.vercel.app. Keep a printed register page and a printout of the fallback JSON in case of network failure.*

### 0:00 - 0:30: The Problem
**Action (Screen):** Display a messy, handwritten PHC drug distribution register.
**Speaker:** "Good afternoon. Imagine being a pharmacist at a rural Primary Health Center. Every day, you manually track over 100 essential medicines in this paper register. By the time this data enters the state DVDMS system, it's days old. The CAG Rajasthan 2022 audit found a devastating consequence: 27% of PHCs had less than half of their essential drugs in stock. We built AushadhiSetu to fix this."

### 0:30 - 1:00: Input (Vision & Voice)
**Action (Screen):** Open the PWA on phone. Tap the "Photo" tab. Snap a picture of the register. Switch to "Voice" tab. 
**Speaker:** "Using our Next.js App Router PWA deployed on Vercel, the pharmacist just snaps a photo at the end of the day. For quick adjustments, they can also use our Hindi voice module. Watch as I hold the button and say: 'पैरासिटामोल के सौ पत्ते बांटे गए' (100 strips of Paracetamol distributed). It instantly converts to a structured update."

### 1:00 - 2:00: AI & Verification
**Action (Screen):** Show the extracted data table. Point out a cell highlighted in red. Change it to correct the checksum.
**Speaker:** "Our app sends the image directly to Gemini 2.5 Flash via AI Studio REST. We use strict JSON schemas to extract opening balance, received, issued, closing, batch, and expiry. Because AI isn't perfect, we run a local checksum: Opening + Received - Issued = Closing. Look here—a checksum failed, highlighting the cell in red. The pharmacist manually corrects '50' to '5' and clicks save. Human-in-the-loop is mandatory."

### 2:00 - 3:00: Risk Prediction
**Action (Screen):** Switch to the "Risk Board" tab. Expand the details for Paracetamol (RED) and ORS (AMBER).
**Speaker:** "Now, let's look at the Risk Board. Instead of expensive cloud ML, we use a lightweight local JS forecasting module on the edge. Paracetamol is marked RED because it will stock out in 9 days. ORS is AMBER due to an expiring batch. You'll see a simple 14-day moving average chart with P10 and P90 bands. We also generate simple rationale in Hindi and English—no generic chatbots, just focused insights based entirely on synthetic demo data."

### 3:00 - 3:40: Indent (Human Approval)
**Action (Screen):** Switch to "Indent Draft" tab. Edit Paracetamol quantity from 600 to 550. Click the 'MOIC Approve' checkbox. Click Download CSV.
**Speaker:** "When it's time to restock, AushadhiSetu suggests an indent. The pharmacist edits the suggested 600 down to 550 based on local knowledge. Crucially, the Medical Officer In-Charge (MOIC) must physically check the approval box. No auto-ordering is allowed. The approved indent is downloaded as a CSV, ready for manual upload to the state DVDMS."

### 3:40 - 4:00: Impact & Scale
**Action (Screen):** Show final slide with QR code to the Vercel app.
**Speaker:** "By preventing just two stockouts a month per PHC, we save roughly Rs 12,000 in emergency local purchases. Scaled to a district of 25,000 patients, the impact is massive. We're ready for a 30-day offline-first pilot. Try it yourself at aushadhisetu.vercel.app. Thank you."

### Fallback Plan (If Network/Mic Fails)
- **Camera/Net Fail:** Click the hidden "Load Mock Extract" button on the Photo tab to instantly load pre-processed Gemini JSON.
- **Mic Fail:** Use the provided `<details>` dropdown to reveal the typed Hindi text input box and click "Simulate Voice".
