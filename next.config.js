/** @type {import('next').NextConfig} */
const nextConfig = {
    //output: 'export',
    //uncomment ^ to make the site static
    reactStrictMode: true,
    images: {
        unoptimized: true,
    },
    trailingSlash: true,
}

module.exports = nextConfig

//This makes it a static site