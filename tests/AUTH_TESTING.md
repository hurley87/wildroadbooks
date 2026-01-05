# Authentication Testing Guide

## Problem: Email Verification Codes

When testing with Privy authentication, you need to enter a verification code sent to your email (`dhurlss99@gmail.com`), which blocks automated testing.

## ✅ Solution: Test Mode Bypass (IMPLEMENTED)

The test suite now automatically bypasses authentication using `NEXT_PUBLIC_TEST_MODE=true`.

### What Was Changed

1. **AuthGate Component** (`src/components/auth-gate.tsx`)
   - Detects `NEXT_PUBLIC_TEST_MODE` environment variable
   - Skips Privy authentication when true
   - Renders protected content immediately

2. **Game API** (`src/app/api/game/route.ts`)
   - Accepts test mode requests without Bearer token
   - Uses `TEST_USER_EMAIL` as the user ID in test mode
   - Still requires auth in production

3. **Playwright Config** (`playwright.config.ts`)
   - Automatically sets `NEXT_PUBLIC_TEST_MODE=true` for dev server
   - No manual configuration needed

### Usage

**Automated Tests** (auth bypass enabled):
```bash
yarn test:ui    # Tests run without auth - no email codes needed!
```

**Manual Testing** (real auth flow):
```bash
# Terminal 1: Start dev without test mode
yarn dev

# Terminal 2: Run specific test
npx playwright test game.spec.ts --headed

# You'll see the real Privy auth flow and can enter verification codes
```

## Alternative Solutions (Not Implemented)

### Option 2: Email API Integration

Use a service like [Mailinator](https://www.mailinator.com/), [Mailtrap](https://mailtrap.io/), or [EmailJS](https://www.emailjs.com/) that provides API access to test emails.

**Pros:**
- Tests real authentication flow
- Catches auth-related bugs

**Cons:**
- Requires additional service setup
- Costs money for most services
- Adds test complexity
- Slower test execution

**Example with Mailinator:**
```typescript
import { test } from '@playwright/test';
import axios from 'axios';

async function getVerificationCode(email: string): Promise<string> {
  // Wait for email to arrive
  await page.waitForTimeout(5000);

  // Fetch latest email from Mailinator API
  const inbox = await axios.get(
    `https://mailinator.com/api/v2/domains/mailinator.com/inboxes/${email}`,
    { headers: { 'Authorization': process.env.MAILINATOR_API_KEY } }
  );

  // Parse verification code from email
  const latestEmail = inbox.data.msgs[0];
  const emailContent = await axios.get(
    `https://mailinator.com/api/v2/domains/mailinator.com/messages/${latestEmail.id}`
  );

  // Extract code with regex
  const codeMatch = emailContent.data.text.match(/code is (\d{6})/);
  return codeMatch[1];
}

test('login with real auth', async ({ page }) => {
  await page.goto('/game');
  await page.fill('input[type="email"]', 'test@mailinator.com');
  await page.click('button:has-text("Sign In")');

  const code = await getVerificationCode('test');
  await page.fill('input[placeholder="Enter code"]', code);
  await page.click('button:has-text("Verify")');
});
```

### Option 3: Privy Test Mode

Check if Privy offers a test mode or sandbox environment:

1. Visit [Privy Documentation](https://docs.privy.io/)
2. Look for "Testing" or "Sandbox" sections
3. May provide test accounts or bypass mechanisms

### Option 4: Mock Privy SDK

Intercept Privy API calls and mock responses:

```typescript
// In playwright.config.ts
use: {
  baseURL: 'http://localhost:3000',

  // Mock Privy API responses
  serviceWorkers: 'block',

  // Or use route interception
}

// In test file
test('mock privy auth', async ({ page, context }) => {
  // Intercept Privy API calls
  await context.route('**/privy.io/api/**', async (route) => {
    if (route.request().url().includes('/auth/login')) {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({
          user: { id: 'test-user-123', email: 'dhurlss99@gmail.com' },
          token: 'mock-jwt-token'
        })
      });
    }
  });

  await page.goto('/game');
});
```

**Pros:**
- Tests run quickly
- No external dependencies

**Cons:**
- Complex to maintain
- May break with Privy SDK updates
- Doesn't test real auth flow

## Recommendation

**Use the implemented Test Mode bypass** for:
- ✅ Fast E2E testing
- ✅ CI/CD pipelines
- ✅ Local development iteration

**Use real authentication** for:
- Integration testing before production
- Verifying auth flow changes
- Manual QA testing

## Security Note

⚠️ **IMPORTANT**: The test mode bypass is **only enabled** when `NEXT_PUBLIC_TEST_MODE=true` is set.

**In production:**
- This variable should NEVER be set
- All requests will require valid Privy authentication
- Test bypass code paths are unreachable

**Best practice:** Add a check in your deployment pipeline to ensure `NEXT_PUBLIC_TEST_MODE` is not set in production builds.
