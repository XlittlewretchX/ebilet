const db = require('../config/database');
const bcrypt = require('bcryptjs');

class User {
  static async create({ username, email, password, city }) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT INTO users (username, email, password, city) VALUES (?, ?, ?, ?)',
        [username, email, hashedPassword, city],
        function(err) {
          if (err) reject(err);
          resolve({ id: this.lastID, username, email, city });
        }
      );
    });
  }

  static async findByUsername(username) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async findByEmail(email) {
    return new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        resolve(row);
      });
    });
  }

  static async updateAvatar(userId, avatarUrl) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET avatarUrl = ? WHERE id = ?',
        [avatarUrl, userId],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async updateCity(userId, city) {
    return new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET city = ? WHERE id = ?',
        [city, userId],
        (err) => {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async addFavorite(userId, eventId) {
    return new Promise((resolve, reject) => {
      db.run(
        'INSERT OR IGNORE INTO favorites (userId, eventId) VALUES (?, ?)',
        [userId, eventId],
        function(err) {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async removeFavorite(userId, eventId) {
    return new Promise((resolve, reject) => {
      db.run(
        'DELETE FROM favorites WHERE userId = ? AND eventId = ?',
        [userId, eventId],
        function(err) {
          if (err) reject(err);
          resolve();
        }
      );
    });
  }

  static async getFavorites(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT events.* FROM events JOIN favorites ON events.id = favorites.eventId WHERE favorites.userId = ? ORDER BY events.date DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }
}

module.exports = User; 