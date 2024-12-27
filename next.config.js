/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  // 配置允许的图片域名（如果需要的话）
  images: {
    domains: [],
  },
}

module.exports = nextConfig
