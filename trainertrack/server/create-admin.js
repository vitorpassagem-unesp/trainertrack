// Utility script to create admin user
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { dbConfig } = require('./config/db');

// Import User model
const User = require('./models/user.model');

async function createAdminUser() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbConfig.url, dbConfig.options);
        console.log('Connected to MongoDB');

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@test.com' });
        
        if (existingAdmin) {
            console.log('Admin user already exists. Updating role to admin...');
            existingAdmin.role = 'admin';
            await existingAdmin.save();
            console.log('Admin role updated successfully');
        } else {
            // Create admin user
            console.log('Creating admin user...');
            
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('admin123', salt);
            
            // Create and save the admin user
            const adminUser = new User({
                username: 'admin',
                email: 'admin@test.com',
                password: hashedPassword,
                role: 'admin',
                profile: {
                    firstName: 'Admin',
                    lastName: 'Sistema'
                }
            });
            
            await adminUser.save();
            console.log('Admin user created successfully!');
        }

        console.log('\nAdmin credentials:');
        console.log('Email: admin@test.com');
        console.log('Password: admin123');
        
    } catch (error) {
        console.error('Error creating admin user:', error);
    } finally {
        // Disconnect from database
        mongoose.disconnect();
    }
}

// Run the function
createAdminUser();
