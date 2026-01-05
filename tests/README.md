# E2E Tests with Playwright

This directory contains end-to-end tests for the Wild Road Books application using Playwright.

## Setup

All dependencies are already installed. Test user is configured as `dhurlss99@gmail.com` in `.env.local`.

## Running Tests

```bash
# Run all tests (headless)
yarn test

# Run tests with UI mode (recommended for development)
yarn test:ui

# Run tests in headed mode (see browser)
yarn test:headed

# Debug tests step-by-step
yarn test:debug

# View last test report
yarn test:report
```

## Test Structure

```
tests/
├── game.spec.ts           # Game interface tests
├── helpers/
│   └── test-user.ts       # Test user utilities and auth helpers
└── README.md              # This file
```

## Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/path');
    // Your test code
  });
});
```

### Using Test Helpers

```typescript
import { testUser, simulateVoiceInput } from './helpers/test-user';

test('should use test user', async ({ page }) => {
  console.log('Testing with:', testUser.email);

  // Simulate voice input (for game testing)
  await simulateVoiceInput(page, 'My answer here');
});
```

## Current Tests

### Game Interface Tests (`game.spec.ts`)

1. **Intro Screen** - Verifies Begin button and intro text
2. **Start Game** - Tests game initialization and first question
3. **Feedback Display** - Verifies Continue button and feedback card
4. **Continue Flow** - Tests clicking Continue after feedback
5. **Scrollable Feedback** - Ensures long feedback can scroll
6. **Completion Screen** - Tests final score display
7. **XP & Streak Tracking** - Verifies game state during play
8. **Authentication** - Checks auth requirements
9. **Visual Tests** - Animation and responsive layout

## Authentication in Tests

Tests run with **authentication bypass** enabled:

- `NEXT_PUBLIC_TEST_MODE=true` is automatically set when running Playwright tests
- This bypasses Privy email verification flow
- Test user ID is set to `TEST_USER_EMAIL` from `.env.local` (`dhurlss99@gmail.com`)
- No email verification codes needed! ✅

### How It Works

1. `playwright.config.ts` sets `NEXT_PUBLIC_TEST_MODE=true` in the dev server
2. `AuthGate` component detects test mode and skips Privy authentication
3. Game API accepts test user email directly without Bearer token
4. Tests can freely navigate to `/game` without auth flow

### Manual Testing (without test mode)

To test with real Privy authentication:
```bash
# Start dev server normally (without test mode)
yarn dev

# In another terminal, open Playwright UI
npx playwright test --ui

# You'll need to manually enter the email verification code
```

## Known Limitations

- **Voice Input**: Tests currently use a custom event (`test-voice-submit`) to simulate voice input. Real Web Speech API testing requires browser permissions.
- **AI Responses**: Tests depend on actual AI responses, which can be slow (30s timeout).

## Test Configuration

See `playwright.config.ts` for full configuration including:
- Base URL: `http://localhost:3000`
- Browsers: Chrome, Firefox, Safari, Mobile (Pixel 5, iPhone 12)
- Auto-starts dev server
- Screenshots/videos on failure
- Traces on retry

## Debugging Tips

1. **Use UI Mode** (`yarn test:ui`) - Best for development, shows live browser and test steps
2. **Use Debug Mode** (`yarn test:debug`) - Step through tests line by line
3. **Check Screenshots** - Saved in `test-results/` on failure
4. **View Traces** - Use `yarn test:report` to see detailed execution traces

## CI/CD Integration

Tests are configured to run in CI with:
- 2 retries on failure
- Single worker (no parallel execution)
- HTML report generation

Add to your CI pipeline:
```yaml
- name: Install dependencies
  run: yarn install

- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run tests
  run: yarn test

- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

## Environment Variables

Tests have access to all environment variables in `.env.local`:
- `TEST_USER_EMAIL` - Test user email address
- `NEXT_PUBLIC_PRIVY_APP_ID` - Privy app ID for auth testing
- All API keys (Supabase, Google, Cohere)
