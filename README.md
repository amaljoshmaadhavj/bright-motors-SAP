# Bright Motors - SAP MM Reorder Planning

A storekeeper-facing web application for **SAP Materials Management (MM) Reorder Planning (Plan-to-Fulfil)**, built for Bright Motors brake-pad inventory operations.

---

## Problem

Bright Motors manages multiple brake-pad SKUs across two warehouse plants (PLT-100, PLT-200). Storekeepers currently rely on manual stock checks and SAP transactions to identify low-stock items, calculate reorder quantities, and submit purchase requests. This process is:

- **Slow** - finding below-threshold SKUs requires scanning full inventory lists
- **Error-prone** - manual reorder calculations lead to over- or under-ordering
- **Disconnected** - no quick visibility into PR status after submission

There is no single screen that answers: *Which items need replenishment right now, how much should I order, and what happens after I submit?*

---

## Solution

A lightweight React SPA that provides a **single dashboard** for the full reorder lifecycle:

| Step | What the user does | What the app does |
|------|-------------------|-------------------|
| **1. Identify** | Opens the dashboard | Flags all SKUs where Current Qty < ROP in red |
| **2. Review** | Clicks Reorder on an item | Shows detail panel with stock meters, AI recommendation, and suggested quantity |
| **3. Adjust** | Edits reorder qty / vendor if needed | Validates input (positive integer, max 3x ROP) |
| **4. Submit** | Confirms the purchase request | Creates PR, updates stock level, refreshes KPIs instantly |
| **5. Track** | Navigates to PR Log | Views all submitted PRs with status and estimated delivery |
| **6. Correct** | Clicks pencil on Current Qty | Updates physical stock count after a stock-take |

**Core formula:** Reorder Qty = (ROP x 1.2) - Current Qty

The 1.2x buffer reduces how often the same item needs reordering.

---

## Architecture

`
+-----------------------------------------------------------+
|                    Data Layer                              |
|  src/data/inventory.js                                    |
|  - 6 brake-pad SKUs, 5 vendors, formula helpers           |
|  - Single source of truth for all screens                 |
+----------------------------+------------------------------+
                             |
+----------------------------v------------------------------+
|                   Store Layer                             |
|  src/store/useStore.jsx                                   |
|  - React Context + useReducer                             |
|  - Actions: SUBMIT_REORDER, UPDATE_QTY                    |
|  - KPIs derived live from state (no hardcoded values)     |
|  - Toast notification system                              |
+----------------------------+------------------------------+
                             |
+----------------------------v------------------------------+
|                   View Layer                              |
|  +----------+  +----------+  +--------------------+      |
|  |Dashboard |  | PR Log   |  | Business Rules     |      |
|  |KPI Cards |  | PR List  |  | Formula reference  |      |
|  |Table     |  | Empty    |  | Step-by-step flow  |      |
|  |Edit Qty  |  | state    |  | Worked example     |      |
|  +----+-----+  +----------+  +--------------------+      |
|       |                                                  |
|  +----v--------------+    +----------------------+        |
|  | ReorderPanel      |    | Header Dropdowns      |      |
|  | Stock meters      |    | Notifications (Bell)  |      |
|  | AI Recommendation |    | Settings              |      |
|  | Reorder form      |    +----------------------+        |
|  | Confirmation      |                                    |
|  +-------------------+                                    |
+-----------------------------------------------------------+
                             |
+----------------------------v------------------------------+
|                   AI Layer                                |
|  src/hooks/useAiRecommendation.js                        |
|  - OpenAI API (if VITE_OPENAI_API_KEY is set)            |
|  - Rule-based fallback when no key is available          |
|  - Recommendation grounded in each SKU's actual data     |
+-----------------------------------------------------------+
`

---

## User Flow

