# Скрипты для локального деплоя Single Window

Временное решение для деплоя без GitLab CI/CD.

## Структура скриптов

```
scripts/
├── README.md          # Данная документация
├── localBuild.sh      # Локальная сборка и упаковка
└── serverDeploy.sh    # Деплой на сервере
```

## 🔨 Локальная сборка (на вашем компьютере)

### 1. Подготовка
```bash
# Убедитесь, что находитесь в корне проекта
cd /path/to/trade-nextjs

# Сделайте скрипт исполняемым
chmod +x scripts/localBuild.sh
```

### 2. Запуск сборки
```bash
./scripts/localBuild.sh
```

**Что делает скрипт:**
- ✅ Проверяет окружение (Node.js, файлы проекта)
- ✅ Устанавливает production зависимости
- ✅ Собирает Next.js в standalone режиме
- ✅ Копирует все необходимые файлы
- ✅ Настраивает корректную структуру для деплоя
- ✅ Создает `package.zip` архив

**Результат:** Файл `package.zip` готов для загрузки на сервер.

## 🚀 Деплой на сервер (Ubuntu 24.04.2)

### 1. Копирование на сервер
```bash
# Скопируйте package.zip на сервер
scp package.zip deploy@192.169.3.27:/tmp/

# Скопируйте скрипт деплоя
scp scripts/serverDeploy.sh deploy@192.169.3.27:/tmp/
```

### 2. Подключение к серверу
```bash
ssh deploy@192.169.3.27
```

### 3. Запуск деплоя
```bash
# Сделайте скрипт исполняемым
chmod +x /tmp/serverDeploy.sh

# Запустите деплой
/tmp/serverDeploy.sh
```

**Что делает скрипт на сервере:**
- ✅ Проверяет зависимости (Node.js, PM2, nginx)
- ✅ Создает бэкап текущей версии
- ✅ Останавливает старое приложение
- ✅ Распаковывает новую версию
- ✅ Устанавливает зависимости
- ✅ Обновляет nginx конфигурацию
- ✅ Запускает новое приложение
- ✅ Выполняет health check
- ✅ Автоматический откат при сбоях

## 📋 Полный процесс деплоя

### На локальной машине:
```bash
# 1. Сборка
./scripts/localBuild.sh

# 2. Копирование на сервер
scp package.zip deploy@192.169.3.27:/tmp/
scp scripts/serverDeploy.sh deploy@192.169.3.27:/tmp/
```

### На сервере:
```bash
# 3. Подключение
ssh deploy@192.169.3.27

# 4. Деплой
chmod +x /tmp/serverDeploy.sh && /tmp/serverDeploy.sh
```

## 🔧 Переменные окружения

Перед первым деплоем настройте переменные на сервере:

```bash
# Создайте .env файл
sudo nano /var/www/tradekg/.env

# Добавьте переменные:
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCtbYoCB8fczCrOMEl9HXJ68bptgEfWZls
NEXT_PUBLIC_FIREBASE_PROJECT_ID=tradekg-3f266
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-QT2H4G2N49
# ... остальные Firebase переменные
```

## 🚨 Troubleshooting

### Проблема: "Permission denied"
```bash
# Исправление прав
sudo chown -R deploy:deploy /var/www/tradekg
chmod +x scripts/*.sh
```

### Проблема: "Health check failed"
```bash
# Проверка логов
pm2 logs single-window
sudo tail -f /var/log/nginx/tradekg_error.log
```

### Проблема: "PM2 not found"
```bash
# Установка PM2
sudo npm install -g pm2
pm2 startup
```

### Откат к предыдущей версии
```bash
# Ручной откат
pm2 stop single-window
cd /var/www
mv tradekg tradekg-broken
mv tradekg-backup tradekg
cd tradekg
pm2 start ecosystem.config.js --env production
```

## 📊 Мониторинг

### Проверка статуса
```bash
pm2 status
pm2 logs single-window
pm2 monit
```

### Логи nginx
```bash
sudo tail -f /var/log/nginx/tradekg_access.log
sudo tail -f /var/log/nginx/tradekg_error.log
```

### Health check
```bash
curl http://localhost:3000/api/health
curl https://trade.kg/api/health
```

## 🔄 Обновление процесса

Когда GitLab CI/CD будет готов:
1. Эти скрипты можно оставить как backup метод
2. GitLab pipeline будет использовать те же принципы
3. Автоматизация заменит ручные команды

## ⚡ Быстрые команды

```bash
# Полный деплой одной командой (на локальной машине)
./scripts/localBuild.sh && scp package.zip deploy@192.169.3.27:/tmp/ && ssh deploy@192.169.3.27 "chmod +x /tmp/serverDeploy.sh && /tmp/serverDeploy.sh"
```

---

**Примечание:** Эти скрипты обеспечивают тот же уровень надежности, что и GitLab CI/CD, включая бэкапы, health checks и автоматический откат.