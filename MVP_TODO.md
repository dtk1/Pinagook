# Pinagook — MVP ToDo (Cursor build plan)

## 0) Setup
- [ ] Vite + React + TS
- [ ] ESLint + Prettier
- [ ] React Router
- [ ] Base UI (Tailwind or CSS Modules)
- [ ] Folder structure: app/pages/features/entities/shared

## 1) Routes from SITEMAP.md
- [ ] Create all pages as stubs (title only)
- [ ] Add layouts: Public/Auth/Teacher/Admin
- [ ] Add navigation links + active state

## 2) Auth (mock)
- [ ] Auth context/store
- [ ] Mock users: teacher/admin
- [ ] Login/Register screens wired to auth store
- [ ] Guards: RequireAuth + RequireRole
- [ ] Logout

## 3) Data (localStorage)
- [ ] Types: User, Lesson, LessonBlock, Template, Result
- [ ] Mock data for lessons/templates
- [ ] Persistence helpers (load/save)

## 4) Teacher (core)
- [ ] Dashboard cards + "Create lesson"
- [ ] Lessons list (CRUD)
- [ ] Lesson create/edit (blocks add + reorder)
- [ ] Preview + "Get student link"
- [ ] Results page reads submissions

## 5) Student Viewer (no login)
- [ ] Render lesson by id
- [ ] Submit writes Result into localStorage
- [ ] Thank-you state

## 6) Templates
- [ ] Templates list + filters
- [ ] "Use template" creates lesson draft

## 7) Admin (minimal)
- [ ] Users list (mock)
- [ ] Lessons list (read-only)
- [ ] Analytics placeholder

## 8) Finish
- [ ] Empty states + 404
- [ ] Basic responsive
- [ ] Deploy
