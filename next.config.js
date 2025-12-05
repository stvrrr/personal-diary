/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['lh3.googleusercontent.com', 'cdn.discordapp.com'], // For OAuth profile pictures
  },
  env: {
    NEXT_PUBLIC_OWNER_EMAIL: process.env.OWNER_EMAIL,
  },
};

module.exports = nextConfig;
