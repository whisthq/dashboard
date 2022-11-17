// next.config.mjs

/**
 * Next.js configuration.
 */

/**
 * @type {import('next').NextConfig}
 */
const config = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
}

export default config
