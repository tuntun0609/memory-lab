import type { NextConfig } from 'next'
import ESLintPlugin from 'eslint-webpack-plugin'
const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new ESLintPlugin({
          extensions: ['js', 'jsx', 'ts', 'tsx'],
          exclude: ['node_modules', '.next', 'out'],
          failOnError: false,
        })
      )
    }

    return config
  },
}

export default nextConfig
