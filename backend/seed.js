import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import Lead from './models/Lead.js';
import User from './models/User.js';

dotenv.config();

const sampleLeads = [
  { name: 'Priya Sharma', company: 'Zenith SoftTech Pvt. Ltd.', email: 'priya.sharma@zenithsofttech.in', phone: '+91 98201 45678', status: 'New', source: 'Website', value: 180000, createdAt: '2026-06-17T09:15:00Z' },
  { name: 'Arjun Mehta', company: 'BlueRidge Analytics', email: 'arjun.mehta@blueridge.io', phone: '+91 99302 11234', status: 'New', source: 'LinkedIn', value: 95000, createdAt: '2026-06-16T14:00:00Z' },
  { name: 'Kavitha Nair', company: 'Kochi Finserve Ltd.', email: 'kavitha@kochifinserve.com', phone: '+91 94471 67890', status: 'Contacted', source: 'Cold Call', value: 240000, createdAt: '2026-06-14T11:30:00Z' },
  { name: 'Rohan Desai', company: 'Inventra Technologies', email: 'rohan.desai@inventra.tech', phone: '+91 93456 78901', status: 'Meeting Scheduled', source: 'Referral', value: 560000, createdAt: '2026-06-13T08:45:00Z' },
  { name: 'Sneha Iyer', company: 'PeakDrive Logistics', email: 'sneha.iyer@peakdrive.co.in', phone: '+91 87654 32100', status: 'Won', source: 'Email Campaign', value: 1200000, createdAt: '2026-06-10T13:00:00Z' },
  { name: 'Vikram Pillai', company: 'Orbita Cloud Services', email: 'vikram.pillai@orbita.cloud', phone: '+91 96321 09876', status: 'Lost', source: 'Other', value: 75000, createdAt: '2026-06-08T10:00:00Z' }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    const user = await User.findOne();
    if (!user) {
      console.log('No user found! Please register a user first.');
      process.exit(1);
    }

    console.log(`Found user: ${user.email}`);

    // Map the owner field
    const leadsWithOwner = sampleLeads.map(lead => ({
      ...lead,
      owner: user._id
    }));

    await Lead.insertMany(leadsWithOwner);
    console.log('Sample leads successfully inserted into the database!');
    process.exit(0);
  } catch (error) {
    console.error('Error with import:', error);
    process.exit(1);
  }
};

seedDatabase();
