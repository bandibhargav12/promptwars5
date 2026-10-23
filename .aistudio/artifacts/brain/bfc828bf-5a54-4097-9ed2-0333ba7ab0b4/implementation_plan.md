# Celebration & Event Planner (AuraCelebrate)

A GenAI-powered intelligent celebration and event planning assistant designed to help hosts and organizers effortlessly craft unforgettable weddings, milestone birthdays, and community gatherings with comprehensive budget breakdowns, run-of-show timelines, vendor checklists, and bespoke creative concepts.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural and UX choices have been aligned based on user preferences and event planning domain requirements:

- **Confirmed Aesthetic**: Elegant and Warm Celebration style with soft champagne gold (`amber-600/700`, warm metallics), deep slate structural tones (`slate-900`, `slate-800`), rich parchment neutral canvas, and high typographic contrast.
- **Confirmed Event Scope**: First-class support and pre-engineered blueprints for the top 3 celebration categories: **Weddings**, **Milestone Birthdays**, and **Community Gatherings**, plus support for custom event setups.
- **Confirmed GenAI Scope**: End-to-end full blueprint generation utilizing Gemini (`gemini-3.8-flash`) delivering:
  1. Creative theme concept, palette, atmosphere, and styling inspiration.
  2. Itemized category-by-category budget allocations with realistic cost ranges and contingency buffers.
  3. Interactive run-of-show timeline (months-out milestones down to hour-by-hour day-of schedule).
  4. Vendor checklists with sourcing questions, contract checklist items, and deliverables tracking.
- **Data Persistence**: Robust client-side persistence (`localStorage` with JSON import/export) and preset sample celebrations so users can immediately test, iterate, customize, or export their plans without setup friction.

---

### 1. Overview & Core Concept

- **What It Does**: AuraCelebrate transforms complex, stressful event planning into a seamless, inspiring experience. Users can input basic celebration criteria (event type, guest count, budget cap, target date/location, and stylistic vibes or special traditions). Within seconds, the Gemini-powered assistant orchestrates a complete, tailored master plan across four synchronized pillars: **Creative Mood & Theme**, **Itemized Budget**, **Run-of-Show Timelines**, and **Vendor Checklist**.
- **Target Audience & Persona**:
  - Couples planning modern weddings seeking structured clarity without hiring high-fee consultants.
  - Individuals organizing milestone birthdays (30th, 50th, quinceañeras, sweet 16s) looking for personalized touches and smooth pacing.
  - Community organizers, HOA leaders, and local committee chairs coordinating community festivals, galas, and charity mixers.
- **Key Value**: Replaces scattered spreadsheets, forgotten vendor emails, and chaotic notes with a unified, interactive cockpit that updates dynamically as numbers change or ideas evolve.

---

### 2. User Experience & Visual Design

#### Key User Flows
1. **Event Launchpad & Quick Presets**:
   - Welcome view with high-clarity event cards for **Weddings**, **Milestone Birthdays**, and **Community Gatherings**, plus an instant "Create Custom Event" trigger.
   - Pre-populated demo blueprints allowing immediate exploration without typing.
2. **AI Blueprint Generator Wizard**:
   - Step 1: Event basics (Title, type, date, location/setting, guest count, currency, total budget).
   - Step 2: Vibe & Style (Aesthetic preferences, formality, dietary/entertainment preferences, special traditions or must-haves).
   - Step 3: Generation & Streaming (Live feedback showing Gemini assembling theme concepts, calculating category percentages, formulating timelines, and generating vendor tasks).
3. **Master Planner Workspace (4 Synchronized Tabs)**:
   - **Overview & Theme Studio**: Visual color palette swatches, decor & lighting concepts, guest experience flow, and invitation wording suggestion.
   - **Budget Cockpit**: Total budget gauge, category breakdown (Venue, Catering, Decor, Photography, Entertainment, Contingency), itemized line items with estimated vs. actual expenses, and add/edit/delete line item controls.
   - **Timeline & Run-of-Show**: Dual timeline view — **Preparation Milestones** (e.g. 6 months out, 1 month out, 1 week out) and **Day-of Schedule** (hour-by-hour itinerary with assigned contacts and location notes).
   - **Vendor Checklist & Task Board**: Vendor categories (Catering, Florals, Audio/Visual, Rentals, Photo/Video) with checklist statuses (Not Contacted, In Talks, Quote Received, Booked, Paid Deposit), plus contact info and contract deliverables.
4. **Interactive Customization & Export**:
   - Users can add custom tasks, update budget spent numbers, check off vendor tasks, regenerate specific sections with Gemini (e.g., "Suggest 3 budget-saving alternatives for catering"), and export the complete plan to Printable PDF/HTML format or JSON backup.

#### Visual Identity & Theme
- **Aesthetic Direction**: Refined modern celebration — warm editorial elegance with crisp architectural lines. Avoiding garish confetti or tacky party cliches.
- **Color Palette & Distribution (60-30-10 Rule)**:
  - **60% Dominant Canvas**: Warm off-white / ivory canvas (`bg-[#FDFBF7]` in light mode, `bg-slate-950` in dark mode).
  - **30% Structural Surfaces**: Warm stone and slate cards (`bg-white` / `bg-stone-50`, hairline borders `border-stone-200/80` or `border-slate-800`), charcoal typography (`text-stone-900` / `text-stone-600`).
  - **10% Accent Budget**: Polished celebration gold & champagne amber (`text-amber-700`, `bg-amber-600`, hover `bg-amber-700`, subtle warm badge borders).
