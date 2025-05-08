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
}

module.exports = User; 