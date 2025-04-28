/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ["booktree-s3-bucket.s3.ap-northeast-2.amazonaws.com"],
  },

  eslint: {
    // 빌드 중에 ESLint 검사를 건너뜁니다
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
