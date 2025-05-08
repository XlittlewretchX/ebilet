const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../../database.db'), (err) => {
  if (err) {
    console.error('Ошибка подключения к базе данных:', err);
    process.exit(1);
  }
  console.log('Подключено к SQLite');
});

module.exports = db; 