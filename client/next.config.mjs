/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // Disable ESLint during production builds
        ignoreDuringBuilds: true,
    },
    typescript: {
        // Disable type checking during production builds
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
