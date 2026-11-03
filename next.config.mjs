/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Отключаем отслеживание системных папок Windows, чтобы избежать ошибки EINVAL
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ['D:\\System Volume Information', '**/node_modules/**']
      };
    }
    return config;
  },
};

export default nextConfig;
