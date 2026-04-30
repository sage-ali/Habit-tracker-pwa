# Habit Tracker PWA (Stage 3)

A mobile-first Progressive Web App (PWA) built with Next.js that allows users to track their daily habits and build streaks. This project emphasizes technical discipline, deterministic behavior, and rigorous testing.

## Features

- **Deterministic Authentication**: Local signup and login using `localStorage`.
- **Habit Management**: Create, edit, and delete daily habits with descriptions and unique slugs.
- **Advanced Streak Tracking**: Real-time calculation of current streaks based on consecutive daily completions.
- **PWA Capabilities**: Installable, themeable, and supports offline access to the app shell via Service Workers.
- **Responsive Design**: Mobile-first UI optimized for 320px up to desktop.

## Setup Instructions

1. **Install Dependencies**:

   ```bash
   pnpm install
   ```

2. **Run Development Server**:

   ```bash
   npm run dev
   ```

3. **Build and Start**:

   ```bash
   npm run build
   npm run start
   ```

## Testing Instructions

### Unit Tests (Vitest)

Verifies utility functions like slug generation, validators, and streak calculations.

```bash
npm run test:unit
```

### Integration Tests (Vitest + RTL)

Verifies complex component interactions like auth flows and habit form logic.

```bash
npm run test:integration
```

### End-to-End Tests (Playwright)

Verifies full user journeys, persistence after reload, and offline app shell loading.

```bash
# Ensure dev server is running or Playwright will start it automatically
npm run test:e2e
```

## Local Persistence Structure

The app uses `localStorage` for all data, following the exact Stage 3 contracts:

- **`habit-tracker-users`**: Array of users with IDs, emails, and hashed/plain passwords.
- **`habit-tracker-session`**: The active user session (userId and email).
- **`habit-tracker-habits`**: Array of habits including `completions` (list of YYYY-MM-DD strings).

## PWA Implementation

- **Registration**: Managed in `src/components/ServiceWorkerRegistration.tsx` with a robust check for `document.readyState`.
- **Caching Strategy**: The Service Worker (`public/sw.js`) uses a "Cache First" approach for the app shell (`/`, `/login`, `/signup`, `/dashboard`) to ensure the app loads without a hard crash when offline.
- **Activation**: Utilizes `self.clients.claim()` and `skipWaiting()` logic to ensure the service worker takes control immediately upon installation.

## Trade-offs and Limitations

- **Local Persistence**: Data is tied to the specific browser and device. Clearing site data will reset the application.
- **Security**: For this stage, authentication is deterministic and local. In a production environment, this would be replaced with a secure backend and JWT/Session cookies.
- **Offline Data**: Only the app shell is cached. While the UI loads offline, any new data changes are stored in `localStorage` and remain local.

## Test File Mapping

| Test File | Behavior Verified |
|-----------|--------------------|
| `tests/unit/slug.test.ts` | **getHabitSlug**: lowercase, hyphenation, alphanumeric filtering. |
| `tests/unit/streaks.test.ts` | **calculateCurrentStreak**: consecutive days, duplicate handling, streak breaks. |
| `tests/unit/validators.test.ts` | **validateHabitName**: empty rejection, 60-char limit, trimming. |
| `tests/unit/habits.test.ts` | **toggleHabitCompletion**: immutability, duplicate prevention, add/remove logic. |
| `tests/integration/auth-flow.test.tsx` | **Auth Flow**: Signup (duplicate check), Login (credential check), Session creation. |
| `tests/integration/habit-form.test.tsx` | **Habit Form**: Validation errors, CRUD operations, streak UI updates. |
| `tests/e2e/app.spec.ts` | **E2E Flow**: Splash redirection, authenticated routing, reload persistence, offline loading. |
