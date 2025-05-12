const db = require('../config/database');

const updates = [
  { seatingType: 'grid', categories: ['theater', 'movie', 'concert'] },
  { seatingType: 'circle', categories: ['sport'] },
  { seatingType: 'none', categories: ['exhibition'] },
];

(async () => {
  for (const { seatingType, categories } of updates) {
    for (const category of categories) {
      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE events SET seatingType = ? WHERE category = ?',
          [seatingType, category],
          function (err) {
            if (err) {
              console.error(`Ошибка при обновлении ${category}:`, err);
              reject(err);
            } else {
              console.log(`Обновлено событий категории '${category}' на seatingType='${seatingType}'`);
              resolve();
            }
          }
        );
      });
    }
  }
  console.log('Обновление seatingType завершено.');
  process.exit(0);
})(); 