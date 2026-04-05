# FinVault — Finance Dashboard

> A clean, responsive, animated personal finance dashboard built as a frontend assignment.
---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18** or higher
- npm **v9** or higher

### Installation

```bash
# 1. Create project (if starting fresh)
npm create vite@latest finance-dashboard -- --template react

# 2. Install dependencies
npm install

# 3. Install Zustand
npm install zustand
```

### Run Development Server

```bash
npm run dev
```

Opens at **http://localhost:5173** with Hot Module Replacement.

### Production Build

```bash
npm run build
npm run preview
```

Outputs optimised assets to `/dist`. Preview serves the production build locally.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── dashboard/
│   │   ├── SummeryCards.jsx      # KPI summary row (Balance, Income, Expenses, Savings Rate)
│   │   └── Insights.jsx          # Donut chart, bar charts, category breakdown, insight cards
│   ├── layout/
│   │   └── Navbar.jsx            # Navigation + role switcher + hamburger menu
│   ├── transactions/
│   │   └── TransactionList.jsx   # Filterable, sortable table with CRUD modal
│   └── ui/
│       └── Button.jsx            # Reusable button component
├── store/
│   └── useFinanceStore.js        # Zustand store — all state & computed selectors
├── utils/
│   └── helpers.js                # Currency/date formatting, category colours & icons
├── App.jsx                       # Root shell, tab routing
├── App.css                       # All styles — dark editorial theme
└── main.jsx                      # Entry point
```

---

## ✅ Features

| Feature | Description | Status |
|---|---|---|
| Dashboard Overview | Summary cards, trend charts, donut chart, category breakdown | ✅ Complete |
| Transaction List | Search, filter, sort, paginate — 27 mock entries | ✅ Complete |
| Role-Based UI | Viewer (read-only) / Admin (full CRUD) | ✅ Complete |
| Insights Section | Top spend, MoM change, savings rate, income avg | ✅ Complete |
| State Management | Zustand with computed selectors & reactive filters | ✅ Complete |
| Responsive Design | 6 breakpoints — desktop to 320px mobile | ✅ Complete |
| Data Persistence | localStorage via Zustand persist middleware | ✅ Complete |
| CSV Export | Exports all filtered transactions as `.csv` | ✅ Complete |
| Animations | fadeUp, countUp, shimmer, barGrow, modalIn… | ✅ Complete |
| Empty State Handling | Graceful fallback on all lists and charts | ✅ Complete |
| Hamburger Nav | Mobile drawer with role switcher inside | ✅ Complete |

---

## 🎯 Feature Details

### Dashboard Overview

- Four KPI cards — Total Balance, Total Income, Total Expenses, Savings Rate
- Each card has a colour-coded value, animated glow orb, and hover shimmer effect
- Monthly income and expense bar charts — bars grow up from zero on render
- Donut chart showing top-6 spending categories with percentage breakdown
- Ranked category list with animated inline progress bars

### Transactions Section

- 27 mock transactions spanning January–April 2025 across 8 categories
- Real-time search across description and category name
- Filter by transaction type (income / expense) and by category
- Sort by date (newest / oldest) or by amount (highest / lowest)
- Pagination — 10 transactions per page
- CSV export — downloads all currently filtered transactions
- Edit / Delete buttons fade in on row hover — **Admin only**

### Role-Based UI

Switch roles via the dropdown in the navbar. No authentication required — this is a frontend UI demonstration.

| Role | Access |
|---|---|
| **Viewer** | Read-only — browse, search, filter, export. No add/edit/delete controls. |
| **Admin** | Full CRUD — `+ Add` button in toolbar, ✏️ edit and 🗑️ delete on each row. |

### Insights Section

- Highest spending category with total amount
- Month-over-month expense change as a percentage
- Overall savings rate (income − expenses ÷ income)
- Average monthly income across all recorded months
- Full donut and bar charts available on dedicated Insights tab

---

## 🗃️ State Management

All application state lives in a single **Zustand store** (`useFinanceStore.js`). The `persist` middleware serialises state to `localStorage` — transactions, role, and filters survive page reloads.

### Store Shape

```js
{
  transactions: [...],        // All transaction objects
  role: 'viewer' | 'admin',   // Current active role
  filters: {
    search: '',
    type: 'all',
    category: 'all',
    sortBy: 'date-desc'
  },
  activeTab: 'dashboard'      // Controls which page renders
}
```

### Computed Selectors (inside the store)

| Selector | Returns |
|---|---|
| `getFilteredTransactions()` | Applies search, type, category and sort filters |
| `getSummary()` | Balance, income and expense totals |
| `getCategoryBreakdown()` | Expenses grouped by category, sorted descending |
| `getMonthlyTrend()` | Income & expenses grouped by `YYYY-MM` for charts |
| `getCategories()` | Deduplicated list of all category names |

> All derived data is computed in the store, not in components — zero prop drilling.

---

## 🎨 Design Decisions

### Visual Aesthetic

Dark editorial theme inspired by fintech terminal interfaces.

- **Background** — near-black `#060910` with a subtle 44px cyan grid texture
- **Accent** — `#22D3EE` cyan for active states, borders, and key values
- **Typography** — `Syne` (800 weight) for headings, `DM Mono` for all data and body text
- **Cards** — `#0E1520` fill with 1px borders that brighten on hover
- **No external chart library** — all SVG rendered inline, fully styled with CSS variables

