const db = require('../config/database');

class Event {
  static async create({ title, description, date, location, price, imageUrl, category, userId }) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO events (title, description, date, location, price, imageUrl, category, userId) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [title, description, date, location, price, imageUrl, category, userId],
        function(err) {
          if (err) reject(err);
          resolve({ id: this.lastID, title, description, date, location, price, imageUrl, category, userId });
        }
      );
    });
  }

  static async findAll() {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM events ORDER BY date DESC', (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }

  static async findById(id) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM events WHERE id = ?', [id], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async findByUserId(userId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT * FROM events WHERE userId = ? ORDER BY date DESC', [userId], (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  }
}

module.exports = Event; 