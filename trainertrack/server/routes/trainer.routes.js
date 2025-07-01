const express = require('express');
const router = express.Router();
const trainerController = require('../controllers/trainer.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Apply authentication middleware to all trainer routes
router.use(authMiddleware);

// Dashboard do trainer
router.get('/dashboard/stats', trainerController.getDashboardStats);

// Clientes do trainer
router.get('/clients', trainerController.getMyClients);

// Treinos do trainer
router.get('/workouts', trainerController.getMyWorkouts);

// Atividades relacionadas ao trainer
router.get('/activities', trainerController.getMyActivities);

// Placeholder route for trainer functionality
router.get('/test', (req, res) => {
  res.status(200).json({ message: 'Trainer routes working' });
});

module.exports = router;