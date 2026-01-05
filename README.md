# Pinagook

**Pinagook** is a web platform for **freelance English teachers** who teach online.  
It focuses on structured lesson content, interactive exercises, and a clean learning experience for students.

The first real user of Pinagook is my mom, who teaches English online — the project is built around her real teaching workflow and constraints.

---

## ✨ Goals

- Provide a structured way to deliver lessons and exercises online
- Keep lesson content, interaction, and progress in one place
- Serve as a real-world, evolving case study for my portfolio

---

## 🧱 Tech Stack (current)

- **Frontend:** Next.js (App Router), React, TypeScript  
- **Styling:** Tailwind CSS  
- **State & Logic:** local-first (client-side state + localStorage)  
- **Testing:** Vitest, React Testing Library, Playwright (E2E)  
- **Deployment:** Vercel (planned)

> Backend and database are intentionally postponed until content and UX are stable.

---

## 🎯 Core Use Cases (current scope)

### For teachers (local-first MVP)

- Define lesson content using a structured JSON format
- Validate lesson content before publishing
- Preview lessons and exercises before sharing
- Store and load multiple courses locally (no backend yet)

### For students (learning flow MVP)

- Open lessons step by step
- Read explanations and complete interactive tasks
- Get immediate feedback
- Resume progress after reload

---

## 🧱 Implemented Features

### Lesson content model

- Stable JSON structure: **Course → Lessons → Steps**
- Strong TypeScript types using discriminated unions
- Supported step types:
  - text / explanation  
  - single-choice  
  - input (fill-in-the-blank)  

---

### Runtime validation

- Manual runtime validation (no external schema libraries)
- Clear, path-based error messages for invalid content
- Same validation logic used for demo and teacher-imported courses

---

### Lesson Player (v1)

- Deterministic step-by-step flow
- Internal state includes:
  - current step index  
  - answers by stepId  
  - checked status per step  

**UX rules**
- Interactive steps require **Check** before **Next**
- Feedback and explanations shown after checking

---

### Scoring & results

- Unified scoring across step types
- Result screen with:
  - score summary (X / Y, percentage)
  - review of incorrect answers
  - retry option

---

### Local progress persistence

- Progress saved in localStorage:
  - current step
  - answers
  - checked states
  - timestamps
- Resume or restart prompt on reload

---

### Teacher import (Week 4.2)

- Paste or upload course JSON
- Validate content before saving
- Preview course structure (lessons, steps)
- Save valid courses locally
- Load teacher courses alongside demo content

---

### Testing (Week 4.3)

- **RTL + Vitest**
  - Lesson Player UX rules (Check / Next gating)
  - Input behavior
  - Progress persistence
- **Playwright E2E**
  - Full learning flow: course → lesson → steps → result → reload
- Focused on protecting the core learning loop

---

## 🗺 Roadmap (updated)

### Phase 0 — Foundations ✅

- [x] Content model and validation
- [x] Lesson Player v1
- [x] Scoring and result view
- [x] Local progress persistence

---

### Phase 1 — Authoring & Quality ✅

- [x] Teacher import (local-first)
- [x] Multi-course support (local)
- [x] Core test coverage (unit + E2E)

---

### Phase 2 — Content expansion (next)

- [ ] New step types (matching / pairs)
- [ ] Better explanations and feedback UX
- [ ] Improved teacher preview tools

---

### Phase 3 — Backend & accounts (later)

- [ ] Authentication (teacher / student)
- [ ] Persistent storage (database)
- [ ] Student accounts and submissions

---

### Phase 4 — Polish & portfolio

- [ ] Public landing page
- [ ] Demo data for recruiters
- [ ] Case study write-up
- [ ] Screenshots / GIFs

---

## 🚧 Status

> Project is in **active development**.  
> Current focus: content correctness, UX clarity, and safe authoring workflows before adding backend complexity.

---

## 📬 Contact

- GitHub: _to be added_
- LinkedIn: _to be added_
