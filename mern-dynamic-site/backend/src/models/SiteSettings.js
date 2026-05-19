const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'My Dynamic Site' },
    siteDescription: { type: String, default: 'Welcome to our website' },
    logo: { type: String, default: '' },
    heroTitle: { type: String, default: 'Welcome to Our Platform' },
    heroSubtitle: { type: String, default: 'Discover amazing content' },
    heroImage: { type: String, default: '' },
    aboutTitle: { type: String, default: 'About Us' },
    aboutContent: { type: String, default: '' },
    aboutImage: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    contactAddress: { type: String, default: '' },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    primaryColor: { type: String, default: '#6366f1' },
    secondaryColor: { type: String, default: '#8b5cf6' },
    metaKeywords: { type: String, default: '' },
    maintenanceMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
