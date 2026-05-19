require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const SiteSettings = require('../models/SiteSettings');
const Gallery = require('../models/Gallery');

const connectDB = async () => {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mern_dynamic_site');
  console.log('MongoDB connected');
};

const seed = async () => {
  await connectDB();

  // Clear existing
  await User.deleteMany({});
  await SiteSettings.deleteMany({});
  await Gallery.deleteMany({});

  // Create admin
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@demo.com',
    password: 'admin123',
    role: 'admin',
    bio: 'Site administrator',
  });
  console.log('✅ Admin created: admin@demo.com / admin123');

  // Create demo user
  await User.create({
    name: 'Demo User',
    email: 'user@demo.com',
    password: 'user1234',
    role: 'user',
    bio: 'Regular user account',
  });
  console.log('✅ User created: user@demo.com / user1234');

  // Site settings
  await SiteSettings.create({
    siteName: 'DynaSite',
    siteDescription: 'A full-featured MERN stack dynamic website.',
    heroTitle: 'Build Something Amazing',
    heroSubtitle: 'A production-ready MERN stack with admin panel, gallery, feedback, and more.',
    aboutTitle: 'About Us',
    aboutContent: 'We are a team passionate about building great web experiences.',
    contactEmail: 'hello@dynasite.com',
    contactPhone: '+1 (555) 000-0000',
    contactAddress: '123 Main St, San Francisco, CA',
    primaryColor: '#6366f1',
  });
  console.log('✅ Site settings seeded');

  // Sample gallery items
  const galleryItems = [
    { title: 'Mountain Vista', category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', description: 'Beautiful mountain landscape' },
    { title: 'City Skyline', category: 'architecture', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800', description: 'Urban city skyline at dusk' },
    { title: 'Ocean Waves', category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800', description: 'Peaceful ocean waves' },
    { title: 'Modern Architecture', category: 'architecture', imageUrl: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800', description: 'Contemporary building design' },
    { title: 'Forest Path', category: 'nature', imageUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800', description: 'Serene forest walkway' },
    { title: 'Portrait Study', category: 'people', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800', description: 'Creative portrait photography' },
  ];

  for (const item of galleryItems) {
    await Gallery.create({ ...item, uploadedBy: admin._id, thumbnailUrl: item.imageUrl });
  }
  console.log('✅ Gallery items seeded');

  console.log('\n🚀 Seed complete!');
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