`
  +-------------+
  |  Dashboard   |  KPIs: Total SKUs | Below ROP | Active PRs | Inventory Value
  |              |  Table: searchable, filterable, editable stock
  +------+------+
         | click "Reorder" on a below-ROP item
         v
  +-------------+
  |  Reorder     |  Stock meters (ROP vs Current)
  |  Panel       |  AI recommendation (urgency, coverage, cost)
  |  (slide-over)|  Editable reorder qty with validation
  |              |  Vendor selector with lead times
  +------+------+
         | click "Submit Reorder"
         v
  +-------------+
  | Confirmation |  Success toast + confirmation card
  |              |  KPIs update, PR count increments
  +------+------+
         | navigate to PR Log
         v
  +-------------+
  |  PR Log      |  Submitted PRs with SKU, qty, vendor, est. delivery
  +-------------+
`

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 8 |
| State | React Context + useReducer |
| Animations | Framer Motion |
| Icons | Lucide React |
| Styling | Custom CSS (SAP Fiori-inspired design system) |
| AI | OpenAI API with rule-based fallback |

---

## Quick Start

`ash
# Clone the repo
git clone https://github.com/<your-org>/bright-motors-SAP.git
cd bright-motors-SAP

# Install dependencies
npm install

# Start development server
npm run dev
`

Opens at **http://localhost:5173**.

---

## Environment Variables

Create a .env file in the project root (optional):

`env
VITE_OPENAI_API_KEY=sk-your-key-here
`

| Variable | Required | Description |
|----------|----------|-------------|
| VITE_OPENAI_API_KEY | No | OpenAI API key for AI reorder recommendations. Falls back to rule-based recommendation if not set. |

**Never commit .env files.** They are gitignored by default.

---

## Build & Deploy

`ash
npm run build       # Output: dist/
npm run preview     # Preview production build locally
`

### Deploy to GitHub Pages

`ash
# 1. Update vite.config.js with your repo name:
#    base: '/bright-motors-SAP/',

# 2. Build and push
npm run build
git add dist -f
git commit -m "deploy: build for production"
git push

# 3. In GitHub repo -> Settings -> Pages -> Source: "gh-pages" branch
`

### Deploy to Netlify / Vercel

- **Build command:** 
pm run build
- **Output directory:** dist
- **Framework preset:** Vite

No server-side logic required - the entire app is a static SPA.

---

## Project Structure

`
bright-motors-SAP/
+-- index.html
+-- package.json
+-- vite.config.js
+-- .gitignore
+-- README.md
+-- src/
    +-- main.jsx                         Entry point
    +-- App.jsx                          View routing + Dashboard layout
    +-- index.css                        Full Fiori-inspired design system
    +-- data/
    |   +-- inventory.js                 SKUs, vendors, formula helpers
    +-- store/
    |   +-- useStore.jsx                 React Context state management
    +-- hooks/
    |   +-- useAiRecommendation.js       OpenAI integration + fallback
    +-- components/
        +-- Layout/
        |   +-- Header.jsx               Top bar with notifications + settings
        |   +-- Sidebar.jsx              Navigation sidebar
        +-- Dashboard/
        |   +-- KpiCards.jsx             Animated KPI summary cards
        |   +-- InventoryTable.jsx       Table + mobile cards + inline edit
        +-- Reorder/
        |   +-- ReorderPanel.jsx         Slide-over detail + reorder form
        +-- PRLog/
        |   +-- PrLog.jsx                Purchase request history
        +-- BusinessRules/
        |   +-- BusinessRules.jsx        Formula reference + user guide
        +-- UI/
            +-- Skeleton.jsx             Shimmer loading state
            +-- Toast.jsx                Success/error notifications
            +-- EmptyState.jsx           No-results placeholder
`

---

## Sample Data

| SKU | Description | ROP | Current Qty | Status |
|-----|-------------|-----|-------------|--------|
| PAD-X200 | Brake Pad 200mm - Front disc, ceramic | 500 | 380 | **Reorder** |
| PAD-X250 | Brake Pad 250mm - Rear disc, semi-metallic | 400 | 420 | OK |
| PAD-X180 | Brake Pad 180mm - Drum brake, organic | 350 | 190 | **Reorder** |
| PAD-X300 | Brake Pad 300mm - Heavy-duty, sintered | 200 | 85 | **Reorder** |
| PAD-X150 | Brake Pad 150mm - Scooter rear, NAO | 600 | 620 | OK |
| PAD-X220 | Brake Pad 220mm - Commercial vehicle | 300 | 140 | **Reorder** |

---

## License

Internal - Bright Motors
