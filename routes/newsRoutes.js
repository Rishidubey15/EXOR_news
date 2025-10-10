const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/authMiddleware');

router.get('/', newsController.getAllNews);
router.get('/personalized', auth, newsController.getPersonalizedNews);
router.get('/:id', newsController.getNewsById);
router.post('/:id/summarize', newsController.generateSummary);

module.exports = router;
