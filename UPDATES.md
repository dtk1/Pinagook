# Updates - Pinagook

**Last Updated:** 2025-01-27  
**Current Version:** Week 5.2 (Authentication + Cookie-based SSR)

---

## Week 5.2 - Authentication + Cookie-based SSR ✅

**Date:** 2025-01-27  
**Status:** Complete

### 🎯 Overview

Реализована полная система аутентификации с использованием Supabase Auth и cookie-based SSR для Next.js App Router. Удален временный `TEMP_OWNER_ID`, все операции теперь используют реального аутентифицированного пользователя.

### ✨ Новые возможности

#### 1. Аутентификация пользователей
- **Регистрация** (`/auth/register`)
  - Создание нового аккаунта с email и password
  - Валидация пароля (минимум 6 символов)
  - Поддержка подтверждения email
  - Автоматическая отправка письма подтверждения
  - Кнопка повторной отправки письма подтверждения

- **Вход** (`/auth/login`)
  - Вход с email и password
  - Обработка ошибок (неверные данные, неподтвержденный email)
  - Редирект на защищенные страницы после входа
  - Сохранение параметра `next` для редиректа после входа

- **Выход**
  - Server action для безопасного выхода
  - Очистка cookies и сессии
  - Редирект на страницу входа

#### 2. Cookie-based SSR
- **Server-side клиент** (`app/lib/supabase/server.ts`)
  - Использование `@supabase/ssr` для работы с cookies
  - Поддержка server components и server actions
  - Автоматическая синхронизация cookies между клиентом и сервером

- **Browser клиент** (`app/lib/supabase/browser.ts`)
  - Сохранен для клиентских компонентов
  - Поддержка `onAuthStateChange` для реактивных обновлений

#### 3. Защита маршрутов
- **`/teacher`** - защищен, требует аутентификации
- **`/dev/db`** - защищен, требует аутентификации + только в development режиме
- Автоматический редирект на `/auth/login?next=<path>` для неаутентифицированных пользователей

#### 4. Auth Context
- **`app/contexts/AuthContext.tsx`**
  - Реактивный провайдер для клиентских компонентов
  - Подписка на изменения состояния аутентификации
  - Хук `useAuth()` для доступа к текущему пользователю
  - Метод `signOut()` для выхода

#### 5. Server Actions
- **`app/actions/authActions.ts`**
  - `signUpAction()` - регистрация нового пользователя
  - `signInAction()` - вход существующего пользователя
  - `signOutAction()` - выход из системы
  - `resendConfirmationAction()` - повторная отправка письма подтверждения

#### 6. Утилиты
- **`app/lib/auth/requireUser.ts`**
  - Server-only helper для защиты маршрутов
  - Автоматический редирект на login при отсутствии аутентификации
  - Возвращает объект пользователя или делает редирект

### 🔧 Технические изменения

#### Новые зависимости
```json
{
  "@supabase/ssr": "^2.x.x"
}
```

#### Обновленные файлы
- `app/lib/supabase/server.ts` - cookie-based SSR клиент
- `app/actions/devSeedCourse.ts` - использует реальный `user.id` вместо `TEMP_OWNER_ID`
- `app/features/course-storage/coursesRepository.ts` - все функции теперь async (await для createServerSupabaseClient)

#### Новые файлы
- `app/actions/authActions.ts` - server actions для аутентификации
- `app/auth/login/page.tsx` - страница входа
- `app/auth/register/page.tsx` - страница регистрации
- `app/lib/auth/requireUser.ts` - helper для защиты маршрутов
- `app/teacher/TeacherPageClient.tsx` - клиентский компонент для teacher page

### 🐛 Исправления

1. **Email confirmation handling**
   - Добавлена обработка неподтвержденного email
   - Кнопка повторной отправки письма подтверждения
   - Информативные сообщения для пользователя

2. **TypeScript errors**
   - Исправлены все ошибки типов в новых файлах
   - `createServerSupabaseClient()` теперь async функция
   - Все вызовы обновлены с await

3. **Route protection**
   - Корректная защита server components
   - Правильные редиректы с сохранением `next` параметра

### 📝 Breaking Changes

- **`createServerSupabaseClient()`** теперь async функция
  - Все вызовы должны использовать `await`
  - Обновлены: `requireUser()`, `authActions`, `coursesRepository`, `devSeedCourse`

- **`TEMP_OWNER_ID` удален**
  - Все операции с курсами теперь требуют аутентификации
  - `devSeedCourse` использует реальный `user.id`

### 🚀 Как использовать

#### Регистрация нового пользователя
1. Перейдите на `/auth/register`
2. Введите email и password (минимум 6 символов)
3. Нажмите "Create Account"
4. Если требуется подтверждение email, проверьте почту и нажмите на ссылку
5. После подтверждения войдите через `/auth/login`

#### Вход в систему
1. Перейдите на `/auth/login`
2. Введите email и password
3. Нажмите "Sign In"
4. Если email не подтвержден, используйте кнопку "Resend Confirmation Email"

#### Защита новых маршрутов
```typescript
// В server component
import { requireUser } from '../lib/auth/requireUser';

export default async function ProtectedPage() {
  const user = await requireUser('/protected-page');
  // user гарантированно существует здесь
  return <div>Protected content</div>;
}
```

