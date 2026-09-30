# Product Requirements Document: AushadhiSetu (Last-Mile PHC Stock Guardian)

## 1. Problem Statements

| Statement Type | Description |
| :--- | :--- |
| **Submission-Ready Problem Statement** | Despite state-level Digital Vaccine & Drug Management Systems (DVDMS), last-mile Primary Health Centres (PHCs) rely heavily on manual paper-based Drug Distribution Registers for 80-120 essential medicines. This creates critical latency in data entry, frequently omits vital batch and expiry tracking, and forces pharmacists to calculate drug indents based on "gut feel" rather than data. Audits reveal severe consequences, including significant stockouts of essential drugs at the PHC level and widespread mismatches between actual stock and centralized digital inventory records. |
| **Simple-Language Version** | Rural health centers struggle to keep track of their medicine stock because they use paper registers to record everything that comes in and goes out. Entering this information into the government's computer system takes days, and they often forget to record expiry dates. When it's time to order more medicine, the pharmacist just guesses how much they need. This leads to empty shelves for important medicines and a huge mess where the computer says one thing, but the shelf says another. |

## 2. Personas

| Persona | Role | Pain Points | Goals |
| :--- | :--- | :--- | :--- |
| **The Pharmacist** | PHC Level Stock Manager | - Overwhelmed by daily manual register updates for 100+ drugs.<br>- Struggles to manually track batches and nearing expiries.<br>- Double data entry (paper then DVDMS) causes delays. | - Simplify daily stock tracking and eliminate manual math.<br>- Quickly identify which medicines are expiring soon.<br>- Easily generate data-backed indent (restock) requests. |
| **MOIC (Medical Officer In-Charge)** | PHC Approver | - Cannot verify if indent requests match actual consumption.<br>- Blind to current stock levels when prescribing.<br>- Held responsible during audits for stockout events. | - Review and approve stock indents quickly with high confidence.<br>- Ensure no essential drugs run out under their watch.<br>- Maintain an audit-ready digital log of stock movements. |
| **District Officer** | District Inventory Supervisor | - Receives delayed, inaccurate stock data from PHCs.<br>- Cannot proactively redistribute stock to prevent expiry.<br>- Lacks visibility into ground-level consumption patterns. | - Gain near real-time visibility into PHC stock status.<br>- Receive aggregated alerts for critical stockouts.<br>- Make data-driven decisions on regional drug distribution. |

## 3. Functional Requirements (User Stories)

| # | Persona | User Story | Acceptance Criteria |
| :--- | :--- | :--- | :--- |
| **1** | Pharmacist | As a Pharmacist, I want to capture a photo of the daily paper register so that Gemini 2.5 Flash can extract the daily issues/receipts. | - Must accept image upload.<br>- Gemini API extracts Opening, Received, Issued, Closing, Batch, Expiry.<br>- User must be able to review and correct extracted data before saving. |
| **2** | Pharmacist | As a Pharmacist, I want to view a dashboard of my current inventory so that I know exactly what is in stock. | - Displays list of all essential drugs.<br>- Shows current stock levels grouped by batch/expiry.<br>- Highlights drugs below minimum threshold (Stockout warning). |
| **3** | Pharmacist | As a Pharmacist, I want the system to generate a recommended stock indent based on past consumption so I don't have to guess. | - System calculates recommended order quantity using simple JS forecasting (e.g., moving average).<br>- Recommends indent only when stock hits reorder level.<br>- Must clearly label data as "Demo Data". |
| **4** | Pharmacist | As a Pharmacist, I want to submit a draft indent to the MOIC for review so that it can be authorized. | - Pharmacist can edit recommended indent quantities.<br>- Submission changes indent status to "Pending MOIC Approval".<br>- Audit log records who created the draft. |
| **5** | MOIC | As a MOIC, I want to review pending indents so that I can approve or modify them based on clinical priorities. | - Dashboard shows list of "Pending" indents.<br>- MOIC can edit quantities, Reject, or Approve.<br>- Must explicitly require human approval click (No auto-orders). |
| **6** | District Officer | As a District Officer, I want to view a district-level summary dashboard so that I can monitor overall stock health. | - Displays aggregated stock levels across all (simulated) PHCs.<br>- Lists PHCs with highest stockout risk.<br>- Uses `seed.json` for simulated multi-PHC data. |
| **7** | Pharmacist | As a Pharmacist, I want to receive alerts for drugs expiring in the next 30/60/90 days so that I can use them first. | - Visual flags on inventory dashboard for expiring batches.<br>- Dedicated "Expiring Soon" list view.<br>- Sortable by nearest expiry date. |
| **8** | System | As an Auditor, I want the system to maintain a complete history of all transactions so that changes are traceable. | - All manual edits to extracted data are logged.<br>- Every indent status change (Created, Approved) logs User, Timestamp, and Action.<br>- Read-only Audit Log view available. |

## 4. Non-Functional Requirements

| Category | Requirement | Details |
| :--- | :--- | :--- |
| **Localization** | Hindi Support | UI labels and key instructions must toggle between English and Hindi. |
| **Performance** | Low-End Android Compatibility | PWA must be lightweight, responsive, and render smoothly on sub-$100 Android devices with poor 3G/4G connectivity. |
| **Speed** | OCR Extraction Latency | Gemini 2.5 Flash extraction of the register image must return results in `< 5 seconds`. |
| **Traceability** | Audit Logging | All data modifications and approvals must be immutable and timestamped. |
| **Privacy & Security** | No Patient PII | System strictly tracks drug volume/batches. It must never capture, store, or process Patient Names, IDs, or health records. |

## 5. Out of Scope

| # | Out of Scope Item | Reason |
| :--- | :--- | :--- |
| **1** | Direct/Live integration with government DVDMS | Banned by constraints; highly complex for a 7-10 day hackathon. |
| **2** | Patient-level dispensing or EMR features | Violates the "No Patient PII" constraint and drifts from inventory focus. |
| **3** | Automated ordering/purchasing | "Human approval mandatory, never auto-order" constraint. |
| **4** | Real-world database deployments (PostgreSQL, etc.) | Forced to use local JSON / `seed.json` due to stack constraints. |
| **5** | Generic AI Chatbot / Conversational Interface | Specifically prohibited by prompt constraints; focus is strictly on OCR and forecasting. |
| **6** | Supplier/Manufacturer portals | Focus is strictly last-mile (District -> PHC). |

## 6. Success Metrics

| Metric | Description | Target / Measurement |
| :--- | :--- | :--- |
| **Stockout Recall** | Ability of the JS forecast to correctly predict when a drug will run out. | > 90% accuracy against synthetic historical data. |
| **Extraction Accuracy** | Accuracy of Gemini 2.5 Flash extracting register columns (Opening, Issued, Batch, etc.). | > 95% of cells correctly transcribed from clear images. |
| **Manual Edit Rate** | Frequency of pharmacists having to correct the AI-extracted register data. | < 10% of extracted rows require manual correction. |
| **Time Saved** | Reduction in time spent calculating daily balances and generating indents. | ~2 hours saved per day per Pharmacist. |
| **Demo Checklist** | Verification that the PWA fulfills all hackathon constraints for judging. | 100% completion (PWA on Vercel, `seed.json` used, "Demo Data" labels visible, no PII, human-approved indents). |
