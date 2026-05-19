const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    type: {
      type: String,
      enum: ['feedback', 'testimonial', 'complaint', 'suggestion'],
      default: 'feedback',
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
    isPublic: { type: Boolean, default: false },
    adminReply: { type: String, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Feedback', feedbackSchema);
