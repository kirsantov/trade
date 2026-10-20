module.exports = {
  apps: [{
    // Основное приложение
    name: 'single-window',
    script: './.next/standalone/server.js',
    cwd: '/var/www/tradekg',
    instances: 2, // Кластерный режим для производительности
    exec_mode: 'cluster',
    
    // Переменные окружения
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
      HOSTNAME: 'localhost',
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      HOSTNAME: '0.0.0.0',
      // Email настройки для production
      SMTP_HOST: 'smtp.gmail.com',
      SMTP_PORT: 587,
      SMTP_USER: process.env.SMTP_USER || '',
      SMTP_PASS: process.env.SMTP_PASS || '',
      // Firebase настройки
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
    },
    
    // Логирование
    log_file: '/var/log/pm2/single-window.log',
    out_file: '/var/log/pm2/single-window-out.log',
    error_file: '/var/log/pm2/single-window-error.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    
    // Мониторинг и автоперезапуск
    watch: false, // В production не нужно
    ignore_watch: ['node_modules', '.next/cache'],
    max_memory_restart: '500M',
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 10000,
    
    // Автоперезапуск при краше
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Дополнительные настройки
    merge_logs: true,
    time: true,
    
    // Health check
    health_check_grace_period: 3000,
  }],
  
  // Настройки деплоя (опционально, если используется pm2 deploy)
  deploy: {
    production: {
      user: 'deploy',
      host: 'your-server.com',
      ref: 'origin/release',
      repo: 'https://gitlab.your-domain.com/trade/nextjs.git',
      path: '/var/www/tradekg',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      env: {
        NODE_ENV: 'production'
      }
    }
  }
};