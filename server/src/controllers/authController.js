const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password, city } = req.body;

      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }

      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      }

      const user = await User.create({ username, email, password, city });
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

      // Логирование для Render
      console.log(`Новый пользователь зарегистрирован: ${username} (${email}), город: ${city}`);

      res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email, city: user.city } });
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;

      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ message: 'Неверный пароль' });
      }
      console.log(`Пользователь вошел в систему: ${username}`);

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          city: user.city,
          avatarUrl: user.avatarUrl
        }
      });
    } catch (error) {
      console.error('Ошибка при входе:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async updateCity(req, res) {
    try {
      const userId = req.user.id;
      const { city } = req.body;
      if (!city) {
        return res.status(400).json({ message: 'Город обязателен' });
      }
      await User.updateCity(userId, city);
      res.json({ city });
    } catch (error) {
      console.error('Ошибка при обновлении города:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async addFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { eventId } = req.body;
      if (!eventId) {
        return res.status(400).json({ message: 'eventId обязателен' });
      }
      await User.addFavorite(userId, eventId);
      res.json({ success: true });
    } catch (error) {
      console.error('Ошибка при добавлении в избранное:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async removeFavorite(req, res) {
    try {
      const userId = req.user.id;
      const { eventId } = req.body;
      if (!eventId) {
        return res.status(400).json({ message: 'eventId обязателен' });
      }
      await User.removeFavorite(userId, eventId);
      res.json({ success: true });
    } catch (error) {
      console.error('Ошибка при удалении из избранного:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getFavorites(req, res) {
    try {
      const userId = req.user.id;
      const favorites = await User.getFavorites(userId);
      res.json(favorites);
    } catch (error) {
      console.error('Ошибка при получении избранного:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

module.exports = AuthController; 