const express = require('express');
const router = express.Router();
const { getGallery, getGalleryItem, createGalleryItem, updateGalleryItem, toggleLike, deleteGalleryItem } = require('../controllers/galleryController');
const { protect, authorize, optionalAuth } = require('../middleware/auth');

router.get('/', getGallery);
router.get('/:id', optionalAuth, getGalleryItem);
router.post('/', protect, authorize('admin'), createGalleryItem);
router.put('/:id', protect, authorize('admin'), updateGalleryItem);
router.post('/:id/like', protect, toggleLike);
router.delete('/:id', protect, authorize('admin'), deleteGalleryItem);

module.exports = router;
