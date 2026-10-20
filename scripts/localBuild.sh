#!/bin/bash

# Local build script for Single Window Next.js application
# Создает production сборку и упаковывает в package.zip

set -e  # Остановка при ошибке

# Цвета для логов
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функция логирования
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

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Проверяем, что мы в корне проекта
if [ ! -f "package.json" ]; then
    error "package.json не найден. Запустите скрипт из корня проекта."
fi

if [ ! -f "next.config.js" ]; then
    error "next.config.js не найден. Убедитесь, что это Next.js проект."
fi

log "Начинаем локальную сборку Single Window..."

# Создаем временную директорию для сборки
BUILD_DIR="build-$(date +%s)"
log "Создаем временную директорию: $BUILD_DIR"
mkdir -p "$BUILD_DIR"

# Очищаем предыдущие сборки
log "Очищаем предыдущие сборки..."
rm -rf .next
rm -f package.zip

# Проверяем Node.js версию
NODE_VERSION=$(node --version)
log "Node.js версия: $NODE_VERSION"

if [[ ! "$NODE_VERSION" =~ ^v(18|20|22) ]]; then
    warning "Рекомендуется Node.js 18+. Текущая версия: $NODE_VERSION"
fi

# Устанавливаем зависимости (включая dev для сборки)
log "Устанавливаем все зависимости для сборки..."
npm ci

# Сборка Next.js (пропускаем ESLint для production сборки)
log "Запускаем сборку Next.js..."
ESLINT_IGNORE=true npm run build

if [ ! -d ".next" ]; then
    error "Сборка не удалась - директория .next не создана"
fi

# Проверяем standalone сборку
if [ ! -f ".next/standalone/server.js" ]; then
    error "Standalone сборка не создана. Проверьте next.config.js"
fi

success "Next.js сборка завершена успешно"

# Копируем необходимые файлы в build директорию
log "Копируем файлы для деплоя..."

# Основные файлы приложения
cp -r .next "$BUILD_DIR/"
cp -r public "$BUILD_DIR/"
cp package.json "$BUILD_DIR/"
cp package-lock.json "$BUILD_DIR/"

# Конфигурационные файлы
cp deploy/ecosystem.config.js "$BUILD_DIR/"
cp deploy/deploy.sh "$BUILD_DIR/"
cp deploy/nginx.conf "$BUILD_DIR/"

# README для сервера
cp deploy/README.md "$BUILD_DIR/DEPLOY_README.md"

# Проверяем размер сборки
BUILD_SIZE=$(du -sh "$BUILD_DIR" | cut -f1)
log "Размер сборки: $BUILD_SIZE"

# Настройка standalone структуры
log "Настраиваем standalone структуру..."
cd "$BUILD_DIR"

# Копируем public файлы в standalone
if [ -d "public" ]; then
    cp -r public .next/standalone/
fi

# Копируем статические файлы _next
if [ -d ".next/static" ]; then
    cp -r .next/static .next/standalone/.next/
fi

cd ..

# Создаем архив
log "Создаем package.zip..."
cd "$BUILD_DIR"
zip -r ../package.zip . -x "*.DS_Store" "*.git*" "node_modules/*" 

cd ..

# Проверяем созданный архив
if [ ! -f "package.zip" ]; then
    error "Не удалось создать package.zip"
fi

PACKAGE_SIZE=$(du -sh package.zip | cut -f1)
success "package.zip создан (размер: $PACKAGE_SIZE)"

# Очищаем временную директорию
log "Очищаем временные файлы..."
rm -rf "$BUILD_DIR"

# Показываем содержимое архива
log "Содержимое package.zip:"
unzip -l package.zip | head -20

echo ""
success "Локальная сборка завершена!"
echo ""
echo -e "${BLUE}Следующие шаги:${NC}"
echo "1. Скопируйте package.zip на сервер"
echo "2. Запустите scripts/serverDeploy.sh на сервере"
echo ""
echo -e "${YELLOW}Для копирования на сервер:${NC}"
echo "scp package.zip deploy@your-server:/tmp/"
echo ""