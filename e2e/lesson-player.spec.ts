import { test, expect } from '@playwright/test';

test.describe('Lesson Player E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
  });

  test('should complete lesson flow: courses -> course -> lesson -> steps -> result', async ({ page }) => {
    // Navigate to courses page
    await page.goto('/courses');
    await expect(page).toHaveURL('/courses');

    // Wait for courses to load
    await expect(page.getByRole('heading', { name: /english learning hub/i })).toBeVisible();

    // Find and click demo course
    const demoCourseLink = page.getByRole('link', { name: /present simple basics/i });
    await expect(demoCourseLink).toBeVisible();
    await demoCourseLink.click();

    // Should be on course detail page
    await expect(page).toHaveURL(/\/courses\/present-simple-basics/);
    await expect(page.getByRole('heading', { name: /present simple basics/i })).toBeVisible();

    // Find and click first lesson
    const firstLessonButton = page.getByRole('button', { name: /start lesson/i }).first();
    await expect(firstLessonButton).toBeVisible();
    await firstLessonButton.click();

    // Should be on lesson page
    await expect(page).toHaveURL(/\/courses\/present-simple-basics\/lessons\/daily-routines/);
    await expect(page.getByRole('heading', { name: /daily routines/i })).toBeVisible();

    // Wait for lesson player to load
    await expect(page.getByText(/step 1 of/i)).toBeVisible();

    // Complete first text step (just click Next)
    const nextButton = page.getByRole('button', { name: /^next/i });
    await expect(nextButton).toBeVisible();
    await nextButton.click();

    // Should be on step 2
    await expect(page.getByText(/step 2 of/i)).toBeVisible();

    // Find and complete a single_choice step if available
    // Look for question text
    const questionText = page.getByText(/which sentence is correct/i);
    if (await questionText.isVisible().catch(() => false)) {
      // Select an option
      const option = page.getByText(/i go to school/i);
      await expect(option).toBeVisible();
      await option.click();

      // Check button should be enabled
      const checkButton = page.getByRole('button', { name: /check/i });
      await expect(checkButton).toBeEnabled();
      await checkButton.click();

      // Should show feedback
      await expect(page.getByText(/correct|incorrect/i)).toBeVisible({ timeout: 2000 });

      // Continue to next step
      await nextButton.click();
    }

    // Find and complete a fill_blank step if available
    const fillBlankInput = page.getByPlaceholder('?');
    if (await fillBlankInput.isVisible().catch(() => false)) {
      await fillBlankInput.fill('go');
      
      const checkButton = page.getByRole('button', { name: /check/i });
      await expect(checkButton).toBeEnabled();
      await checkButton.click();

      await expect(page.getByText(/correct|incorrect/i)).toBeVisible({ timeout: 2000 });
    }

    // Navigate through remaining steps to finish
    // Keep clicking Next until we see Finish button or result screen
    let attempts = 0;
    const maxAttempts = 20; // Safety limit

    while (attempts < maxAttempts) {
      const finishButton = page.getByRole('button', { name: /finish/i });
      const resultScreen = page.getByText(/lesson complete|score|result/i);

      if (await finishButton.isVisible().catch(() => false)) {
        await finishButton.click();
        break;
      }

      if (await resultScreen.isVisible().catch(() => false)) {
        break;
      }

      const nextBtn = page.getByRole('button', { name: /^next/i });
      if (await nextBtn.isEnabled().catch(() => false)) {
        await nextBtn.click();
        await page.waitForTimeout(500); // Wait for step transition
      } else {
        // If Next is disabled, might need to check first
        const checkBtn = page.getByRole('button', { name: /check/i });
        if (await checkBtn.isEnabled().catch(() => false)) {
          await checkBtn.click();
          await page.waitForTimeout(500);
        } else {
          break; // Can't proceed
        }
      }

      attempts++;
    }

    // Should see result screen
    await expect(
      page.getByText(/lesson complete|score|correct|incorrect/i)
    ).toBeVisible({ timeout: 5000 });
  });

  test('should persist progress and show resume prompt on reload', async ({ page }) => {
    // Navigate to lesson
    await page.goto('/courses');
    await page.getByRole('link', { name: /present simple basics/i }).click();
    await page.getByRole('button', { name: /start lesson/i }).first().click();

    // Wait for lesson to load
    await expect(page.getByText(/step 1 of/i)).toBeVisible();

    // Navigate to step 2
    await page.getByRole('button', { name: /^next/i }).click();
    await expect(page.getByText(/step 2 of/i)).toBeVisible();

    // Answer a question if it's interactive
    const questionText = page.getByText(/which sentence is correct/i);
    if (await questionText.isVisible().catch(() => false)) {
      await page.getByText(/i go to school/i).click();
      await page.getByRole('button', { name: /check/i }).click();
      await page.waitForTimeout(500);
    }

    // Wait for auto-save before reload
    await page.waitForTimeout(600);

    // Reload page
    await page.reload();

    // Should see resume prompt or continue from saved progress
    await expect(page.getByText(/saved progress|step 2 of/i)).toBeVisible({ timeout: 5000 });
  });

  test('should show result screen after completing lesson', async ({ page }) => {
    // Navigate to lesson
    await page.goto('/courses');
    await page.getByRole('link', { name: /present simple basics/i }).click();
    await page.getByRole('button', { name: /start lesson/i }).first().click();

    // Wait for lesson to load
    await expect(page.getByText(/step 1 of/i)).toBeVisible();

    // Complete all steps
    let stepCount = 0;
    const maxSteps = 20; // Safety limit

    while (stepCount < maxSteps) {
      // Check if we're on result screen
      const resultScreen = page.getByText(/lesson complete|score|total|percent/i);
      if (await resultScreen.isVisible().catch(() => false)) {
        break;
      }

      const finishButton = page.getByRole('button', { name: /finish/i });
      if (await finishButton.isVisible().catch(() => false) && await finishButton.isEnabled().catch(() => false)) {
        await finishButton.click();
        await page.waitForTimeout(500);
        break;
      }

      // Check if there's an interactive step that needs answering
      const fillBlankInput = page.getByPlaceholder('?');
      const optionButton = page.locator('.space-y-2 button').first();
      const checkButton = page.getByRole('button', { name: /check/i });

      if (await fillBlankInput.isVisible().catch(() => false)) {
        await fillBlankInput.fill('go');
        await page.waitForTimeout(100);
        if (await checkButton.isEnabled().catch(() => false)) {
          await checkButton.click();
          await page.waitForTimeout(200);
        }
      } else if (await optionButton.isVisible().catch(() => false)) {
        await optionButton.click();
        await page.waitForTimeout(100);
        if (await checkButton.isEnabled().catch(() => false)) {
          await checkButton.click();
          await page.waitForTimeout(200);
        }
      }

      // Check finish again after checking
      if (await finishButton.isVisible().catch(() => false) && await finishButton.isEnabled().catch(() => false)) {
        await finishButton.click();
        await page.waitForTimeout(500);
        break;
      }

      // Try to go to next step
      const nextButton = page.getByRole('button', { name: /^next/i });
      if (await nextButton.isEnabled().catch(() => false)) {
        await nextButton.click();
        await page.waitForTimeout(300);
      }

      stepCount++;
    }

    // Should see result screen
    await expect(
      page.getByText('Lesson Complete 🎉')
    ).toBeVisible({ timeout: 5000 });
  });
});

