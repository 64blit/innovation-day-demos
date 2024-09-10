/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    verbose: true,
    experimental: {
        turbotrace: {
            // control the log level of the turbotrace, default is `error`
            logLevel: 'info',
        },
    },
    // Add prerender options
    prerender: {
        // Add prerendering configuration here
    },
}

export default nextConfig;
