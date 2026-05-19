const express = require('express');
const router = express.Router();
const { createFeedback, getAllFeedback, getPublicTestimonials, updateFeedback, deleteFeedback } = require('../controllers/feedbackController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/public', getPublicTestimonials);
router.post('/', optionalAuth, createFeedback);
router.get('/', protect, authorize('admin'), getAllFeedback);
router.put('/:id', protect, authorize('admin'), updateFeedback);
router.delete('/:id', protect, authorize('admin'), deleteFeedback);

module.exports = router;
