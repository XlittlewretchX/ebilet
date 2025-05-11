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

  static async findAll(filters = {}) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM events WHERE 1=1';
      const params = [];

      if (filters.category) {
        query += ' AND category = ?';
        params.push(filters.category);
      }
      if (filters.subcategory) {
        query += ' AND subcategory = ?';
        params.push(filters.subcategory);
      }
      if (filters.minPrice !== undefined) {
        query += ' AND price >= ?';
        params.push(filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query += ' AND price <= ?';
        params.push(filters.maxPrice);
      }
      if (filters.search) {
        query += ' AND (title LIKE ? OR description LIKE ?)';
        const like = `%${filters.search}%`;
        params.push(like, like);
      }

      query += ' ORDER BY date DESC';

      db.all(query, params, (err, rows) => {
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