# Agent Guidelines & Project Rules

## ⚠️ Critical Git Workflow Rule
- **DO NOT PUSH CODE TO `main` UNTIL EXPLICITLY INSTRUCTED BY THE USER.**
- Keep all ongoing development, commits, and pushes on feature branches (e.g. `feat/cctv-exclusive-pivot` or dedicated task branches).
- Never automatically merge feature branches into `main` or execute `git push origin main` without a direct user command.

---

## Project Overview
- **Project Name:** Meksha CCTV Solutions & Services
- **Business:** Authorized CCTV Cameras & Security Systems Store (Wholesale & Retail in Davanagere, Karnataka).
- **Tech Stack:**
  - React 18 + TypeScript + Vite
  - Styling: Vanilla CSS (`src/index.css`)
  - Icons: `lucide-react`
  - Persistence: Context API (`src/context/ShopContext.tsx`) with LocalStorage syncing.

---

## Coding & Architectural Conventions
1. **Brand Identity:**
   - Store Name: **MEKSHA CCTV SOLUTIONS** (all solid blue `#2563eb`, no split colors).
   - Tagline: Authorized CCTV Cameras & Security Systems Store.
2. **Category Ordering:**
   - Categories use administrative sequential numbers (`orderNumber`: 1, 2, 3...) for ordering on the storefront.
   - Numbers (`#1`, `#2`, etc.) are hidden from customers on the storefront — only the category names and items are displayed.
3. **Popups & Modals:**
   - The CCTV Cost Estimator is an on-demand modal popup with clean, light styling (`#ffffff` / `#f8fafc`) and a circular `✕` close button at top-right.
4. **Spacing & Responsiveness:**
   - Keep inter-section spacing compact (`6px` to `16px`) so mobile users do not encounter large empty white spaces or excessive scrolling.
5. **Quality Assurance:**
   - Always run `npm run build` (`tsc && vite build`) to verify zero TypeScript and build errors before concluding turns.
