# LKS Production

## Запуск продакшена

```bash
# Установить PM2
npm install -g pm2

# Запустить все сервисы
./start.sh

# Остановить все сервисы
./stop.sh

# Перезапустить все сервисы
./restart.sh

# Посмотреть статус
pm2 status

# Посмотреть логи
pm2 logs
```

## Сервисы

- Next.js app: http://localhost:3000
- Image server: http://localhost:5000 