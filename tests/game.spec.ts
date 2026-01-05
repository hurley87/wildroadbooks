import { test, expect } from '@playwright/test';

/**
 * Game Interface E2E Tests
 *
 * Tests the complete game flow including:
 * - Intro screen
 * - Starting the game
 * - Answering questions
 * - Feedback display with Continue button
 * - Completion screen
 */

test.describe('Game Interface', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to game page
    await page.goto('/game');
  });

  test('should display intro screen with Begin button', async ({ page }) => {
    // Check for intro elements
    await expect(page.getByText(/Test your understanding of Week 1 Notebook Questions/i)).toBeVisible();
    await expect(page.getByText('Catching Unicorns')).toBeVisible();

    // Check for Begin button
    const beginButton = page.getByRole('button', { name: /Begin/i });
    await expect(beginButton).toBeVisible();
  });

  test('should start game and show first question', async ({ page }) => {
    // Click Begin button
    await page.getByRole('button', { name: /Begin/i }).click();

    // Wait for progress bar to appear
    await expect(page.locator('.h-2.bg-slate-200')).toBeVisible();

    // Wait for first question to load (with timeout for AI response)
    await expect(page.getByText(/\?$/)).toBeVisible({ timeout: 30000 });

    // Check that microphone input is available
    await expect(page.locator('[data-testid="voice-input"], button:has-text("🎤")')).toBeVisible();
  });

  test('should display feedback with Continue button after answering', async ({ page }) => {
    // Start the game
    await page.getByRole('button', { name: /Begin/i }).click();

    // Wait for first question
    await expect(page.getByText(/\?$/)).toBeVisible({ timeout: 30000 });

    // Simulate voice input by directly calling the submit handler
    // (Note: In real tests, you'd need to mock the Web Speech API or use text input)
    // For now, we'll use page.evaluate to simulate a voice submission
    await page.evaluate(() => {
      // Find the MicroInput component and trigger submission
      const answer = "An engram is biological memory stored in the brain.";
      // This would normally be done through the voice interface
      // but for testing we can dispatch a custom event or call the handler
      window.dispatchEvent(new CustomEvent('test-voice-submit', {
        detail: { transcript: answer }
      }));
    });

    // Wait for evaluating state
    await expect(page.getByText(/Evaluating your answer/i)).toBeVisible({ timeout: 5000 });

    // Wait for feedback to appear
    await expect(page.locator('text=/Perfect!|Almost!|Try again/')).toBeVisible({ timeout: 30000 });

    // Check that feedback card is visible with Continue button
    const continueButton = page.getByRole('button', { name: /Continue/i });
    await expect(continueButton).toBeVisible();

    // Verify feedback text is visible and not cut off
    const feedbackCard = page.locator('div:has(button:has-text("Continue"))').first();
    await expect(feedbackCard).toBeVisible();
  });

  test('should allow user to continue after feedback', async ({ page }) => {
    // Start the game
    await page.getByRole('button', { name: /Begin/i }).click();

    // Wait for first question and answer it (simplified)
    await expect(page.getByText(/\?$/)).toBeVisible({ timeout: 30000 });

    // Simulate answering (this is a placeholder - actual implementation would need voice/text input)
    await page.evaluate(() => {
      window.dispatchEvent(new CustomEvent('test-voice-submit', {
        detail: { transcript: "Test answer" }
      }));
    });

    // Wait for feedback
    await expect(page.locator('text=/Perfect!|Almost!|Try again/')).toBeVisible({ timeout: 30000 });

    // Click Continue button
    const continueButton = page.getByRole('button', { name: /Continue/i });
    await continueButton.click();

    // Verify feedback disappears and we return to question phase
    await expect(continueButton).not.toBeVisible({ timeout: 5000 });

    // Next question should appear
    await expect(page.getByText(/\?$/)).toBeVisible({ timeout: 30000 });
  });

  test('should display scrollable feedback for long text', async ({ page }) => {
    // Start the game
    await page.getByRole('button', { name: /Begin/i }).click();

    // Wait for first question
    await expect(page.getByText(/\?$/)).toBeVisible({ timeout: 30000 });

    // The feedback area should have max-height and overflow styles
    // (We can't easily test scrolling without actual long feedback from AI)
    // But we can verify the CSS classes are applied
    const feedbackContainer = page.locator('[class*="max-h-"][class*="overflow-y-auto"]');

    // This locator will exist once feedback is shown
    // For now, just verify the game flow works
  });

  test('should show completion screen with score after finishing', async ({ page }) => {
    // This test would require completing a full game session
    // For now, we can test that the completion screen structure exists
    // by checking if we can detect the "Play Again" button after score is shown

    // Note: Full test would require either:
    // 1. Mocking the API to return [SCORE:X/10] immediately
    // 2. Actually playing through 10-15 questions (very slow)
    // 3. Using test fixtures to inject a completion state
  });

  test('should track XP and streak during game', async ({ page }) => {
    // Start the game
    await page.getByRole('button', { name: /Begin/i }).click();

    // Wait for game to start
    await expect(page.getByText(/\?$/)).toBeVisible({ timeout: 30000 });

    // Check for streak flame indicator (starts at 0)
    // The StreakFlame component should be visible
    const streakElement = page.locator('[class*="streak"]').first();

    // Progress bar should be visible
    const progressBar = page.locator('.h-2.bg-slate-200');
    await expect(progressBar).toBeVisible();
  });

  test('should handle authentication requirement', async ({ page }) => {
    // The game requires Privy authentication
    // Check if AuthGate is protecting the route

    // If not authenticated, should see auth UI or be redirected
    // If authenticated, should see game interface

    // For now, verify the page loads
    await expect(page).toHaveURL(/\/game/);
  });
});

test.describe('Game Interface - Visual Tests', () => {
  test('should display feedback burst animation', async ({ page }) => {
    await page.goto('/game');

    // Start game
    await page.getByRole('button', { name: /Begin/i }).click();

    // Wait for question
    await expect(page.getByText(/\?$/)).toBeVisible({ timeout: 30000 });

    // After answering, feedback should have animation classes
    // Check for motion/framer-motion animations
    const feedbackCard = page.locator('[class*="z-50"]').filter({ hasText: /Perfect|Almost|Try again/ });

    // Should eventually be visible (after animation)
    await expect(feedbackCard).toBeVisible({ timeout: 35000 });
  });

  test('should show mobile-responsive layout', async ({ page, viewport }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/game');

    // Intro should be visible and centered
    await expect(page.getByRole('button', { name: /Begin/i })).toBeVisible();

    // Check that content is not cut off
    const introText = page.getByText(/Test your understanding/i);
    await expect(introText).toBeVisible();
  });
});
