import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Otimizações de performance
  reactStrictMode: true,
  
  // Otimização de imagens externas
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'waystdio.com',
      },
    ],
    // Formatos modernos para melhor compressão
    formats: ['image/avif', 'image/webp'],
  },
  
  // Compressão de output
  compress: true,
  
  // Otimização de pacotes grandes
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
};

export default nextConfig;
