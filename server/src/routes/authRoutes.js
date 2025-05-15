const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/check', auth, AuthController.checkAuth);
router.post('/avatar', auth, upload.single('avatar'), async (req, res) => {
  try {
    const avatarUrl = `/uploads/${req.file.filename}`;
    await User.updateAvatar(req.user.id, avatarUrl);
    res.json({ avatarUrl });
  } catch (error) {
    console.error('Ошибка при загрузке аватара:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

router.patch('/city', auth, AuthController.updateCity);

router.post('/favorite', auth, AuthController.addFavorite);
router.delete('/favorite', auth, AuthController.removeFavorite);
router.get('/favorites', auth, AuthController.getFavorites);

router.post('/buy-ticket', auth, AuthController.buyTicket);
router.get('/my-tickets', auth, AuthController.getUserTickets);

module.exports = router; 