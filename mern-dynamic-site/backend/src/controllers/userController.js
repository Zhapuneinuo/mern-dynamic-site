const User = require('../models/User');

// @desc    Get all users (admin)
// @route   GET /api/users
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '' } = req.query;
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    if (role) query.role = role;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      users,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single user
// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user (admin)
// @route   PUT /api/users/:id
exports.updateUser = async (req, res) => {
  try {
    const { name, email, role, isActive } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, role, isActive },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User updated', user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete user (admin)
// @route   DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/users/stats
exports.getDashboardStats = async (req, res) => {
  try {
    const Feedback = require('../models/Feedback');
    const Gallery = require('../models/Gallery');
    const Contact = require('../models/Contact');

    const [totalUsers, totalFeedback, totalGallery, totalContacts, recentUsers, pendingFeedback, newContacts] =
      await Promise.all([
        User.countDocuments(),
        Feedback.countDocuments(),
        Gallery.countDocuments({ isActive: true }),
        Contact.countDocuments(),
        User.find().sort({ createdAt: -1 }).limit(5).select('name email role createdAt avatar'),
        Feedback.countDocuments({ status: 'pending' }),
        Contact.countDocuments({ status: 'new' }),
      ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalFeedback,
        totalGallery,
        totalContacts,
        pendingFeedback,
        newContacts,
      },
      recentUsers,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
