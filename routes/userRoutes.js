const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/authMiddleware');

router.get('/saved', auth, userController.getSavedArticles);
router.post('/save/:articleId', auth, userController.saveArticle);
router.delete('/remove/:articleId', auth, userController.removeArticle);
router.put('/preferences', auth, userController.updatePreferences);

module.exports = router;
