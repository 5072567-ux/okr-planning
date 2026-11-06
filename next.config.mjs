/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.watchOptions = {
        ignored: [
          '**/node_modules/**',
          '**/.git/**',
          '**/.next/**',
          'D:\\System Volume Information',
          'D:\\$RECYCLE.BIN',
          'D:\\pagefile.sys',
          'D:\\swapfile.sys'
        ]
      };
    }
    return config;
  },
};

export default nextConfig;
