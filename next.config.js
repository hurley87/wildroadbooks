/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Ignore Solana-related optional dependencies from Privy SDK
    // We only use EVM (Base) wallets, so Solana modules are not needed
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@solana-program/system': false,
      '@solana-program/token': false,
      '@solana-program/memo': false,
      '@solana-program/compute-budget': false,
      '@solana-program/token-2022': false,
      '@solana/web3.js': false,
    };
    return config;
  },
};

module.exports = nextConfig; 