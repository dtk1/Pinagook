# Pinagook — Sitemap (MVP)

## Public
- / (Landing Page)
- /viewer/:lessonId (Student Lesson Viewer — no login)
- /policies (Policies)

## Auth
- /login
- /register
- /forgot-password
- /reset-password

## Teacher (protected)
- /teacher/dashboard
- /teacher/lessons
- /teacher/lessons/create
- /teacher/lessons/:id/edit
- /teacher/lessons/:id/preview
- /teacher/lessons/:id/results
- /teacher/templates
- /teacher/profile

## Student
- /viewer/:lessonId (no login)

## Admin (protected)
- /admin/users
- /admin/lessons
- /admin/analytics
- /admin/plans (future)
- /admin/settings
