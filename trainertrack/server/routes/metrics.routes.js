const express = require('express');
const router = express.Router();
const metricsController = require('../controllers/metrics.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Route to get metrics for the authenticated user
router.get('/', authMiddleware, metricsController.getMyMetrics);

// Route to create a new metric
router.post('/', metricsController.createMetric);

// Route to get all metrics for a specific client
router.get('/:clientId', metricsController.getMetricsByClientId);

// Route to update a specific metric
router.put('/:metricId', metricsController.updateMetric);

// Route to delete a specific metric
router.delete('/:metricId', metricsController.deleteMetric);

module.exports = router;