#### Использование Auth Context в клиентских компонентах
```typescript
'use client';
import { useAuth } from '../contexts/AuthContext';

export default function ClientComponent() {
  const { user, isLoading, signOut } = useAuth();
  
  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;
  
  return (
    <div>
      <p>Welcome, {user.email}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

### ⚠️ Важные замечания

1. **Email Confirmation**
   - Если в Supabase включено подтверждение email, пользователи должны подтвердить email перед входом
   - Письма отправляются автоматически при регистрации
   - Можно запросить повторную отправку через кнопку "Resend Confirmation Email"

2. **Cookies в Server Actions**
   - Server actions могут иметь ограничения на установку cookies
   - Для полной поддержки может потребоваться middleware (опционально)

3. **Development режим**
   - `/dev/db` доступен только при `NODE_ENV === 'development'`
   - В production этот маршрут будет недоступен

4. **Environment Variables**
   - Убедитесь, что установлены:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 🔄 Миграция с Week 5.1

Если вы обновляетесь с Week 5.1:

1. **Установите зависимости:**
   ```bash
   npm install @supabase/ssr
   ```

2. **Обновите вызовы `createServerSupabaseClient()`:**
   ```typescript
   // Было:
   const supabase = createServerSupabaseClient();
   
   // Стало:
   const supabase = await createServerSupabaseClient();
   ```

3. **Удалите `TEMP_OWNER_ID`:**
   - Все операции теперь используют реального пользователя
   - Убедитесь, что пользователь аутентифицирован перед операциями с курсами

4. **Защитите маршруты:**
   - Используйте `requireUser()` в server components
   - Используйте `useAuth()` в client components

---

## Week 5.1 - Supabase Foundation ✅

**Date:** 2025-01-27  
**Status:** Complete

### 🎯 Overview

Создана инфраструктура для работы с Supabase: клиенты для браузера и сервера, типы базы данных, репозиторий для курсов, и dev-инструменты для тестирования.

### ✨ Новые возможности

#### 1. Supabase клиенты
- **Browser client** (`app/lib/supabase/browser.ts`)
  - Для использования в клиентских компонентах
  - Поддержка `persistSession` и `autoRefreshToken`

- **Server client** (`app/lib/supabase/server.ts`)
  - Для использования в server components и server actions
  - Использует anon key (до Week 5.2)

#### 2. Типы базы данных
- **`app/lib/supabase/db.types.ts`**
  - TypeScript определения для таблиц `profiles` и `courses`
  - Типобезопасные операции с базой данных

#### 3. Courses Repository
- **`app/features/course-storage/coursesRepository.ts`**
  - `listCoursesForOwner(ownerId)` - список курсов пользователя
  - `getCourseRawJson(ownerId, courseId)` - получение raw JSON курса
  - `upsertCourseFromRawJson(ownerId, rawJson)` - сохранение/обновление курса
  - Использует существующую валидацию из `content/validate.ts`

#### 4. Dev инструменты
- **`app/actions/devSeedCourse.ts`**
  - Server action для тестирования записи в БД
  - Использовал `TEMP_OWNER_ID` (заменен в Week 5.2)

- **`app/dev/db/page.tsx`**
  - Dev-страница для тестирования операций с БД
  - Кнопка для seeding demo курса

### 🔧 Технические изменения

#### Новые зависимости
```json
{
  "@supabase/supabase-js": "^2.90.1"
}
```

#### Новые файлы
- `app/lib/supabase/browser.ts`
- `app/lib/supabase/server.ts`
- `app/lib/supabase/db.types.ts`
- `app/features/course-storage/coursesRepository.ts`
- `app/actions/devSeedCourse.ts`
- `app/dev/db/page.tsx`
- `app/dev/db/SeedButton.tsx`

### 📊 Database Schema

#### Таблица `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL CHECK (role IN ('teacher', 'student')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Таблица `courses`
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES profiles(id),
  course_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  raw_json JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(owner_id, course_id)
);
```

### 🚀 Как использовать

#### Seeding курса в БД
1. Убедитесь, что у вас есть пользователь в Supabase Auth
2. Создайте профиль в таблице `profiles` с `id = user.id`
3. Откройте `/dev/db` (только в development)
4. Нажмите "Seed Demo Course"
5. Курс будет сохранен в таблицу `courses`

#### Использование repository
```typescript
import { listCoursesForOwner, upsertCourseFromRawJson } from '../features/course-storage/coursesRepository';

// Список курсов пользователя
const courses = await listCoursesForOwner(userId);

// Сохранение курса
const result = await upsertCourseFromRawJson(userId, courseJson);
```

---

## Changelog Summary

### Week 5.2 (2025-01-27)
- ✅ Добавлена полная система аутентификации
- ✅ Cookie-based SSR с `@supabase/ssr`
- ✅ Защита маршрутов `/teacher` и `/dev/db`
- ✅ Страницы входа и регистрации
- ✅ Обработка неподтвержденного email
- ✅ Удален `TEMP_OWNER_ID`, используется реальный `user.id`
- ✅ Auth Context для клиентских компонентов
- ✅ Server actions для аутентификации

### Week 5.1 (2025-01-27)
- ✅ Supabase клиенты (browser + server)
- ✅ Типы базы данных
- ✅ Courses repository
- ✅ Dev инструменты для тестирования
- ✅ Интеграция с существующей валидацией

---

## Next Steps

### Week 5.3 (Planned)
- [ ] Миграция загрузки курсов на приоритет БД
- [ ] Реализация sharing курсов (teacher → student)
- [ ] Настройки видимости курсов
- [ ] Удаление курсов

### Future Enhancements
- [ ] Middleware для автоматической защиты маршрутов
- [ ] Role-based access control
- [ ] Password reset flow
- [ ] Email templates customization
- [ ] OAuth providers (Google, GitHub)

---

**Generated:** 2025-01-27  
**Version:** 0.1.0 (Week 5.2)
