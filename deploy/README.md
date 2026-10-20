# GitLab CI/CD для Single Window

Этот набор файлов настраивает автоматический деплой Next.js приложения на Ubuntu сервер через GitLab CI/CD.

## Структура файлов

```
deploy/
├── README.md              # Данная документация
├── ecosystem.config.js    # Конфигурация PM2
├── nginx.conf            # Конфигурация nginx
└── deploy.sh             # Скрипт деплоя
```

## Настройка GitLab CI/CD

### 1. GitLab Variables (Settings → CI/CD → Variables)

Добавьте следующие переменные:

```bash
# Сервер деплоя
PRODUCTION_SERVER=your-server.trade.kg
PRODUCTION_USER=deploy

# SSH ключ для доступа к серверу (private key)
SSH_PRIVATE_KEY=-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----

# Email настройки (для nodemailer)
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Firebase настройки (для Google Analytics)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCtbYoCB8fczCrOMEl9HXJ68bptgEfWZls
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=tradekg-3f266.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tradekg-3f266
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=tradekg-3f266.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=390237362590
NEXT_PUBLIC_FIREBASE_APP_ID=1:390237362590:web:13cba6dc02920b2e089e8f
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-QT2H4G2N49
```

### 2. Настройка сервера

#### Создание пользователя деплоя:
```bash
sudo adduser deploy
sudo usermod -aG sudo deploy
sudo mkdir -p /home/deploy/.ssh
sudo chown deploy:deploy /home/deploy/.ssh
sudo chmod 700 /home/deploy/.ssh

# Добавить публичный ключ в authorized_keys
sudo -u deploy nano /home/deploy/.ssh/authorized_keys
sudo chmod 600 /home/deploy/.ssh/authorized_keys
```

#### Установка зависимостей:
```bash
# Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2
sudo npm install -g pm2
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy

# nginx
sudo apt update
sudo apt install nginx

# Создание директорий
sudo mkdir -p /var/www/tradekg
sudo chown deploy:deploy /var/www/tradekg
sudo mkdir -p /var/log/pm2
sudo chown deploy:deploy /var/log/pm2
```

#### Настройка nginx:
```bash
# Копировать nginx.conf в правильное место
sudo cp deploy/nginx.conf /etc/nginx/sites-available/tradekg
sudo ln -s /etc/nginx/sites-available/tradekg /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# SSL сертификат через Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d trade.kg -d www.trade.kg
```

### 3. Настройка GitLab Runner (на сервере деплоя)

```bash
# Установка GitLab Runner
curl -L "https://packages.gitlab.com/install/repositories/runner/gitlab-runner/script.deb.sh" | sudo bash
sudo apt-get install gitlab-runner

# Регистрация runner
sudo gitlab-runner register
# URL: https://gitlab.your-domain.com
# Token: получить из GitLab Settings → CI/CD → Runners
# Executor: shell
```

## Процесс деплоя

### 1. Обычная разработка
```bash
git checkout main
# делаем изменения
git add .
git commit -m "feature: новая функциональность"
git push origin main
```
> Pipeline запустится для тестирования, но деплой не произойдет

### 2. Деплой в production
```bash
# Переключаемся на release ветку
git checkout release
git merge main
git push origin release
```
> Pipeline запустится с возможностью manual деплоя

### 3. Manual approval
В GitLab CI/CD pipeline появится кнопка "Deploy" - нажать для деплоя

## Мониторинг

### Логи PM2:
```bash
pm2 logs single-window
pm2 monit
```

### Логи nginx:
```bash
sudo tail -f /var/log/nginx/tradekg_access.log
sudo tail -f /var/log/nginx/tradekg_error.log
```

### Логи деплоя:
```bash
tail -f /var/log/deploy.log
```

## Rollback

В случае проблем с деплоем:
1. В GitLab CI/CD запустить job "rollback"
2. Или вручную на сервере:
```bash
cd /var/www
pm2 stop single-window
mv tradekg tradekg-broken
mv tradekg-backup tradekg
cd tradekg
pm2 start ecosystem.config.js --env production
```

## Health Check

Приложение имеет endpoint для проверки здоровья:
```bash
curl https://trade.kg/api/health
```

## Troubleshooting

### Проблемы с правами:
```bash
sudo chown -R deploy:deploy /var/www/tradekg
```

### Проблемы с PM2:
```bash
pm2 kill
pm2 start ecosystem.config.js --env production
```

### Проблемы с SSL:
```bash
sudo certbot renew --dry-run
```

## Zero Downtime Deployment

Текущая настройка обеспечивает:
- ✅ Backup перед деплоем
- ✅ Health check после деплоя  
- ✅ Автоматический rollback при сбоях
- ✅ Кластерный режим PM2 (2 инстанса)
- ✅ Graceful shutdown