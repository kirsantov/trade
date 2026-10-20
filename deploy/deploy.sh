#!/bin/bash

# Deploy script for Single Window Next.js application
# Использование: ./deploy.sh [PIPELINE_ID]

set -e  # Остановка при ошибке

PIPELINE_ID=${1:-"manual"}
APP_NAME="single-window"
APP_DIR="/var/www/tradekg"
BACKUP_DIR="/var/www/tradekg-backup"
TEMP_DIR="/tmp/nextjs-deploy-$PIPELINE_ID"
LOG_FILE="/var/log/deploy.log"

# Функция логирования
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Функция проверки здоровья приложения
health_check() {
    log "Checking application health..."
    sleep 5
    
    # Проверяем, что PM2 процесс запущен
    if ! pm2 describe $APP_NAME > /dev/null 2>&1; then
        log "ERROR: PM2 process not found"
        return 1
    fi
    
    # Проверяем HTTP ответ
    if curl -f -s http://localhost:3000/api/health > /dev/null; then
        log "Health check passed"
        return 0
    else
        log "ERROR: Health check failed"
        return 1
    fi
}

# Функция отката
rollback() {
    log "ROLLBACK: Starting rollback procedure..."
    
    if [ -d "$BACKUP_DIR" ]; then
        log "ROLLBACK: Stopping current application..."
        pm2 stop $APP_NAME || true
        
        log "ROLLBACK: Restoring from backup..."
        rm -rf $APP_DIR
        mv $BACKUP_DIR $APP_DIR
        
        log "ROLLBACK: Starting restored application..."
        cd $APP_DIR
        pm2 start ecosystem.config.js --env production
        
        if health_check; then
            log "ROLLBACK: Rollback successful"
            exit 0
        else
            log "ROLLBACK: Rollback failed! Manual intervention required."
            exit 1
        fi
    else
        log "ROLLBACK: No backup found! Manual intervention required."
        exit 1
    fi
}

# Основной процесс деплоя
main() {
    log "Starting deployment (Pipeline: $PIPELINE_ID)..."
    
    # Проверяем, что временная директория существует
    if [ ! -d "$TEMP_DIR" ]; then
        log "ERROR: Temporary directory $TEMP_DIR not found"
        exit 1
    fi
    
    # Создаем бэкап текущей версии
    if [ -d "$APP_DIR" ]; then
        log "Creating backup of current version..."
        rm -rf $BACKUP_DIR 2>/dev/null || true
        cp -r $APP_DIR $BACKUP_DIR
        log "Backup created at $BACKUP_DIR"
    fi
    
    # Останавливаем текущее приложение
    log "Stopping current application..."
    pm2 stop $APP_NAME 2>/dev/null || log "No running application found"
    
    # Копируем новые файлы
    log "Deploying new version..."
    rm -rf $APP_DIR
    mv $TEMP_DIR $APP_DIR
    
    # Переходим в директорию приложения
    cd $APP_DIR
    
    # Устанавливаем production зависимости
    log "Installing production dependencies..."
    npm ci --only=production --silent
    
    # Копируем статические файлы в правильную структуру standalone
    log "Setting up standalone structure..."
    if [ -d "public" ]; then
        cp -r public .next/standalone/
    fi
    
    # Копируем статические файлы _next
    if [ -d ".next/static" ]; then
        cp -r .next/static .next/standalone/.next/
    fi
    
    # Запускаем приложение через PM2
    log "Starting new application..."
    pm2 start ecosystem.config.js --env production
    
    # Проверяем здоровье приложения
    if health_check; then
        log "Deployment successful!"
        
        # Очищаем старый бэкап (сохраняем место на диске)
        log "Cleaning up old backups..."
        find /var/www -name "tradekg-backup-*" -mtime +7 -exec rm -rf {} \; 2>/dev/null || true
        
        # Перезагружаем nginx для применения возможных изменений
        log "Reloading nginx..."
        sudo systemctl reload nginx || log "WARNING: Could not reload nginx"
        
        log "Deployment completed successfully"
        exit 0
    else
        log "ERROR: Health check failed, initiating rollback..."
        rollback
    fi
}

# Обработка сигналов для graceful shutdown
trap rollback ERR

# Запускаем основной процесс
main "$@"