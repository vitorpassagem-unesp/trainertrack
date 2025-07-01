// server/routes/client.routes.js
const express = require('express');
const router = express.Router();
const clientController = require('../controllers/client.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Route to create a new client
router.post('/', clientController.createClient);

// Route to get all clients
router.get('/', clientController.getClients);

// Route to get current user's trainer info
router.get('/my-trainer', authMiddleware, clientController.getMyTrainer);

// Route to get a specific client by ID
router.get('/:id', clientController.getClientById);

// Route to update a client by ID
router.put('/:id', clientController.updateClient);

// Route to delete a client by ID
router.delete('/:id', clientController.deleteClient);

module.exports = router;