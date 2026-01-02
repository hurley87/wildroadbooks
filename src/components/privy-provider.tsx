'use client';

import { PrivyProvider as PrivyProviderBase } from '@privy-io/react-auth';
import { base } from 'viem/chains';
import type { ReactNode } from 'react';

interface PrivyProviderProps {
  children: ReactNode;
}

/**
 * PrivyProvider wrapper component that configures Privy authentication
 * with email-only login and embedded Base wallets.
 */
export function PrivyProvider({ children }: PrivyProviderProps) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!appId) {
    console.warn(
      'NEXT_PUBLIC_PRIVY_APP_ID is not set. Please add it to your .env.local file.'
    );
    // Return children without Privy provider if app ID is missing
    // This allows the app to still work during development
    return <>{children}</>;
  }

  return (
    <PrivyProviderBase
      appId={appId}
      config={{
        // Email-only authentication
        loginMethods: ['email'],
        
        // Embedded wallet configuration
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets',
          },
        },
        
        // Base chain configuration
        defaultChain: base,
        supportedChains: [base],
        
        // Appearance customization
        appearance: {
          theme: 'light',
          accentColor: '#0f766e', // emerald-700
          logo: '/WildRoadColophon.png',
        },
      }}
    >
      {children}
    </PrivyProviderBase>
  );
}

