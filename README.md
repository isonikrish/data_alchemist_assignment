# 🧪 Data Alchemist – Assignment by [Your Name]

A spreadsheet-like web interface to:
- Upload CSV data
- Edit data in-place
- Validate via AI (or fallback logic)
- Generate & export business rules

## ✅ Features Implemented

- 📤 Upload CSV for clients, workers, and tasks
- ✍️ Editable Excel-style data grid
- 🧠 AI validation (fallbacks to local validator on quota errors)
- ✅ Validation summary with errors per section
- 🔧 Manual rule builder with Co-run, Load limit, Slot restriction, Priority
- 🤖 AI rule generation via prompt
- 📥 Export rules as `rules.json`
- 📊 Export validated data as CSV

## 🛠 Tech Stack

- Next.js (App Router)
- Zustand (for file state)
- Tailwind + ShadCN UI
- Lucide icons
- Papaparse for CSV
- Google Gemini API (fallback local validation)

## 🧩 Future Improvements

- Add advanced rule types: regex/patterns/precedence
- Smarter AI-based rule suggestions from dataset
- Better validations for nested JSON

---

> Built as part of the **Data Alchemist Assignment**.
