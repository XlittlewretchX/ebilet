const express = require('express');
const router = express.Router();
const EventController = require('../controllers/eventController');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', auth, upload.single('image'), EventController.create);
router.get('/', EventController.getAll);
router.get('/:id', EventController.getById);
router.get('/user/events', auth, EventController.getByUserId);

module.exports = router; 