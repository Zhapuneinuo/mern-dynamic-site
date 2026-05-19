const SiteSettings = require('../models/SiteSettings');

// @desc    Get site settings (public)
// @route   GET /api/settings
exports.getSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) settings = await SiteSettings.create({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update site settings (admin)
// @route   PUT /api/settings
exports.updateSettings = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create(req.body);
    } else {
      Object.assign(settings, req.body);
      await settings.save();
    }
    res.json({ success: true, message: 'Settings updated', settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
