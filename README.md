# 🛡️ Insurely — Insurance Intelligence & Hospital Cost Transparency

## 💡 Overview

**Insurely** is a platform that democratizes access to real-world insurance claim data and hospital billing patterns. It helps patients understand the risk of insurance claim denials, compare medical procedure costs across hospitals, and gain insights into policy exclusions — before they even get admitted.

---

## 🔍 Problem Statement

- 48% of insurance claims in India are denied — often without clarity.
- Patients face unpredictable and inflated hospital bills.
- No centralized system provides transparency into what gets approved or denied, and why.

---

## 🎯 Objectives

- Predict insurance claim denial risks based on bill and policy data.
- Benchmark treatment costs across hospitals and cities.
- Expose insurer-specific denial patterns and hospital overcharging trends.
- Provide patients with actionable insights — before treatment begins.

---

## 🛠️ Core Features

### 1. 📄 Bill Upload (OCR + Parsing)
- Upload scanned hospital bills or insurance documents.
- Uses OCR (Tesseract or Google Vision) to extract and process text.

### 2. 🚫 Denial Prediction Engine
- NLP-powered system detects common denial reasons:
  - Pre-existing condition
  - Room rent sub-limits
  - Policy exclusions
  - Missing pre-authorization
- Displays real-time denial risk percentages.

### 3. 💰 Cost Mapping & Benchmarking
- Uses procedure codes (ICD-10/CPT) to categorize treatment types.
- Shows cost comparisons across hospitals and cities.
- Displays insurer-specific approval/denial rates for procedures.

### 4. 🔍 Claim Comparison Feed
- Crowdsourced, anonymized database of real claims.
- Includes hospital, insurer, cost, and denial reason.

### 5. 🗺️ Geo-Mapped Insights
- Visualizes hospital costs and approval trends using OpenStreetMap + Leaflet.js.

---

## 🧪 Data Strategy

- Collect initial data from Reddit, Twitter, and forums.
- Use synthetic but realistic bills for MVP demo.
- Incentivize real bill submissions post-launch (e.g., ₹50 cashback via UPI).

---

## ⚙️ Tech Stack

| Layer        | Technology                         |
| ------------ | ---------------------------------- |
| Frontend     | Flutter / Next.js                  |
| Backend      | Node.js (API), FastApi (NLP engine)|
| OCR Engine   | Tesseract.js / Google Vision API   |
| NLP          | spaCy + rule-based logic           |
| Database     | Firebase / Firestore               |
| Maps         | Leaflet.js + OpenStreetMap         |
| Auth         | Firebase Authentication            |

---

## 💥 Why Insurely?

Unlike traditional systems where:
- Patients are unaware of their claim risks
- Costs are hidden and unpredictable
- Denials come without justification

**Insurely** offers:
- Predictive denial warnings
- Real cost comparisons
- Transparency through crowdsourced data

---

## 🌟 End Vision

A smarter, crowdsourced insurance & billing intelligence platform that:
- Prevents unnecessary claim denials
- Empowers patients with real-world data
- Increases transparency in India's healthcare ecosystem

---

## 🚀 Get Involved

Want to contribute? Open issues, suggest features, or submit PRs — every step helps improve India’s healthcare transparency.

---

## 📄 License

This project is under the MIT License. See the [LICENSE](LICENSE) file for more details.
