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
}

module.exports = AuthController; 