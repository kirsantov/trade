#!/bin/bash

# Server deployment script for Single Window Next.js application
# Разворачивает package.zip на сервере Ubuntu

set -e  # Остановка при ошибке

# Цвета для логов
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Конфигурация
APP_NAME="single-window"
APP_DIR="/var/www/tradekg"
BACKUP_DIR="/var/www/tradekg-backup"
PACKAGE_FILE="/tmp/package.zip"
LOG_FILE="/var/log/deploy.log"

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
    
    # Проверяем PM2 процесс
    if ! pm2 describe $APP_NAME > /dev/null 2>&1; then
        log "ERROR: PM2 процесс не найден"
        return 1
    fi
    
    # Проверяем HTTP ответ
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
            exit 0
        else
            error "ОТКАТ: Откат провален! Требуется ручное вмешательство."
        fi
    else
        error "ОТКАТ: Бэкап не найден! Требуется ручное вмешательство."
    fi
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

# Проверка зависимостей
check_dependencies() {
    log "Проверяем зависимости..."
    
    if ! command -v node &> /dev/null; then
        error "Node.js не установлен"
    fi
    
    if ! command -v npm &> /dev/null; then
        error "npm не установлен"
    fi
    
    if ! command -v pm2 &> /dev/null; then
        error "PM2 не установлен"
    fi
    
    if ! command -v nginx &> /dev/null; then
        error "nginx не установлен"
    fi
    
    success "Все зависимости установлены"
}

# Основная функция деплоя
main() {
    log "Начинаем деплой Single Window на сервере..."
    
    # Проверки
    check_permissions
    check_dependencies
    
    # Проверяем наличие архива
    if [ ! -f "$PACKAGE_FILE" ]; then
        error "Файл $PACKAGE_FILE не найден. Сначала скопируйте package.zip на сервер."
    fi
    
    # Создаем временную директорию
    TEMP_DIR="/tmp/deploy-$(date +%s)"
    log "Создаем временную директорию: $TEMP_DIR"
    mkdir -p "$TEMP_DIR"
    
    # Распаковываем архив
    log "Распаковываем package.zip..."
    cd "$TEMP_DIR"
    unzip -q "$PACKAGE_FILE"
    
    # Проверяем содержимое
    if [ ! -f "ecosystem.config.js" ] || [ ! -d ".next" ]; then
        error "Неверная структура архива. Проверьте localBuild.sh"
    fi
    
    # Создаем бэкап текущей версии
    if [ -d "$APP_DIR" ]; then
        log "Создаем бэкап текущей версии..."
        rm -rf $BACKUP_DIR 2>/dev/null || true
        cp -r $APP_DIR $BACKUP_DIR
        success "Бэкап создан: $BACKUP_DIR"
    fi
    
    # Останавливаем текущее приложение
    log "Останавливаем текущее приложение..."
    pm2 stop $APP_NAME 2>/dev/null || log "Приложение не запущено"
    
    # Копируем новые файлы
    log "Устанавливаем новую версию..."
    rm -rf $APP_DIR
    mkdir -p $APP_DIR
    cp -r * $APP_DIR/
    
    # Переходим в директорию приложения
    cd $APP_DIR
    
    # Устанавливаем production зависимости
    log "Устанавливаем production зависимости..."
    npm ci --only=production --silent
    
    # Обновляем nginx конфигурацию (если изменилась)
    if [ -f "nginx.conf" ]; then
        log "Обновляем nginx конфигурацию..."
        sudo cp nginx.conf /etc/nginx/sites-available/tradekg
        sudo nginx -t && sudo systemctl reload nginx
    fi
    
    # Запускаем приложение
    log "Запускаем новое приложение..."
    pm2 start ecosystem.config.js --env production
    
    # Проверяем здоровье приложения
    if health_check; then
        success "Деплой выполнен успешно!"
        
        # Очищаем старые бэкапы (старше 7 дней)
        log "Очищаем старые бэкапы..."
        find /var/www -name "tradekg-backup-*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
        
        # Очищаем временные файлы
        log "Очищаем временные файлы..."
        rm -rf "$TEMP_DIR"
        rm -f "$PACKAGE_FILE"
        
        # Перезапускаем PM2 для применения новых настроек
        log "Перезапускаем PM2..."
        pm2 save
        
        log "Показываем статус приложения..."
        pm2 status
        
        success "Деплой завершен успешно!"
        echo ""
        echo -e "${GREEN}Приложение доступно по адресу: https://trade.kg${NC}"
        echo -e "${BLUE}Для мониторинга используйте:${NC}"
        echo "  pm2 logs single-window"
        echo "  pm2 monit"
        echo ""
        
    else
        error "Health check провален, запускаем откат..."
        rollback
    fi
}

# Обработка сигналов для graceful shutdown
trap rollback ERR

# Информация о системе
echo ""
log "Информация о системе:"
log "Пользователь: $(whoami)"
log "Операционная система: $(uname -a)"
log "Node.js: $(node --version)"
log "npm: $(npm --version)"
log "PM2: $(pm2 --version)"
echo ""

# Запускаем основной процесс
main "$@"