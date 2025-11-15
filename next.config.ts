import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";


const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Cách cũ (đơn giản):
    // domains: ["images.unsplash.com", "assets.aceternity.com", "learnary-courses.s3.ap-southeast-2.amazonaws.com"],

    // Cách mới (khuyên dùng, bảo mật hơn):
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
      {
        protocol: 'https',
        hostname: 'learnary-courses.s3.ap-southeast-2.amazonaws.com',
        port: '',
        pathname: '/**', // Cho phép tất cả đường dẫn con từ S3 bucket này
      },
      // Thêm các domain khác nếu cần (ví dụ avatar Google)
      // { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
  // không cần khai báo i18n này nữa vì App Router của NextJS 13+ đã có cách xử lý đa ngô ngữ i18n mới, không cần cấu hình trong này như Pages Router nữa.
  // i18n: {
  //   locales:['en','vi'],
  //   defaultLocale:'vi',
  // } 
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Sửa port 8000 và prefix /api/v1 cho đúng với Backend của bạn
        destination: 'http://localhost:4000/api/v1/:path*', 
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
