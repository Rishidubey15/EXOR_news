const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const auth = require('../middleware/authMiddleware');

router.get('/', newsController.getAllNews);
router.get('/personalized', auth, newsController.getPersonalizedNews);
// Allow authenticated users to upload an article link
router.post('/upload', auth, newsController.uploadArticle);
router.get('/:id', newsController.getNewsById);
router.post('/:id/summarize', newsController.generateSummary);

module.exports = router;
