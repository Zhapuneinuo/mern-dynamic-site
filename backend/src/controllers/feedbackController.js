const Feedback = require('../models/Feedback');

// @desc    Submit feedback
// @route   POST /api/feedback
exports.createFeedback = async (req, res) => {
  try {
    const { name, email, subject, message, rating, type } = req.body;
    const feedback = await Feedback.create({
      name,
      email,
      subject,
      message,
      rating,
      type,
      user: req.user ? req.user._id : undefined,
    });
    res.status(201).json({ success: true, message: 'Feedback submitted successfully!', feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all feedback (admin)
// @route   GET /api/feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '', type = '' } = req.query;
    const query = {};
    if (status) query.status = status;
    if (type) query.type = type;

    const total = await Feedback.countDocuments(query);
    const feedbacks = await Feedback.find(query)
      .populate('user', 'name email avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get public testimonials
// @route   GET /api/feedback/public
exports.getPublicTestimonials = async (req, res) => {
  try {
    const testimonials = await Feedback.find({ isPublic: true, type: 'testimonial' })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name message rating createdAt');
    res.json({ success: true, testimonials });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update feedback status (admin)
// @route   PUT /api/feedback/:id
exports.updateFeedback = async (req, res) => {
  try {
    const { status, adminReply, isPublic } = req.body;
    const feedback = await Feedback.findByIdAndUpdate(
      req.params.id,
      { status, adminReply, isPublic },
      { new: true }
    );
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });
    res.json({ success: true, message: 'Feedback updated', feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete feedback (admin)
// @route   DELETE /api/feedback/:id
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    if (!feedback) return res.status(404).json({ success: false, message: 'Feedback not found' });
    res.json({ success: true, message: 'Feedback deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
