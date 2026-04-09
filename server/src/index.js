const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

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
    subCategory TEXT,
    seatingType TEXT DEFAULT 'none',
    userId INTEGER,
    FOREIGN KEY (userId) REFERENCES users (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS favorites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    eventId INTEGER NOT NULL,
    UNIQUE(userId, eventId),
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (eventId) REFERENCES events (id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    eventId INTEGER NOT NULL,
    seat TEXT,
    name TEXT,
    phone TEXT,
    email TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users (id),
    FOREIGN KEY (eventId) REFERENCES events (id),
    UNIQUE(eventId, seat)
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

// Миграция: добавление столбца seatingType, если его нет
db.all("PRAGMA table_info(events);", (err, columns) => {
  if (err) {
    console.error('Ошибка при получении информации о столбцах:', err);
    return;
  }
  const hasSeatingType = columns.some(col => col.name === 'seatingType');
  if (!hasSeatingType) {
    db.run("ALTER TABLE events ADD COLUMN seatingType TEXT DEFAULT 'none';", (err) => {
      if (err) {
        console.error('Ошибка при добавлении столбца seatingType:', err);
      } else {
        console.log('Столбец seatingType успешно добавлен в таблицу events');
      }
    });
  }
});

// Миграция: добавление новых столбцов, если их нет
const ticketColumns = [
  { name: 'seat', type: 'TEXT' },
  { name: 'name', type: 'TEXT' },
  { name: 'phone', type: 'TEXT' },
  { name: 'email', type: 'TEXT' },
];
db.all("PRAGMA table_info(tickets);", (err, columns) => {
  if (err) {
    console.error('Ошибка при получении информации о столбцах tickets:', err);
    return;
  }
  ticketColumns.forEach(col => {
    const hasCol = columns.some(c => c.name === col.name);
    if (!hasCol) {
      db.run(`ALTER TABLE tickets ADD COLUMN ${col.name} ${col.type};`, (err) => {
        if (err) {
          console.error(`Ошибка при добавлении столбца ${col.name} в tickets:`, err);
        } else {
          console.log(`Столбец ${col.name} успешно добавлен в tickets`);
        }
      });
    }
  });
});

// Миграция: добавление уникального индекса на (eventId, seat)
db.run('CREATE UNIQUE INDEX IF NOT EXISTS idx_tickets_event_seat ON tickets(eventId, seat)');

db.all("SELECT * FROM 'events' LIMIT 0,30", (err, rows) => {
  if (err) {
    console.error('Ошибка при получении данных:', err);
    return;
  }
  console.log('Данные из таблицы events:', rows);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
}); 