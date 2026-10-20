#!/bin/bash

# Full deployment script - builds locally and deploys to server
# Полный деплой: сборка + загрузка + деплой

set -e

# Цвета для логов
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

SERVER_IP="192.169.3.27"
SERVER_USER="deploy"

log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Проверяем, что мы в корне проекта
if [ ! -f "package.json" ]; then
    error "Запустите скрипт из корня проекта"
fi

log "🚀 Начинаем полный деплой Single Window..."

# Шаг 1: Локальная сборка
log "📦 Шаг 1: Локальная сборка..."
if [ ! -f "scripts/localBuild.sh" ]; then
    error "Скрипт localBuild.sh не найден"
fi

./scripts/localBuild.sh

if [ ! -f "package.zip" ]; then
    error "package.zip не создан. Проверьте сборку."
fi

success "Локальная сборка завершена"

# Шаг 2: Загрузка на сервер
log "📤 Шаг 2: Загрузка файлов на сервер..."

# Проверяем доступность сервера
if ! ping -c 1 $SERVER_IP > /dev/null 2>&1; then
    error "Сервер $SERVER_IP недоступен"
fi

log "Копируем package.zip на сервер..."
scp package.zip $SERVER_USER@$SERVER_IP:/tmp/ || error "Не удалось скопировать package.zip"

log "Копируем скрипт деплоя на сервер..."
scp scripts/serverDeploy.sh $SERVER_USER@$SERVER_IP:/tmp/ || error "Не удалось скопировать serverDeploy.sh"

success "Файлы загружены на сервер"

# Шаг 3: Деплой на сервере
log "🔧 Шаг 3: Запуск деплоя на сервере..."

ssh $SERVER_USER@$SERVER_IP "chmod +x /tmp/serverDeploy.sh && /tmp/serverDeploy.sh" || error "Деплой на сервере провален"

success "🎉 Полный деплой завершен успешно!"

# Очистка локальных временных файлов
log "🧹 Очистка временных файлов..."
rm -f package.zip

log "✅ Сайт доступен по адресу: https://trade.kg"
log "📊 Мониторинг: ssh $SERVER_USER@$SERVER_IP 'pm2 status'"