/**
 * Test User Helpers
 *
 * Utilities for handling test user authentication and session management
 */

export const testUser = {
  email: process.env.TEST_USER_EMAIL || 'dhurlss99@gmail.com',
  // Add other test user properties as needed
};

/**
 * Mock authentication for testing
 * Since the app uses Privy, you may need to:
 * 1. Mock the Privy provider
 * 2. Use a test wallet
 * 3. Or bypass auth in test mode
 */
export async function mockAuthSession(page: any) {
  // TODO: Implement authentication mocking
  // This will depend on how Privy handles test environments
  console.log('Mocking auth for user:', testUser.email);
}

/**
 * Wait for AI response with timeout
 */
export async function waitForAIResponse(page: any, timeout = 30000) {
  await page.waitForSelector('text=/Evaluating your answer|Perfect!|Almost!|Try again/', {
    timeout,
  });
}

/**
 * Simulate voice input (for testing without actual voice)
 * This dispatches a custom event that your app can listen to in test mode
 */
export async function simulateVoiceInput(page: any, transcript: string) {
  await page.evaluate((text: string) => {
    window.dispatchEvent(
      new CustomEvent('test-voice-submit', {
        detail: { transcript: text },
      })
    );
  }, transcript);
}
