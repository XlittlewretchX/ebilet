const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = ['https://xlittlewretchx.github.io', 'http://localhost:3000'];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.options('*', cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Что-то пошло не так!' });
});

// Create uploads directory if it doesn't exist
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Initialize database
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    city TEXT,
    avatarUrl TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    location TEXT NOT NULL,
    price REAL NOT NULL,
    imageUrl TEXT,
    category TEXT,
    userId INTEGER,
    FOREIGN KEY (userId) REFERENCES users (id)
  )`);
});

// Проверка и добавление столбца userId в таблицу events, если его нет
// Это нужно делать после подключения к базе, до создания таблиц

db.all("PRAGMA table_info(events);", (err, columns) => {
  if (err) {
    console.error('Ошибка при получении информации о столбцах:', err);
    return;
  }
  const hasUserId = columns.some(col => col.name === 'userId');
  if (!hasUserId) {
    db.run("ALTER TABLE events ADD COLUMN userId INTEGER;", (err) => {
      if (err) {
        console.error('Ошибка при добавлении столбца userId:', err);
      } else {
        console.log('Столбец userId успешно добавлен в таблицу events');
      }
    });
  }
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 