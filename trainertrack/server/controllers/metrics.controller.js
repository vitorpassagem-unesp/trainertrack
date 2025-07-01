// server/controllers/metrics.controller.js
const Metrics = require('../models/metrics.model');

// Create a new metric
exports.createMetric = async (req, res) => {
    try {
        const metric = new Metrics(req.body);
        await metric.save();
        res.status(201).send(metric);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Get all metrics for a client
exports.getMetricsByClientId = async (req, res) => {
    try {
        console.log('Searching metrics for clientId:', req.params.clientId);
        
        // First try to find in separate Metrics collection
        let metrics = await Metrics.find({ clientId: req.params.clientId });
        
        // If no metrics found in separate collection, try to get from client's embedded metrics
        if (!metrics || metrics.length === 0) {
            const Client = require('../models/client.model');
            const client = await Client.findById(req.params.clientId);
            if (client && client.metrics) {
                metrics = client.metrics;
            }
        }
        
        console.log('Found metrics:', metrics);
        res.status(200).send(metrics || []);
    } catch (error) {
        console.error('Error in getMetricsByClientId:', error);
        res.status(500).send({ error: error.message });
    }
};

// Get metrics for the authenticated user
exports.getMyMetrics = async (req, res) => {
    try {
        const metrics = await Metrics.find({ clientId: req.userId }).sort({ date: 1 });
        res.status(200).send(metrics);
    } catch (error) {
        console.error('Error fetching user metrics:', error);
        res.status(500).send({ error: error.message });
    }
};

// Update a metric
exports.updateMetric = async (req, res) => {
    try {
        const metric = await Metrics.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!metric) {
            return res.status(404).send();
        }
        res.status(200).send(metric);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
};

// Delete a metric
exports.deleteMetric = async (req, res) => {
    try {
        const metric = await Metrics.findByIdAndDelete(req.params.id);
        if (!metric) {
            return res.status(404).send();
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};