- **Typography & Scale**:
  - Display Font: `Outfit` / `Plus Jakarta Sans` for clean, modern headings with editorial flair.
  - Body Font: `DM Sans` / `Plus Jakarta Sans` for scannable legibility.
  - Numeric Data: Strictly tabular figures (`font-mono tabular-nums`) for currency amounts, dates, and budget progress bars.
- **Component Styling & Anti-Slop Restraint**:
  - Clean unboxed metadata with typographic separators (`·`, `/`).
  - Strict Top Bar Contract: Brand title (`AuraCelebrate`), single-line navigation links, and 1 primary action button (`+ New Celebration`).
  - No decorative status dots or fake telemetry.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Stack Express Proxy for Gemini API Calls**
  - *Chosen Approach*: Implement an Express server API route (`/api/ai/generate-event-plan` and `/api/ai/refine-section`) calling `@google/genai` with `gemini-3.8-flash`.
  - *Why*: Complies with system security instructions (never expose `GEMINI_API_KEY` to client browser). Provides reliable JSON schema validation and error fallback handling.
  - *Alternatives Considered*: Direct client calls (strictly forbidden due to security risks) or mock-only templates (violates GenAI requirements).
- **Decision 2: Hybrid AI Generation + Direct Manual CRUD Editing**
  - *Chosen Approach*: The AI generates structured initial state that the user can immediately edit, tweak, reorder, check off, or expand directly in the UI.
  - *Why*: Event planning is inherently iterative; users need the speed of AI combined with the granular control of a real spreadsheet/checklist.
- **Decision 3: Structured JSON Schema Output from Gemini**
  - *Chosen Approach*: Use Gemini's `responseMimeType: "application/json"` with comprehensive TypeScript typing for themes, budget items, timelines, and vendors.
  - *Why*: Guarantees reliable parsing into state objects without brittle markdown regex scraping.
- **Decision 4: Preset Template Blueprints Built-in**
  - *Chosen Approach*: Ship with 3 meticulously crafted ready-to-explore celebrations (Golden Vineyard Wedding, 40th Rooftop Milestone Birthday, Annual Riverside Harvest Festival) so evaluation and review are instant even before triggering a new AI prompt.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                          AuraCelebrate Web Client                      │
│                                                                        │
│  ┌─────────────────────────┐  ┌──────────────────────────────────────┐ │
│  │ Top Bar & Event Picker  │  │ Active Celebration Header & Tabs     │ │
│  └───────────┬─────────────┘  └──────────────────┬───────────────────┘ │
│              │                                   │                     │
│  ┌───────────▼───────────────────────────────────▼───────────────────┐ │
│  │ View Router / Active Workspace Tab                                │ │
│  │  ├─ [Overview & Theme]  (Color swatches, vibe description, ideas) │ │
│  │  ├─ [Budget Cockpit]    (Itemized costs, gauges, variance track)   │ │
│  │  ├─ [Timeline Matrix]   (Milestones & Day-of hour-by-hour run)    │ │
│  │  └─ [Vendor Checklist]  (Contact pipeline, quote status, tasks)   │ │
│  └───────────────────────────────────┬───────────────────────────────┘ │
│                                      │                                 │
│  ┌───────────────────────────────────▼───────────────────────────────┐ │
│  │ Local State & Storage Manager (Zustand/React State + LocalStorage)│ │
│  └───────────────────────────────────┬───────────────────────────────┘ │
└──────────────────────────────────────┼─────────────────────────────────┘
                                       │ HTTP POST (Event Prompts)
                                       ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Node / Express Backend Proxy                       │
│  - Endpoint: POST /api/ai/generate-plan                                │
│  - Endpoint: POST /api/ai/refine-item                                  │
│  - Environment: GEMINI_API_KEY                                         │
│  - SDK: @google/genai (gemini-3.8-flash)                               │
└────────────────────────────────────────────────────────────────────────┘
```

#### Core Data Models
- **`CelebrationEvent`**:
  - `id`: string
  - `title`: string
  - `type`: `'wedding' | 'birthday' | 'community' | 'custom'`
  - `date`: string
  - `location`: string
  - `guestCount`: number
  - `totalBudget`: number
  - `currency`: string (USD, EUR, GBP, INR, etc.)
  - `theme`: `{ title, aesthetic, colorPalette: { name, hex }[], atmosphere, musicStyle, decorConcept, invitationWording }`
  - `budget`: `{ totalBudget, categories: { name, allocated, spent, items: { id, name, estimatedCost, actualCost, paid, notes }[] } }`
  - `timeline`: `{ milestones: { id, timeframe, title, description, completed }[], dayOfSchedule: { id, time, activity, location, leadPerson, notes }[] }`
  - `vendors`: `{ id, category, name, contact, quoteAmount, status, notes, checklist: string[] }[]`

#### Interactive Component & State Mapping
- **`EventWizardModal`**: Collects inputs, sends prompt to `/api/ai/generate-plan`, displays step-by-step progress, and commits the resulting celebration to application state.
- **`BudgetTracker`**: Computes totals, displays allocated vs spent percentages, flags category overages, and supports inline line-item addition/deletion.
- **`TimelineView`**: Allows toggling milestone completion with instant status updates, reordering or adding day-of events.
- **`VendorBoard`**: Organizes vendors by status stage (Prospecting, Quoted, Booked, Completed) with quick status dropdowns and contract notes.
- **`ExportModal`**: Formats printable master summary, runs of show, and JSON data.
