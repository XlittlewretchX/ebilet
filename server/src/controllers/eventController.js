const Event = require('../models/Event');

class EventController {
  static async create(req, res) {
    try {
      const { title, description, date, location, price, category } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
      const userId = req.user.id;

      const event = await Event.create({
        title,
        description,
        date,
        location,
        price,
        imageUrl,
        category,
        userId
      });

      res.status(201).json(event);
    } catch (error) {
      console.error('Ошибка при создании события:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getAll(req, res) {
    try {
      const { category, subcategory, minPrice, maxPrice, search, city } = req.query;
      const filters = {
        category,
        subcategory,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        search,
        city,
      };
      const events = await Event.findAll(filters);
      res.json(events);
    } catch (error) {
      console.error('Ошибка при получении событий:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getById(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) {
        return res.status(404).json({ message: 'Событие не найдено' });
      }
      res.json(event);
    } catch (error) {
      console.error('Ошибка при получении события:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getByUserId(req, res) {
    console.log('req.user:', req.user);
    try {
      const events = await Event.findByUserId(req.user.id);
      res.json(events);
    } catch (error) {
      console.error('Ошибка при получении событий пользователя:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

module.exports = EventController; 