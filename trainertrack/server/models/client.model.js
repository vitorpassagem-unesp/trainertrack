const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    trainer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    metrics: [{
        date: {
            type: Date,
            default: Date.now,
        },
        weight: {
            type: Number,
            required: true,
        },
        height: {
            type: Number,
            required: true,
        },
        bodyFatPercentage: {
            type: Number,
            required: true,
        },
        muscleMassPercentage: {
            type: Number,
            required: true,
        },
    }],
    workoutPlans: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Client', clientSchema);