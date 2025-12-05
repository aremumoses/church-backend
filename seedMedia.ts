// Script to seed the database with sample media
// Run this with: npx ts-node seedMedia.ts

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Media from './models/mediaModel';
import User from './models/userModel';

dotenv.config();

const sampleMedia = [
  // Videos
  {
    title: 'Sunday Sermon - Faith & Hope',
    description: 'A powerful message about maintaining faith during difficult times',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Faith',
  },
  {
    title: 'Bible Study Session',
    description: 'In-depth study of Romans chapter 8',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Bible Study',
  },
  {
    title: 'Marriage Counseling Series',
    description: 'Building a strong Christian marriage',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Marriage',
  },
  {
    title: 'Prayer & Fasting',
    description: 'The power of prayer in spiritual warfare',
    type: 'video',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'Prayer',
  },
  
  // Images
  {
    title: 'Sunday Service - Week 1',
    description: 'Photos from last Sunday worship service',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3',
  },
  {
    title: 'Youth Fellowship',
    description: 'Youth ministry gathering',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
  },
  {
    title: 'Church Building',
    description: 'Our beautiful church sanctuary',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1480506132288-68f7705954bd',
  },
  {
    title: 'Christmas Celebration',
    description: 'Christmas service 2024',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be',
  },
  
  // PDFs
  {
    title: 'Faith Foundations',
    description: 'A comprehensive guide to building strong faith',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
  {
    title: 'Prayer Guide',
    description: 'Daily prayer and devotional guide',
    type: 'pdf',
    url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
  },
];

async function seedMedia() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || '');
    console.log('✅ Connected to MongoDB');

    // Find an admin user to associate with the media
    const adminUser = await User.findOne({ role: 'admin' });
    
    if (!adminUser) {
      console.log('❌ No admin user found. Please create an admin user first.');
      process.exit(1);
    }

    // Clear existing media
    await Media.deleteMany({});
    console.log('🗑️  Cleared existing media');

    // Insert sample media
    const mediaWithUser = sampleMedia.map(media => ({
      ...media,
      uploaded_by: adminUser._id,
    }));

    await Media.insertMany(mediaWithUser);
    console.log(`✅ Successfully seeded ${sampleMedia.length} media items`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding media:', error);
    process.exit(1);
  }
}

seedMedia();
