const mongoose = require('mongoose');

const trainerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    clients: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client',
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Trainer = mongoose.model('Trainer', trainerSchema);

module.exports = Trainer;