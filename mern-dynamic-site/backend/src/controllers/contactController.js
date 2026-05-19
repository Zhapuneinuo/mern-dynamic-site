const Contact = require('../models/Contact');

// @desc    Submit contact form
// @route   POST /api/contact
exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    const contact = await Contact.create({
      name,
      email,
      phone,
      subject,
      message,
      ip: req.ip,
    });

    // TODO: Send email notification to admin
    res.status(201).json({ success: true, message: 'Message sent successfully! We will get back to you soon.', contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all contacts (admin)
// @route   GET /api/contact
exports.getAllContacts = async (req, res) => {
  try {
    const { page = 1, limit = 10, status = '' } = req.query;
    const query = {};
    if (status) query.status = status;

    const total = await Contact.countDocuments(query);
    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), pages: Math.ceil(total / limit), contacts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update contact status / reply (admin)
// @route   PUT /api/contact/:id
exports.updateContact = async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const update = { status };
    if (adminReply) {
      update.adminReply = adminReply;
      update.repliedAt = new Date();
    }
    const contact = await Contact.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Contact updated', contact });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete contact (admin)
// @route   DELETE /api/contact/:id
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: 'Contact not found' });
    res.json({ success: true, message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
