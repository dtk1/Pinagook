# Pinagook

**Pinagook** is a web platform for **freelance English teachers** who teach online.  
It helps teachers organize lessons, share interactive materials with students, and keep everything in one place instead of jumping between chats, docs and links.

The first real user of Pinagook is my mom, who teaches English online — the project is built around her everyday workflow.

---

## ✨ Goals

- Make it easier for freelance teachers to run online lessons
- Give students a clean, focused space with lesson materials and homework
- Use this project as a real-world case study for my portfolio and internship applications

---

## 🧱 Tech Stack (planned)

- **Frontend:** Next.js (React + TypeScript), Tailwind CSS, shadcn/ui  
- **Backend:** Next.js API routes / Server Actions  
- **Database & Auth:** PostgreSQL (Supabase/Neon)  
- **Realtime / Interactivity:** Supabase Realtime or similar  
- **Deployment:** Vercel (app) + Supabase (DB, auth, storage)  

> This may change while the project evolves.

---

## 🎯 Core Use Cases (MVP)

**For teachers**

- Create and manage students
- Create lessons and attach materials (texts, PDFs, links, videos)
- Create simple interactive exercises (quizzes, questions, tasks)
- Share a link or invite students to specific lessons
- See which students have opened/completed tasks

**For students**

- Log in and see upcoming / past lessons
- Open materials for each lesson in one place
- Complete simple interactive tasks and send answers to the teacher

---

## 🗺 Roadmap

### Phase 0 — Project setup

- [ ] Define user personas (teacher, student)
- [ ] Finalize core MVP scope for the first real user (my mom)
- [ ] Initialize Next.js + TypeScript project
- [ ] Set up Tailwind CSS and basic design system (colors, typography)
- [ ] Connect Supabase (auth + database)

---

### Phase 1 — Authentication & Roles

- [ ] Email/password sign up & login
- [ ] Role-based access (teacher / student)
- [ ] Basic account settings page
- [ ] Protect routes based on role

---

### Phase 2 — Teacher Dashboard (MVP)

- [ ] Teacher home dashboard (overview)
- [ ] Students management:
  - [ ] Add / edit / archive students
  - [ ] Assign students to groups (optional)
- [ ] Lessons management:
  - [ ] Create / edit / delete lessons
  - [ ] Attach materials (text, links, files)
- [ ] Simple status tracking (e.g. "draft", "published")

---

### Phase 3 — Student Area (MVP)

- [ ] Student dashboard with list of lessons
- [ ] Lesson detail page with all materials
- [ ] Basic homework submission (text answer / file upload)
- [ ] Status of completion visible to teacher

---

### Phase 4 — Interactive Exercises

- [ ] Data model for exercises (e.g. quiz, open question)
- [ ] UI for creating exercises in teacher dashboard
- [ ] UI for solving exercises in student view
- [ ] Basic grading or “completed / not completed” status

---

### Phase 5 — Realtime & Quality of Life

- [ ] Realtime updates for submissions (teacher sees updates without refresh)
- [ ] Notifications / toasts for key actions
- [ ] Better error handling & validation
- [ ] Basic analytics for teacher (e.g. how many tasks completed)

---

### Phase 6 — Polish & Portfolio

- [ ] Public landing page explaining Pinagook
- [ ] Demo teacher & student accounts for recruiters
- [ ] Case study write-up (problem → solution → tech → results)
- [ ] Screenshots & GIFs for portfolio and CV
- [ ] “Building in public” posts summarizing the journey

---

## 🚧 Status

> Project is in **early development**.  
> The roadmap will change as I test the platform with real lessons.

---

## 📬 Contact

If you’re interested in the project or have ideas / feedback:

- GitHub: _add later_
- LinkedIn: _add later_
