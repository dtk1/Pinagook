# Pinagook Design System Specification

**Design Blueprint & Tokens**  
Combines **Lingo** (Playful, tactile EdTech player), **Bento** (Modular card-grid dashboard), and **Shadcn** (Clean utility UI) tuned for the **Ocean/Dolphin** theme.

---

## 🎨 Color Palette & Tokens

### Primary Brand (Ocean & Dolphin)
- `--color-ocean-blue`: `#0ea5e9` (Sky 500)
- `--color-ocean-teal`: `#14b8a6` (Teal 500)
- `--color-ocean-deep`: `#0891b2` (Cyan 600)
- `--color-ocean-light`: `#e0f2fe` (Sky 100)
- `--color-ocean-gradient`: `linear-gradient(135deg, #0ea5e9 0%, #14b8a6 100%)`

### Interactive & Feedback (Lingo Tokens)
- `--color-success`: `#58cc02` (Bright Lingo Green)
- `--color-success-shadow`: `#46a302` (Tactile 3D Green Border)
- `--color-warning`: `#ffc800` (Playful Gold)
- `--color-warning-shadow`: `#d7a700`
- `--color-danger`: `#ff4b4b` (Feedback Red)
- `--color-danger-shadow`: `#ea2b2b`
- `--color-primary-shadow`: `#0284c7` (3D Blue Shadow)

---

## 🔤 Typography

- **Display & Learning Font:** `Nunito`, sans-serif (Soft, friendly, high readability for exercises)
- **Dashboard & UI Font:** `Geist` / `Inter`, sans-serif
- **Code & Specs Font:** `Geist Mono` / `JetBrains Mono`

---

## 🧱 Component Design Patterns

### 1. Tactile 3D Buttons (`lingo` style)
Interactive CTA buttons (like "Check Answer", "Next Step", "Start Lesson") use a 3D bottom border elevation (`border-b-4 active:border-b-0 active:translate-y-1 transition-all`) to provide satisfying physical feedback for online learners.

### 2. Bento Card Grid (`bento` style)
Dashboard cards (`/teacher`, `/courses`, `/progress`) use subtle borders (`border-[#e6eef2]`), rounded corners (`rounded-2xl`), uniform padding (`p-6`), and soft hover lift (`hover:-translate-y-1 hover:shadow-lg`).

### 3. Glassmorphism Navigation
Top bar uses `backdrop-blur-md bg-white/85 border-b border-sky-100` for a fresh, dolphin-smooth ocean header.
