/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        transpilePackages: ['@lina/types'],
    },
};

module.exports = nextConfig;
