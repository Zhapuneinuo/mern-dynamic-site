const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    publicId: { type: String }, // Cloudinary public_id
    category: {
      type: String,
      enum: ['all', 'Team', 'Laptops', 'Smartphones', 'Tablets & ipads', 'Printers', 'Storage & Networking', 'Camera & smart devices', 'Audio', 'other'],
      default: 'other',
    },
    tags: [{ type: String }],
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isActive: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Gallery', gallerySchema);
