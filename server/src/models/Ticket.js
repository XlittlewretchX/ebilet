const db = require('../config/database');

class Ticket {
  static async buy(userId, eventId, seat, name, phone, email) {
    return new Promise((resolve, reject) => {
      if (Array.isArray(seat)) {
        // Мультивыбор мест
        const results = [];
        let errorOccurred = false;
        let processed = 0;
        seat.forEach((s) => {
          db.get(
            'SELECT id FROM tickets WHERE eventId = ? AND seat = ?',
            [eventId, s],
            (err, row) => {
              if (errorOccurred) return;
              if (err) {
                errorOccurred = true;
                return reject(err);
              }
              if (row) {
                errorOccurred = true;
                return reject(new Error(`Место ${s} уже занято`));
              }
              db.run(
                'INSERT INTO tickets (userId, eventId, seat, name, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
                [userId, eventId, s, name, phone, email],
                function(err) {
                  if (errorOccurred) return;
                  if (err) {
                    errorOccurred = true;
                    return reject(err);
                  }
                  results.push({ id: this.lastID, userId, eventId, seat: s, name, phone, email });
                  processed++;
                  if (processed === seat.length) {
                    resolve(results);
                  }
                }
              );
            }
          );
        });
      } else if (seat) {
        db.get(
          'SELECT id FROM tickets WHERE eventId = ? AND seat = ?',
          [eventId, seat],
          (err, row) => {
            if (err) return reject(err);
            if (row) return reject(new Error('Место уже занято'));
            db.run(
              'INSERT INTO tickets (userId, eventId, seat, name, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
              [userId, eventId, seat, name, phone, email],
              function(err) {
                if (err) reject(err);
                resolve({ id: this.lastID, userId, eventId, seat, name, phone, email });
              }
            );
          }
        );
      } else {
        db.run(
          'INSERT INTO tickets (userId, eventId, seat, name, phone, email) VALUES (?, ?, ?, ?, ?, ?)',
          [userId, eventId, seat, name, phone, email],
          function(err) {
            if (err) reject(err);
            resolve({ id: this.lastID, userId, eventId, seat, name, phone, email });
          }
        );
      }
    });
  }

  static async getByUser(userId) {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT tickets.*, events.title, events.date, events.location, events.price, events.imageUrl FROM tickets JOIN events ON tickets.eventId = events.id WHERE tickets.userId = ? ORDER BY tickets.createdAt DESC',
        [userId],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  static async getBookedSeats(eventId) {
    return new Promise((resolve, reject) => {
      db.all('SELECT seat FROM tickets WHERE eventId = ? AND seat IS NOT NULL', [eventId], (err, rows) => {
        if (err) reject(err);
        resolve(rows.map(r => r.seat));
      });
    });
  }
}

module.exports = Ticket; 