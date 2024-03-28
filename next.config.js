/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost', 'fastly.picsum.photos', 'picsum.photos'],
        remotePatterns: [
            {
                hostname: 'picsum.photos',
                protocol: 'https',
                pathname: '/(.*)',
                port: "443",
            }
        ],
    },
}

module.exports = nextConfig
