const Gallery = require('../models/Gallery');

// @desc    Get all gallery items
// @route   GET /api/gallery
exports.getGallery = async (req, res) => {
  try {
    const { page = 1, limit = 12, category = '' } = req.query;
    const query = { isActive: true };
    if (category) query.category = category;

    const total = await Gallery.countDocuments(query);
    const items = await Gallery.find(query)
      .populate('uploadedBy', 'name avatar')
      .sort({ order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), items });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
exports.getGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('uploadedBy', 'name avatar');

    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create gallery item
// @route   POST /api/gallery
exports.createGalleryItem = async (req, res) => {
  try {
    const { title, description, imageUrl, thumbnailUrl, publicId, category, tags, order } = req.body;
    const item = await Gallery.create({
      title,
      description,
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      publicId,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      order: order || 0,
      uploadedBy: req.user._id,
    });
    res.status(201).json({ success: true, message: 'Gallery item created', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
exports.updateGalleryItem = async (req, res) => {
  try {
    const { title, description, category, tags, isActive, order } = req.body;
    const item = await Gallery.findByIdAndUpdate(
      req.params.id,
      { title, description, category, tags: tags ? tags.split(',').map(t => t.trim()) : undefined, isActive, order },
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Gallery item updated', item });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle like
// @route   POST /api/gallery/:id/like
exports.toggleLike = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const liked = item.likes.includes(req.user._id);
    if (liked) {
      item.likes = item.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      item.likes.push(req.user._id);
    }
    await item.save();
    res.json({ success: true, liked: !liked, likesCount: item.likes.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
exports.deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });
    res.json({ success: true, message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
