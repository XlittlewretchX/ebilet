# eBilet - Сервис бронирования билетов

EBilet - это современный веб-сервис для бронирования билетов на различные мероприятия. Проект разработан с использованием React, TypeScript, Redux Toolkit на фронтенде и Node.js, Express, SQLite на бэкенде.

## Функциональность

- 🔐 Аутентификация и авторизация пользователей
- 🎫 Просмотр доступных мероприятий
- 🔍 Фильтрация мероприятий по категориям и датам
- 📝 Создание новых мероприятий
- 👤 Управление профилем пользователя
- 🌍 Определение города пользователя по IP
- 🖼️ Загрузка изображений для мероприятий и аватаров

## Технологии

### Фронтенд
- React 19
- TypeScript
- Redux Toolkit
- React Router
- SCSS Modules
- Webpack

### Backend
- Express.js
- SQLite3
- JWT Authentication
- Multer (для загрузки файлов)
- Bcrypt (для хеширования паролей)

## Установка и запуск

### Предварительные требования
- Node.js (версия 18 или выше)
- npm или yarn

### Установка зависимостей

1. Клонируйте репозиторий:
```bash
git clone https://github.com/yourusername/ebilet.git
cd ebilet
```

2. Установите зависимости:
```bash
npm install
```

3. Создайте файл `.env` в корневой директории проекта:
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_IPGEO_API_KEY=your_ipgeo_api_key
JWT_SECRET=your_jwt_secret
```

4. Запустите сервер разработки:
```bash
# Запуск клиента
npm start

# В отдельном терминале запустите сервер
npm run server
```

Приложение будет доступно по адресу: http://localhost:3000

## Структура проекта

```
ebilet/
├── client/                 # Frontend часть
│   ├── src/
│   │   ├── components/    # React компоненты
│   │   ├── pages/        # Страницы приложения
│   │   ├── store/        # Redux store и slices
│   │   ├── services/     # API сервисы
│   │   └── types/        # TypeScript типы   
│
├── server/               # Бэкенд часть
│   ├── src/
│   │   ├── config/       # Конфигурации
│   │   ├── controllers/  # Контроллеры
│   │   ├── middleware/   # Middleware
│   │   ├── models/       # Модели данных
│   │   └── routes/       # Маршруты
```

## Скрипты

- `npm start` - Запуск клиентской части в режиме разработки
- `npm run server` - Запуск серверной части
- `npm run build` - Сборка клиентской части для продакшена
- `npm run lint` - Проверка кода линтером
- `npm run format` - Форматирование кода с помощью Prettier

## API Endpoints

### Аутентификация
- POST `/api/auth/register` - Регистрация нового пользователя
- POST `/api/auth/login` - Вход в систему
- POST `/api/auth/avatar` - Загрузка аватара пользователя

### Мероприятия
- GET `/api/events` - Получение списка мероприятий
- GET `/api/events/:id` - Получение информации о конкретном мероприятии
- POST `/api/events` - Создание нового мероприятия
- GET `/api/events/user/events` - Получение мероприятий пользователя

## Вклад в проект

1. Форкните репозиторий
2. Создайте ветку для новой функциональности (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add some amazing feature'`)
4. Отправьте изменения в ваш форк (`git push origin feature/amazing-feature`)
5. Создайте Pull Request

## Лицензия

Этот проект распространяется под лицензией MIT. Подробности в файле [LICENSE](LICENSE). 