# 🚀 Инструкции по деплою Single Window

## Репозиторий: `git@gitlab.com:singlewindow/tradekg.git`

---

## 📋 Быстрый деплой (рекомендуемый метод)

### 1. Локально - push изменений
```bash
git add .
git commit -m "Update for deployment"
git push origin main
```

### 2. На сервере - деплой из GitLab
```bash
# Подключение к серверу
ssh deploy@192.169.3.27

# Деплой одной командой
curl -s https://raw.githubusercontent.com/yourgithub/tradekg/main/scripts/serverDeployFromGit.sh | bash -s -- --repo git@gitlab.com:singlewindow/tradekg.git
```

---

## 🔧 Настройка сервера (выполнить один раз)

### 1. SSH ключи для GitLab (на сервере)
```bash
# Генерируем SSH ключ на сервере
ssh-keygen -t rsa -b 4096 -C "deploy@tradekg"

# Показываем публичный ключ
cat ~/.ssh/id_rsa.pub

# Добавьте этот ключ в GitLab: Settings → SSH Keys
```

### 2. Скачивание скрипта деплоя
```bash
# Скачиваем скрипт на сервер
curl -o /tmp/serverDeployFromGit.sh https://raw.githubusercontent.com/yourgithub/tradekg/main/scripts/serverDeployFromGit.sh
chmod +x /tmp/serverDeployFromGit.sh
```

---

## 🎯 Полный процесс деплоя

### Вариант 1: Автоматический (рекомендуемый)
```bash
# 1. Локально: коммит и push
git push origin main

# 2. На сервере: деплой
ssh deploy@192.169.3.27 "/tmp/serverDeployFromGit.sh"
```

### Вариант 2: С указанием ветки
```bash
# Деплой конкретной ветки
ssh deploy@192.169.3.27 "/tmp/serverDeployFromGit.sh --branch release"
```

### Вариант 3: Ручной (если GitLab недоступен)
```bash
# Локально: сборка
./scripts/localBuild.sh

# Копирование на сервер (если SSH ключи настроены)
scp package.zip deploy@192.169.3.27:/tmp/
ssh deploy@192.169.3.27 "/tmp/serverDeploy.sh"
```

---

## 📊 Мониторинг после деплоя

```bash
# Проверка статуса приложения
ssh deploy@192.169.3.27 "pm2 status"

# Логи приложения
ssh deploy@192.169.3.27 "pm2 logs single-window"

# Health check
curl https://trade.kg/api/health

# Логи nginx
ssh deploy@192.169.3.27 "sudo tail -f /var/log/nginx/tradekg_access.log"
```

---

## 🚨 Troubleshooting

### Проблема: "Permission denied (publickey)"
```bash
# На сервере: проверить SSH ключ для GitLab
ssh -T git@gitlab.com

# Если не работает, создать новый ключ и добавить в GitLab
ssh-keygen -t rsa -b 4096 -C "deploy@trade.kg"
cat ~/.ssh/id_rsa.pub
```

### Проблема: "Health check failed"
```bash
# Проверить логи
ssh deploy@192.169.3.27 "pm2 logs single-window --lines 50"

# Ручной откат к предыдущей версии
ssh deploy@192.169.3.27 "pm2 stop single-window && rm -rf /var/www/tradekg && mv /var/www/tradekg-backup /var/www/tradekg && cd /var/www/tradekg && pm2 start ecosystem.config.js --env production"
```

### Проблема: "Build failed"
```bash
# Проверить на сервере
ssh deploy@192.169.3.27 "node --version && npm --version"

# Локально проверить сборку
npm run build
```

---

## 🔄 Рабочий процесс команды

### Ежедневная разработка
```bash
# Работаем в feature ветках
git checkout -b feature/new-functionality
# ... делаем изменения ...
git commit -m "Add new functionality"
git push origin feature/new-functionality

# Merge в main через GitLab MR
```

### Деплой в production
```bash
# После merge в main
git checkout main
git pull origin main

# Деплой на сервер
ssh deploy@192.169.3.27 "/tmp/serverDeployFromGit.sh"
```

---

## 📈 Автоматизация (будущее)

После настройки GitLab CI/CD:
- Push в `main` → автоматические тесты
- Push в `release` → автоматический деплой
- Rollback через GitLab interface

---

## 📞 Контакты для поддержки

- **Сервер**: `deploy@192.169.3.27`
- **Репозиторий**: `git@gitlab.com:singlewindow/tradekg.git`
- **Сайт**: `https://trade.kg`
- **Health check**: `https://trade.kg/api/health`