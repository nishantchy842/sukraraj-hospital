import nextConfig from '@/next.config.mjs';

const { publicRuntimeConfig, env } = nextConfig;
const { NEXT_PUBLIC_BASE_API } = publicRuntimeConfig;
export const BASE_URL = NEXT_PUBLIC_BASE_API;
export const BASE_IMAGE_URL = env.BASE_IMAGE_PATH;
