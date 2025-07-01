const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const authMiddleware = require('../middleware/auth.middleware');

// All admin routes require authentication and admin role
router.use(authMiddleware);
router.use(adminController.isAdmin);

// Dashboard routes
router.get('/dashboard/stats', adminController.getDashboardStats);

// Trainer management routes
router.get('/trainers', adminController.getAllTrainers);
router.post('/trainers', adminController.createTrainer);
router.put('/trainers/:trainerId', adminController.updateTrainer);
router.put('/trainers/:trainerId/deactivate', adminController.deactivateTrainer);
router.put('/trainers/:trainerId/reactivate', adminController.reactivateTrainer);
router.delete('/trainers/:trainerId', adminController.deleteTrainer);

// Client management routes
router.get('/clients', adminController.getAllClients);
router.post('/clients', adminController.createClient);
router.get('/trainers/:trainerId/clients', adminController.getClientsByTrainer);
router.put('/clients/:clientId/reassign', adminController.reassignClient);

// General user management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

module.exports = router;
