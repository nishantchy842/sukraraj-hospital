/** @type {import('next').NextConfig} */

const nextConfig = {
   // reactStrictMode: false,
   publicRuntimeConfig: {
      NEXT_PUBLIC_BASE_API: 'http://45.115.217.88:3009/api/v1/',
      // NEXT_PUBLIC_BASE_API: 'http://202.51.74.227:3030/api/v1/',
      NEXT_PUBLIC_BASE_IMAGE_PATH: 'http://45.115.217.88:3009/',
      // NEXT_PUBLIC_BASE_IMAGE_PATH: 'http://202.51.74.227:3030/',
   },

   env: {
      BASE_API: 'http://45.115.217.88:3009/api/v1/',
      // BASE_API: 'http://202.51.74.227:3030/api/v1/',
      BASE_IMAGE_PATH: 'http://45.115.217.88:3009/',
      // BASE_IMAGE_PATH: 'http://202.51.74.227:3030/',
   },

   images: {
      remotePatterns: [
         {
            protocol: 'http',
            hostname: '192.168.1.99',
            port: '5000',
            pathname: '/upload/image/**',
         },
         {
            protocol: 'http',
            hostname: '202.51.74.227',
            port: '3030',
         },
         {
            protocol: 'http',
            hostname: '45.115.217.88',
            port: '3009',
         },
      ],
   },
};

export default nextConfig;
