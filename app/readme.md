
// ✅ Интеграция с Telegram:
// Форматированное сообщение с эмодзи и временем подачи заявки
// Обработка ошибок от Telegram API
// 🔧 Что нужно настроить:
// Создайте Telegram бота:
// Напишите @BotFather в Telegram
// Отправьте /newbot и следуйте инструкциям
// Получите токен бота (выглядит как 123456789:ABCdefGHIjklMNOpqrsTUVwxyz)
// Получите Chat ID:
// Добавьте бота в чат/группу или начните с ним диалог
// Отправьте любое сообщение боту
// Перейдите по ссылке: https://api.telegram.org/bot{ВАШ_ТОКЕН}/getUpdates
// Найдите в ответе "chat":{"id": ЧИСЛО} - это ваш chat_id

// Добавьте переменные окружения:
// Создайте файл .env.example в корне проекта:
// TELEGRAM_BOT_TOKEN=
// TELEGRAM_CHAT_ID=


// Теперь форма будет отправлять красиво оформленные сообщения в Telegram с именем, телефоном и временем заявки! 🚀