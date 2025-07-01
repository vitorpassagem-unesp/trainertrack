const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Client'
    },
    date: {
        type: Date,
        default: Date.now
    },
    weight: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    bodyFatPercentage: {
        type: Number,
        required: true
    },
    muscleMassPercentage: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Metrics', metricsSchema);