import { test, expect } from '@playwright/test'

test.describe('Habit Tracker app', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('shows the splash screen and redirects unauthenticated users to /login', async ({
    page,
  }) => {
    await page.goto('/')
    const splash = page.getByTestId('splash-screen')
    await expect(splash).toBeVisible()

    // Wait for splash screen duration (1200ms) and redirect
    await expect(page).toHaveURL(/\/login/)
  })

  test('redirects authenticated users from / to /dashboard', async ({
    page,
  }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('user@example.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()
    await expect(page).toHaveURL(/\/dashboard/)

    await page.goto('/')
    await expect(page.getByTestId('splash-screen')).toBeVisible()
    await expect(page).toHaveURL(/\/dashboard/)
  })

  test('prevents unauthenticated access to /dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('signs up a new user and lands on the dashboard', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('newuser@example.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByText('newuser@example.com')).toBeVisible()
  })

  test("logs in an existing user and loads only that user's habits", async ({
    page,
  }) => {
    // Signup user 1 and create a habit
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('user1@example.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('User 1 Habit')
    await page.getByTestId('habit-save-button').click()
    await expect(page.getByTestId('habit-card-user-1-habit')).toBeVisible()

    await page.getByTestId('auth-logout-button').click()

    // Signup user 2
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('user2@example.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await expect(page.getByTestId('empty-state')).toBeVisible()
    await expect(page.getByTestId('habit-card-user-1-habit')).not.toBeVisible()
  })

  test('creates a habit from the dashboard', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('user@example.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await page.getByTestId('create-habit-button').click()
    await expect(page.getByTestId('habit-form')).toBeVisible()
    await page.getByTestId('habit-name-input').fill('Drink Water')
    await page.getByTestId('habit-description-input').fill('8 glasses')
    await page.getByTestId('habit-save-button').click()

    await expect(page.getByTestId('habit-card-drink-water')).toBeVisible()
    await expect(page.getByText('Drink Water')).toBeVisible()
  })

  test('completes a habit for today and updates the streak', async ({
    page,
  }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('user@example.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Streak Habit')
    await page.getByTestId('habit-save-button').click()

    const streakElement = page.getByTestId('habit-streak-streak-habit')
    await expect(streakElement).toHaveText('0 days')

    await page.getByTestId('habit-complete-streak-habit').click()
    await expect(streakElement).toHaveText('1 days')
  })

  test('persists session and habits after page reload', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('user@example.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await page.getByTestId('create-habit-button').click()
    await page.getByTestId('habit-name-input').fill('Persistent Habit')
    await page.getByTestId('habit-save-button').click()

    await page.reload()
    await expect(page.getByTestId('dashboard-page')).toBeVisible()
    await expect(page.getByTestId('habit-card-persistent-habit')).toBeVisible()
  })

  test('logs out and redirects to /login', async ({ page }) => {
    await page.goto('/signup')
    await page.getByTestId('auth-signup-email').fill('user@example.com')
    await page.getByTestId('auth-signup-password').fill('password123')
    await page.getByTestId('auth-signup-submit').click()

    await page.getByTestId('auth-logout-button').click()
    await expect(page).toHaveURL(/\/login/)

    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/login/)
  })

  test('loads the cached app shell when offline after the app has been loaded once', async ({
    context,
    page,
  }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/login/)

    // Wait for SW to register, install, activate, and finish caching
    await page.evaluate(async () => {
      if (!('serviceWorker' in navigator)) return

      const sw = navigator.serviceWorker

      // Wait for an active SW controlling this page
      await new Promise<void>((resolve) => {
        if (sw.controller) {
          resolve()
          return
        }
        sw.addEventListener('controllerchange', () => resolve(), { once: true })
      })

      // Wait for the active SW to finish any in-progress work
      const registration = await sw.ready
      await registration.active?.postMessage('ping') // flush message queue
    })

    // Go offline
    await context.setOffline(true)

    // Reload should serve from cache
    await page.reload().catch(() => {})

    const loginEmail = page.getByTestId('auth-login-email')
    await expect(loginEmail).toBeVisible({ timeout: 10000 })
  })
})