### Animation Catalogue

| Animation | Trigger |
|---|---|
| `fadeUp` | Staggered entrance for cards and page sections |
| `countUp` | KPI values bounce in from below on load |
| `pulseGlow` | Background orbs on summary cards breathe |
| `shimmer` | Light sweep on button and card hover |
| `barGrow` | Bar chart bars grow up from zero on render |
| `fillWidth` | Category breakdown bars expand from left |
| `modalIn` | Modal scales in with a bounce curve |
| `rowIn` | Transaction rows slide in from the left |
| `float` | Brand icon and empty-state icons gently float |
| `drawerDown` | Mobile navigation drawer slides down |

### Responsive Breakpoints

| Breakpoint | Context | Behaviour |
|---|---|---|
| `≤ 1100px` | Tablet Landscape | Charts reflow to 2-column grid |
| `≤ 900px` | Tablet Portrait | Cards go 2-col; transaction table columns tighten |
| `≤ 768px` | Large Mobile | Nav tab labels hidden — icon only |
| `≤ 650px` | Mobile | Transaction table becomes card layout; filters stack |
| `≤ 520px` | Small Mobile | Hamburger appears; mobile drawer activates |
| `≤ 480px` | XS Mobile | Padding tightened; modal becomes bottom sheet |

---

## 📦 Tech Stack

| Technology | Layer | Reason |
|---|---|---|
| React 18 + Vite | Framework | Fast HMR, modern bundler, optimised production build |
| Zustand 5 | State Management | Minimal boilerplate, built-in persist middleware |
| Plain CSS | Styling | Full control, CSS variables, zero runtime overhead |
| Hand-built SVG | Charts | No external deps, fully themed, lightweight bundle |
| DM Mono + Syne | Typography | Terminal data feel + bold editorial headings |
| Zustand persist | Persistence | localStorage with zero config — survives reload |

---

## 🧠 Assumptions Made

1. **Currency** — INR (₹); salary ranges in mock data reflect Indian market rates
2. **No backend** — all data is static mock data; persistence is client-side only
3. **No authentication** — role switching is a UI demo, not a real auth flow
4. **Categories are predefined** — 8 categories cover the mock dataset; admins can assign any when adding/editing
5. **Insights tab** — shares the same component as Dashboard insights to avoid duplicating chart logic

---

## ✨ Optional Enhancements Implemented

- [x] **Data persistence** — transactions and role survive page reload via `localStorage`
- [x] **CSV export** — downloads all currently filtered transactions as `.csv`
- [x] **Hamburger navigation** — full mobile drawer with role controls inside
- [x] **Animations** — 10+ `@keyframes` animations throughout the UI
- [x] **Empty state handling** — all charts and lists handle zero-data gracefully
- [x] **`prefers-reduced-motion`** — all animations disabled for accessibility

---

## 📋 Evaluation Criteria

### Design & Creativity
Dark editorial aesthetic with intentional typography pairing (Syne + DM Mono), animated glow accents, shimmer effects, and a consistent colour system using CSS variables. Every interactive element has a considered hover state.

### Responsiveness
Six responsive breakpoints from desktop (1300px max-width) down to 320px mobile. Transaction table reflows to a card layout on small screens. Navigation collapses to a hamburger drawer. Modals become bottom sheets on mobile.

### Functionality
All core requirements implemented — dashboard overview, transaction list with filters and sorting, role-based UI (Viewer/Admin), insights section with charts, and state management with persistence.

### User Experience
Staggered entrance animations prevent the page from feeling static. Transaction row actions are hidden until hover to reduce visual noise. The mobile drawer includes the role switcher so users can change role on any device.

### Technical Quality
Single Zustand store with computed selectors keeps all business logic out of components. No prop drilling. CSS variables used consistently. All charts built without external dependencies, keeping the bundle lean.

### State Management
Zustand with persist middleware handles transactions, filters, active tab, and role. All derived data is computed in the store via selector functions — not in component render cycles.

### Documentation
This README covers setup, architecture, features, design decisions, assumptions, and evaluation criteria mapping.

### Attention to Detail
Edge cases handled throughout — empty transaction list shows a friendly state, zero-data charts display fallback messages, the savings rate handles division-by-zero gracefully, and CSV export handles special characters in descriptions. `prefers-reduced-motion` is respected.


## 📂 **Make `.gitignore`**
Create a `.gitignore` file in the root of your project and add the following:

```bash
node_modules
dist
.env
```

### 📌 Why ignore these?

* **node_modules/** → contains dependencies (can be reinstalled using `npm install`)

---

## **📦 GitHub Setup (Push Project)**

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/divya-36736/zorvynAssignment.git
git push -u origin main
```

### **⚠️ If push fails (existing repo)**

```bash
git push -f origin main
```

---

## **🌐 Deployment (Vercel)**

### **🚀 Method 1: Using Vercel Dashboard**

1. Go to **https://vercel.com**
2. Sign in with **GitHub**
3. Click **New Project**
4. Import your repository
5. Click **Deploy**

# 💰 Finance Dashboard

🔗 **Live Demo:** https://zorvyn-assignment-lac.vercel.app/

---

