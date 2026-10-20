#!/bin/bash

# Server deployment script from GitLab repository
# Клонирует репозиторий, собирает и деплоит Single Window

set -e

# Цвета для логов
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Конфигурация
APP_NAME="single-window"
APP_DIR="/var/www/tradekg"
BACKUP_DIR="/var/www/tradekg-backup"
TEMP_DIR="/tmp/deploy-from-git-$(date +%s)"
LOG_FILE="/var/log/deploy.log"

# GitLab репозиторий
GIT_REPO_URL="${GIT_REPO_URL:-git@gitlab.com:singlewindow/tradekg.git}"
GIT_BRANCH="${GIT_BRANCH:-main}"

# Функции логирования
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a $LOG_FILE
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a $LOG_FILE
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a $LOG_FILE
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a $LOG_FILE
}

# Функция проверки здоровья приложения
health_check() {
    log "Проверяем состояние приложения..."
    sleep 5
    
    if ! pm2 describe $APP_NAME > /dev/null 2>&1; then
        log "ERROR: PM2 процесс не найден"
        return 1
    fi
    
    if curl -f -s http://localhost:3000/api/health > /dev/null; then
        log "Health check пройден"
        return 0
    else
        log "ERROR: Health check провален"
        return 1
    fi
}

# Функция отката
rollback() {
    log "ОТКАТ: Начинаем процедуру отката..."
    
    if [ -d "$BACKUP_DIR" ]; then
        log "ОТКАТ: Останавливаем текущее приложение..."
        pm2 stop $APP_NAME || true
        
        log "ОТКАТ: Восстанавливаем из бэкапа..."
        rm -rf $APP_DIR
        mv $BACKUP_DIR $APP_DIR
        
        log "ОТКАТ: Запускаем восстановленное приложение..."
        cd $APP_DIR
        pm2 start ecosystem.config.js --env production
        
        if health_check; then
            success "ОТКАТ: Откат выполнен успешно"
        else
            error "ОТКАТ: Откат провален! Требуется ручное вмешательство."
        fi
    else
        error "ОТКАТ: Бэкап не найден! Требуется ручное вмешательство."
    fi
}

# Проверка зависимостей
check_dependencies() {
    log "Проверяем зависимости..."
    
    if ! command -v git &> /dev/null; then
        error "Git не установлен"
    fi
    
    if ! command -v node &> /dev/null; then
        error "Node.js не установлен"
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm не установлен"
    fi
    
    if ! command -v pm2 &> /dev/null; then
        error "PM2 не установлен"
    fi
    
    success "Все зависимости установлены"
}

# Проверка прав
check_permissions() {
    if [ "$EUID" -eq 0 ]; then
        error "Не запускайте этот скрипт от root! Используйте пользователя deploy."
    fi
    
    if [ ! -w "/var/www" ]; then
        error "Нет прав записи в /var/www. Настройте права для пользователя deploy."
    fi
}

