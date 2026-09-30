# Data & AI Spec: AushadhiSetu

This document outlines the data schemas, AI prompts, and analytical logic for AushadhiSetu, tailored for Option A constraints (Vercel, local JSON, Gemini via AI Studio REST, no billing).

## 1. Drug Master (`data/drugs_60.csv`)
A local CSV defining the 60 essential drugs. A 10-row sample has been saved to `data/drugs_60.csv`.
Schema: `drug_code, name_en, name_hi, unit, category, max_month_norm`

## 2. Stock Row JSON Schema (`data/seed.json`)
Data will be stored as an array of JSON objects in `data/seed.json` (bypassing Firestore/BigQuery).

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "phcId": { "type": "string" },
    "date": { "type": "string", "format": "date" },
    "drugCode": { "type": "string" },
    "batch": { "type": "string" },
    "expiry": { "type": "string", "format": "date" },
    "opening": { "type": "integer" },
    "received": { "type": "integer" },
    "issued": { "type": "integer" },
    "closing": { "type": "integer" },
    "source": { "type": "string", "enum": ["photo", "voice", "csv"] },
    "confidence": { "type": "number", "minimum": 0, "maximum": 1 },
    "bbox": { 
      "type": "array", 
      "items": { "type": "number" },
      "minItems": 4, 
      "maxItems": 4 
    }
  },
  "required": ["phcId", "date", "drugCode", "batch", "expiry", "opening", "received", "issued", "closing", "source"]
}
```

### Validation Rules (Implemented in API Routes):
1. **Checksum:** `opening + received - issued == closing`
2. **EDL Whitelist:** Fuzzy match `drugCode` against `data/drugs_60.csv`
3. **Quantity Range:** `opening, received, issued, closing` must be between `0` and `10000`
4. **Expiry Check:** `expiry` date must be strictly in the future.

*Note: All data is clearly labelled as synthetic "Demo Data".*

## 3. Gemini Vision Extraction Pipeline
**Endpoint:** Gemini 2.5 Flash via AI Studio REST (no Vertex).
**Prompt:** Saved to `docs/extract_prompt.txt`.
**Guards:** Explicit instruction to ignore embedded text directives to prevent prompt injection. Strict JSON format requirement.

## 4. Free Voice Pipeline (Web Speech API -> Gemini)
**Implementation:** Browser `MediaRecorder` + Web Speech API (`hi-IN`) -> Gemini for entity extraction. (Bypasses Chirp 2 billing).

**Example Utterances & Expected Output:**
1. **Input:** "पैरासिटामोल के सौ पत्ते बांटे गए बैच नंबर ए बी सी बारह, एक्सपायरी दिसंबर चौबीस"
   **Expected JSON:** `{"drug": "Paracetamol 500mg", "qty_issued": 100, "batch": "ABC12", "expiry": "2024-12-31"}`
2. **Input:** "ओआरएस पचास पैकेट मिले, बैच एक्स वाई, एक्सपायरी जनवरी पच्चीस"
   **Expected JSON:** `{"drug": "ORS Sachet", "qty_received": 50, "batch": "XY", "expiry": "2025-01-31"}`
3. **Input:** "आयरन की बीस गोली दी, बैच बी निन्यानवे, एक्सपायरी अगले साल मार्च"
   **Expected JSON:** `{"drug": "Iron Folic Acid", "qty_issued": 20, "batch": "B99", "expiry": "2025-03-31"}`
4. **Input:** "एमोक्सिसिलिन दस पत्ते खत्म, बैच ज़ेड वन, एक्सपायरी नवंबर तेईस" (Note: expired date)
   **Expected JSON:** `{"drug": "Amoxicillin 250mg", "qty_issued": 10, "batch": "Z1", "expiry": "2023-11-30"}`
5. **Input:** "सिट्रीजीन पांच सौ गोली आई है, बैच सी टी सौ, एक्सपायरी दो हज़ार छब्बीस"
   **Expected JSON:** `{"drug": "Cetirizine 10mg", "qty_received": 500, "batch": "CT100", "expiry": "2026-12-31"}`

**Hindi Confirmation Template:**
"आपने कहा: {drug_name_hi} की {qty} {unit} {action_hi}। बैच {batch}, एक्सपायरी {expiry}। क्या यह सही है?"
*(Action: 'बांटी गई' for issued, 'प्राप्त हुई' for received)*

## 5. JavaScript Forecasting Module
Saved to `lib/forecast.js`.
Calculates 14-day moving average, estimated stockout date, and confidence bands (P10/P90). Includes low-history flagging and a naive backtest method for hackathon scoring metrics (MAPE/Recall).

## 6. Risk & Anomaly Rules

### RAG Risk Categorization:
- **RED (Critical):** `days_of_stock <= 14`
- **AMBER (Warning):** `(days_of_stock > 14 AND days_of_stock <= 30)` OR `(expiry_days <= 90 AND overstocked)`
- **GREEN (Healthy):** All other states.

### Anomaly Detection:
- Flag if `issued > (daily_footfall * 3)` for a specific drug.

### Gemini Explanation Template (Risk Insight):
**English:** "Attention: {drug_name} is running critically low. Based on the 14-day moving average usage of {avg_daily_use} units/day, your current stock of {current_stock} will run out on {stockout_date}. We recommend indenting {suggested_indent} units."
**Hindi:** "ध्यान दें: {drug_name_hi} का स्टॉक बहुत कम है। पिछले 14 दिनों के उपयोग ({avg_daily_use} {unit}/दिन) के आधार पर, आपका वर्तमान स्टॉक ({current_stock}) {stockout_date} को खत्म हो जाएगा। हम {suggested_indent} {unit} मंगाने का सुझाव देते हैं।"
