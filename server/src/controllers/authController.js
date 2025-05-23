const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Ticket = require('../models/Ticket');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

class AuthController {
  static async register(req, res) {
    try {
      const { username, email, password, city } = req.body;
      console.log(`\n[${new Date().toISOString()}] Попытка регистрации нового пользователя:`);
      console.log(`Username: ${username}`);
      console.log(`Email: ${email}`);
      console.log(`Город: ${city}`);

      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        console.log(`❌ Ошибка: Пользователь с именем ${username} уже существует`);
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }

      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        console.log(`❌ Ошибка: Email ${email} уже зарегистрирован`);
        return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
      }

      const user = await User.create({ username, email, password, city });
      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

      console.log(`✅ Успешная регистрация пользователя ${username}`);
      console.log(`ID пользователя: ${user.id}`);
      console.log('----------------------------------------');

      res.status(201).json({ token, user: { id: user.id, username: user.username, email: user.email, city: user.city } });
    } catch (error) {
      console.error('❌ Ошибка при регистрации:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async login(req, res) {
    try {
      const { username, password } = req.body;
      console.log(`\n[${new Date().toISOString()}] Попытка входа пользователя:`);
      console.log(`Username: ${username}`);

      const user = await User.findByUsername(username);
      if (!user) {
        console.log(`❌ Ошибка: Пользователь ${username} не найден`);
        return res.status(400).json({ message: 'Пользователь не найден' });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        console.log(`❌ Ошибка: Неверный пароль для пользователя ${username}`);
        return res.status(400).json({ message: 'Неверный пароль' });
      }

      const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });

      console.log(`✅ Успешный вход пользователя ${username}`);
      console.log(`ID пользователя: ${user.id}`);
      console.log(`Email: ${user.email}`);
      console.log(`Город: ${user.city}`);
      console.log('----------------------------------------');

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
      console.error('❌ Ошибка при входе:', error);
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

  static async resetAvatar(req, res) {
    try {
      const userId = req.user.id;
      await User.resetAvatar(userId);
      res.json({ avatarUrl: null });
    } catch (error) {
      console.error('Ошибка при сбросе аватара:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async updateUsername(req, res) {
    try {
      const userId = req.user.id;
      const { username } = req.body;
      
      if (!username) {
        return res.status(400).json({ message: 'Имя пользователя обязательно' });
      }

      const existingUser = await User.findByUsername(username);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
      }

      await User.updateUsername(userId, username);
      res.json({ username });
    } catch (error) {
      console.error('Ошибка при обновлении имени пользователя:', error);
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

  static async buyTicket(req, res) {
    try {
      const userId = req.user.id;
      const { eventId, seat, name, phone, email } = req.body;
      if (!eventId) {
        return res.status(400).json({ message: 'eventId обязателен' });
      }
      const ticket = await Ticket.buy(userId, eventId, seat, name, phone, email);
      res.json(ticket);
    } catch (error) {
      if (error.message && error.message.includes('Место')) {
        return res.status(409).json({ message: error.message });
      }
      console.error('Ошибка при покупке билета:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async getUserTickets(req, res) {
    try {
      const userId = req.user.id;
      const tickets = await Ticket.getByUser(userId);
      res.json(tickets);
    } catch (error) {
      console.error('Ошибка при получении билетов пользователя:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }

  static async checkAuth(req, res) {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).json({ message: 'Пользователь не найден' });
      }

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          city: user.city,
          avatarUrl: user.avatarUrl
        },
        token: req.headers.authorization.split(' ')[1]
      });
    } catch (error) {
      console.error('Ошибка при проверке аутентификации:', error);
      res.status(500).json({ message: 'Ошибка сервера' });
    }
  }
}

module.exports = AuthController; 