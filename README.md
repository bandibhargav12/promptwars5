# AuraCelebrate — GenAI Celebration & Event Planner

> **PromptWars — Challenge 5: Celebration & Event Planner**  
> An intelligent, production-grade GenAI planning assistant that empowers hosts, couples, and organizers to effortlessly craft unforgettable **Weddings**, **Milestone Birthdays**, and **Community Gatherings** with itemized budgets, chronological run-of-show timelines, vendor checklists, and personalized aesthetic concepts.

---

## 🌟 Live Deployment
- **Production URL**: [https://ais-pre-nm7wm2cznnf2ndkee2uxqo-632020188759.asia-east1.run.app](https://ais-pre-nm7wm2cznnf2ndkee2uxqo-632020188759.asia-east1.run.app)
- **Framework**: React 19 + TypeScript + Express Full-Stack + Tailwind CSS v4 + Vite
- **GenAI Foundation**: Google Gemini (`gemini-3.8-flash`) via `@google/genai` TypeScript SDK

---

## 🎯 Problem Statement Alignment

| Required Pillar | Implementation Details in AuraCelebrate |
| :--- | :--- |
| **Weddings** | Dedicated Tuscan vineyard master preset, aisle timelines, couples portraits, plated dinners, and floral repurpose strategies. |
| **Milestone Birthdays** | Dedicated 40th rooftop penthouse preset with champagne tower staging, live DJ/sax cue schedules, and passed canapé budgets. |
| **Community Events** | Dedicated Riverside Autumn Harvest festival blueprint with city permits, generator power, stall layout, and volunteer coordination. |
| **Itemized Budgets** | Category-by-category allocations, actual cost ledgers, deposit paid toggles, variance progress gauges, and AI cost-saving optimizations. |
| **Run-of-Show Timelines** | Dual-view timeline engine: multi-month preparation checklists + hour-by-hour day-of execution cues with lead coordinators. |
| **Vendor Checklists** | Comprehensive partner pipeline (*Prospecting* $\rightarrow$ *Booked*) with vetting questionnaires and contract deliverables. |
| **Personalized Ideas** | Bespoke theme concepts, harmonized color swatches with copyable hex codes, sensory atmosphere notes, and invitation drafts. |

---

## 🧠 GenAI Architecture & Integration

AuraCelebrate utilizes a secure, server-side Express architecture with `@google/genai`:
1. **Server-Side Security**: All Gemini calls run strictly within server routes (`/api/ai/generate-event-plan` and `/api/ai/refine-section`), preventing client-side API key exposure.
2. **Structured JSON Output**: System instructions enforce zero-hallucination, strictly typed JSON matching event schemas without markdown parsing fragility.
3. **Two-Stage Generation**:
   - **Stage 1 (Master Blueprint Generation)**: Coordinates all four pillars simultaneously (Theme, Budget, Timeline, Vendors) tailored to user budget caps, date, guest counts, and style vibes.
   - **Stage 2 (Contextual Advisory Consultant)**: Interactive drawer offering instant refinement on catering budget alternatives, toast schedules, photographer vetting, and weather contingencies.

---

## 🛡️ Evaluation Metrics Breakdown

### 1. Code Quality
- Strict TypeScript with modular component architecture.
- Separation of concerns: UI components, shared types, persistent state managers, and Express backend proxies.
- Zero build warnings or type errors (`tsc --noEmit` clean).

### 2. Security
- API keys kept exclusively on server environment (`process.env.GEMINI_API_KEY`).
- Safe JSON parsing with fallback schemas and input boundary validation.
- Sanitized user payloads with limits on payload size.

### 3. Efficiency
- High-performance React 19 with local caching (`localStorage`) and instant optimistic UI updates.
- Fast sub-10ms unit tests using Vitest.
- Tabular figures (`tabular-nums`) to prevent layout thrashing and jitter during budget adjustments.

### 4. Testing
- Vitest automated test suite (`src/__tests__/eventPlanner.test.ts`) covering:
  - Preset data integrity across all 4 pillars
  - Budget calculations, actual cost tallies, and remaining variances
  - Milestone completion state transitions
  - Vendor contract checklist status validations
- Run tests: `npm test`

### 5. Accessibility (WCAG AA)
- Semantic HTML tags (`header`, `nav`, `main`, `section`, `table`, `thead`, `tbody`).
- High contrast ratios ($\ge 4.5:1$) on warm ivory and deep slate surfaces.
- Zero-pill metadata design with clean unboxed text and typographic separators.
- Keyboard accessible modal workflows with Escape and focus handling.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone <your-repo-link>
cd auracelebrate

# Install dependencies
npm install

# Run automated tests
npm test

# Run typecheck and linting
npm run lint

# Start full-stack development server
npm run dev
```

Visit `http://localhost:3000` to interact with AuraCelebrate.
