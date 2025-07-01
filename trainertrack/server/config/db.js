const mongoose = require('mongoose');

const dbConfig = {
    url: 'mongodb://localhost:27017/trainertrack', // Replace with your MongoDB connection string
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    },
};

const connectDB = async () => {
    try {
        await mongoose.connect(dbConfig.url, dbConfig.options);
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = {
    dbConfig,
    connectDB,
};