# Основная функция деплоя
main() {
    log "🚀 Начинаем деплой Single Window из GitLab репозитория..."
    
    # Проверки
    check_permissions
    check_dependencies
    
    # Показываем информацию о репозитории
    log "📁 Репозиторий: $GIT_REPO_URL"
    log "🌿 Ветка: $GIT_BRANCH"
    
    # Создаем временную директорию
    log "📂 Создаем временную директорию: $TEMP_DIR"
    mkdir -p "$TEMP_DIR"
    cd "$TEMP_DIR"
    
    # Клонируем репозиторий
    log "📥 Клонируем репозиторий..."
    if ! git clone --branch "$GIT_BRANCH" "$GIT_REPO_URL" project; then
        error "Не удалось клонировать репозиторий. Проверьте URL и доступ."
    fi
    
    cd project
    
    # Показываем информацию о коммите
    COMMIT_HASH=$(git rev-parse --short HEAD)
    COMMIT_MESSAGE=$(git log -1 --pretty=format:"%s")
    log "📝 Последний коммит: $COMMIT_HASH - $COMMIT_MESSAGE"
    
    # Устанавливаем зависимости
    log "📦 Устанавливаем зависимости..."
    npm ci
    
    # Сборка приложения
    log "🔨 Собираем приложение..."
    ESLINT_IGNORE=true npm run build
    
    if [ ! -d ".next" ]; then
        error "Сборка не удалась - директория .next не создана"
    fi
    
    if [ ! -f ".next/standalone/server.js" ]; then
        error "Standalone сборка не создана. Проверьте next.config.js"
    fi
    
    success "Сборка завершена успешно"
    
    # Настройка standalone структуры
    log "⚙️ Настраиваем standalone структуру..."
    if [ -d "public" ]; then
        cp -r public .next/standalone/
    fi
    
    if [ -d ".next/static" ]; then
        cp -r .next/static .next/standalone/.next/
    fi
    
    # Создаем бэкап текущей версии
    if [ -d "$APP_DIR" ]; then
        log "💾 Создаем бэкап текущей версии..."
        rm -rf $BACKUP_DIR 2>/dev/null || true
        cp -r $APP_DIR $BACKUP_DIR
        success "Бэкап создан: $BACKUP_DIR"
    fi
    
    # Останавливаем текущее приложение
    log "⏹️ Останавливаем текущее приложение..."
    pm2 stop $APP_NAME 2>/dev/null || log "Приложение не было запущено"
    
    # Копируем новые файлы
    log "📋 Устанавливаем новую версию..."
    rm -rf $APP_DIR
    mkdir -p $APP_DIR
    
    # Копируем standalone сборку
    cp -r .next $APP_DIR/
    cp -r public $APP_DIR/ 2>/dev/null || true
    cp package.json $APP_DIR/
    cp package-lock.json $APP_DIR/
    
    # Копируем конфигурационные файлы
    cp deploy/ecosystem.config.js $APP_DIR/
    
    # Переходим в директорию приложения
    cd $APP_DIR
    
    # Устанавливаем только production зависимости
    log "📦 Устанавливаем production зависимости..."
    npm ci --only=production
    
    # Обновляем nginx конфигурацию (если есть)
    if [ -f "$TEMP_DIR/project/deploy/nginx.conf" ]; then
        log "🌐 Обновляем nginx конфигурацию..."
        sudo cp "$TEMP_DIR/project/deploy/nginx.conf" /etc/nginx/sites-available/tradekg
        sudo nginx -t && sudo systemctl reload nginx
    fi
    
    # Запускаем приложение
    log "▶️ Запускаем новое приложение..."
    pm2 start ecosystem.config.js --env production
    
    # Проверяем здоровье приложения
    if health_check; then
        success "🎉 Деплой выполнен успешно!"
        
        # Сохраняем информацию о деплое
        echo "$(date): Deployed commit $COMMIT_HASH - $COMMIT_MESSAGE" >> /var/log/deployments.log
        
        # Очищаем старые бэкапы
        log "🧹 Очищаем старые бэкапы..."
        find /var/www -name "tradekg-backup-*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
        
        # Очищаем временные файлы
        log "🗑️ Очищаем временные файлы..."
        rm -rf "$TEMP_DIR"
        
        # Перезапускаем PM2 для сохранения конфигурации
        pm2 save
        
        log "📊 Статус приложения:"
        pm2 status
        
        success "✅ Деплой завершен успешно!"
        echo ""
        echo -e "${GREEN}🌐 Сайт доступен по адресу: https://trade.kg${NC}"
        echo -e "${BLUE}📊 Мониторинг:${NC}"
        echo "  pm2 logs single-window"
        echo "  pm2 monit"
        echo "  curl https://trade.kg/api/health"
        echo ""
        
    else
        error "❌ Health check провален, запускаем откат..."
        rollback
    fi
}

# Обработка аргументов командной строки
while [[ $# -gt 0 ]]; do
    case $1 in
        --repo)
            GIT_REPO_URL="$2"
            shift 2
            ;;
        --branch)
            GIT_BRANCH="$2"
            shift 2
            ;;
        --help)
            echo "Использование: $0 [--repo URL] [--branch BRANCH]"
            echo "  --repo URL     GitLab репозиторий URL"
            echo "  --branch BRANCH   Ветка для деплоя (по умолчанию: main)"
            exit 0
            ;;
        *)
            error "Неизвестный параметр: $1"
            ;;
    esac
done

# Обработка сигналов для graceful shutdown
trap rollback ERR

# Информация о системе
echo ""
log "ℹ️ Информация о системе:"
log "👤 Пользователь: $(whoami)"
log "💻 ОС: $(lsb_release -d | cut -f2)"
log "🟢 Node.js: $(node --version)"
log "📦 npm: $(npm --version)"
log "⚡ PM2: $(pm2 --version)"
log "🐙 Git: $(git --version)"
echo ""

# Запускаем основной процесс
main "$@"