/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Temporarily ignore ESLint during builds
  },
  env: {
    OLLAMA_URL: process.env.OLLAMA_URL,
    SELECTED_MODEL: process.env.SELECTED_MODEL,
    TOPMEDIAI_API_KEY: process.env.TOPMEDIAI_API_KEY,
    TOPMEDIAI_VOICE_ID: process.env.TOPMEDIAI_VOICE_ID,
  },
}

module.exports = nextConfig 