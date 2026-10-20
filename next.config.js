/** @type {import('next').NextConfig} */
const nextConfig = {
  // Пропускаем ESLint при сборке если установлена переменная
  eslint: {
    ignoreDuringBuilds: process.env.ESLINT_IGNORE === 'true',
  },
  // Standalone build для деплоя на собственный сервер
  output: 'standalone',
  
  // Оптимизация изображений
  images: {
    unoptimized: false,
    domains: [], // Добавить домены для внешних изображений если нужно
  },
  
  // Компрессия
  compress: true,
  
  // Powerd by Next.js убираем для безопасности
  poweredByHeader: false,
  
  // Генерация sitemap и robots.txt
  async rewrites() {
    return [
      // Можно добавить внутренние перенаправления если нужно
    ];
  },
  
  // Настройки для production
  env: {
    CUSTOM_BUILD_ID: process.env.CI_PIPELINE_ID || 'local',
  },
  
  // Турбо настройки (Turbopack стабилен в Next.js 15)
  turbopack: {
    rules: {
      // Правила для турбо-сборки если нужны
    }
  }
}

module.exports = nextConfig