// server/controllers/client.controller.js
const Client = require('../models/client.model');
const User = require('../models/user.model');

// Create a new client
exports.createClient = async (req, res) => {
    try {
        const client = new Client(req.body);
        await client.save();
        res.status(201).send(client);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get all clients
exports.getClients = async (req, res) => {
    try {
        const clients = await Client.find();
        res.status(200).send(clients);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a client by ID
exports.getClientById = async (req, res) => {
    try {
        const client = await Client.findById(req.params.id);
        if (!client) {
            return res.status(404).send();
        }
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a client by ID
exports.updateClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!client) {
            return res.status(404).send();
        }
        res.status(200).send(client);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a client by ID
exports.deleteClient = async (req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) {
            return res.status(404).send();
        }
        res.status(200).send(client);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get current user's trainer info
exports.getMyTrainer = async (req, res) => {
    try {
        console.log('Getting trainer for user:', req.user.id);
        
        // Find client by user ID
        const client = await Client.findOne({ user: req.user.id })
            .populate('trainer', 'username email profile');
        
        if (!client) {
            return res.status(404).json({ 
                error: 'Cliente não encontrado',
                message: 'Dados do cliente não encontrados para este usuário' 
            });
        }
        
        if (!client.trainer) {
            return res.status(404).json({ 
                error: 'Treinador não atribuído',
                message: 'Nenhum treinador foi atribuído a este cliente' 
            });
        }
        
        res.status(200).json(client.trainer);
    } catch (error) {
        console.error('Erro ao buscar treinador:', error);
        res.status(500).json({ 
            error: 'Erro interno do servidor',
            message: 'Falha ao carregar dados do treinador' 
        });
    }
};