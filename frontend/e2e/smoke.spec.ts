import { test, expect } from '@playwright/test';

const student = { email: 'student@example.com', password: 'P@ssw0rd!' };

// Helper to login once per test
async function login(page) {
  // Mock backend endpoints so dashboard stays stable without the API server
  await page.route('**/api/**', (route) => {
    const url = route.request().url();
    const json = (data: any) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(data) });

    if (url.includes('/users/me') || url.includes('/auth/me')) {
      return json({ user: { id: 'e2e-user', name: 'E2E Student', email: student.email, role: 'student', preferences: { emailNotifications: true, darkMode: true } } });
    }
    if (url.includes('/resume/me')) {
      return json({ resume: { summary: '', experience: [], education: [], skills: [], projects: [], contact: '' } });
    }
    if (url.includes('/achievements')) {
      return json({ level: 1, xp: 0, maxXp: 1000, badges: [] });
    }
    if (url.includes('/user-assessments/me')) {
      return json({ assessments: [] });
    }
    if (url.includes('/applications/me')) {
      return json({ applications: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } });
    }
    if (url.includes('/interviews/sessions')) {
      return json({ sessions: [] });
    }
    if (url.includes('/career/roadmap')) {
      return json({ roadmap: [] });
    }
    if (url.includes('/jobs')) {
      return json({ jobs: [] });
    }
    if (url.includes('/notifications')) {
      return json({ notifications: [], unreadCount: 0, pagination: { page: 1, limit: 10, total: 0, pages: 0 } });
    }

    return json({});
  });

  await page.goto('/login');
  await page.getByLabel('Email Address').fill(student.email);
  await page.locator('#login-password').fill(student.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  // If backend is unreachable in CI, seed auth locally and reload dashboard
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    localStorage.setItem('authToken', 'e2e-test-token');
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userName', 'E2E Student');
    localStorage.setItem('userEmail', 'student@example.com');
    localStorage.setItem('userRole', 'student');
  });
  await page.goto('/dashboard');
  await page.waitForLoadState('domcontentloaded');
  if (page.url().includes('/login')) {
    await page.evaluate(() => {
      localStorage.setItem('authToken', 'e2e-test-token');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userName', 'E2E Student');
      localStorage.setItem('userEmail', 'student@example.com');
      localStorage.setItem('userRole', 'student');
    });
    await page.goto('/dashboard');
  }
  await page.waitForURL('**/dashboard');
  await page.waitForSelector('text=Resume Builder', { timeout: 20000 });
}

test('dashboard smoke: resume → assessment → coding', async ({ page }) => {
  await login(page);

  // Resume save (minimal)
  await page.getByRole('button', { name: /resume builder/i }).first().click({ force: true });
  // Fallback selector: any textarea on resume page
  await page.locator('textarea').first().fill('Motivated student seeking growth.');
  await page.getByRole('button', { name: /save/i }).first().click();

  // Assessments list
  await page.getByRole('button', { name: /skill tests/i }).click();
  const startButtons = page.getByRole('button', { name: /start/i });
  const count = await startButtons.count();
  if (count > 0) {
    await startButtons.first().click({ force: true });
  }

  // Coding challenges: run failing then passing code
  await page.getByRole('button', { name: /coding challenges/i }).first().click();
  await page.getByRole('button', { name: /run tests/i }).click();
  await expect(page.getByText('Results')).toBeVisible();

  const editor = page.locator('textarea');
  await editor.fill(`function twoSum(nums, target){const m=new Map();for(let i=0;i<nums.length;i++){const c=target-nums[i];if(m.has(c))return [m.get(c),i];m.set(nums[i],i);}return [];}`);
  await page.getByRole('button', { name: /run tests/i }).click();
  await expect(page.getByText('Test A')).toBeVisible();
});

test('protected routes require auth', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/login/);
});
