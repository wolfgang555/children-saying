/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // 移除这些配置，因为在静态导出模式下不需要
  // basePath: '',
  // trailingSlash: true,
}

module.exports = nextConfig
