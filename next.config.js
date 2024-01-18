/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
    dest: "public",
    runtimeCaching: {
        disable: true
    }
});

const nextConfig = {
    images: {
        domains: ['cdn.weatherapi.com'],
    }
}

module.exports = withPWA(nextConfig)