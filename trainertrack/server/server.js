const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const clientRoutes = require('./routes/client.routes');
const metricsRoutes = require('./routes/metrics.routes');
const workoutRoutes = require('./routes/workout.routes');
const tempRoutes = require('./routes/temp.routes');
const adminRoutes = require('./routes/admin.routes');
const trainerRoutes = require('./routes/trainer.routes');
const { dbConfig, connectDB } = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Database connection
mongoose.connect(dbConfig.url, dbConfig.options)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/workouts', workoutRoutes);
app.use('/api/temp', tempRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/trainer', trainerRoutes);

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});