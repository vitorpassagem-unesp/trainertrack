const User = require('../models/user.model');
const Client = require('../models/client.model');
const Workout = require('../models/workout.model');
const bcrypt = require('bcrypt');

// Check if user is admin middleware
exports.isAdmin = async (req, res, next) => {
    try {
        console.log('🔍 isAdmin middleware - User:', req.user);
        console.log('🔍 isAdmin middleware - User role:', req.user?.role);
        
        if (!req.user || req.user.role !== 'admin') {
            console.log('❌ Access denied - not admin');
            return res.status(403).json({ message: 'Access denied: Admin rights required' });
        }
        
        console.log('✅ Admin access granted');
        next();
    } catch (error) {
        console.error('❌ Error in isAdmin middleware:', error);
        res.status(500).json({ message: 'Server error checking admin permissions' });
    }
};

// Get dashboard statistics (admin only)
exports.getDashboardStats = async (req, res) => {
    try {
        const [userCount, trainerCount, clientCount, workoutCount] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'trainer' }),
            Client.countDocuments(),
            Workout.countDocuments()
        ]);

        // Get clients per trainer
        const clientsPerTrainer = await Client.aggregate([
            {
                $group: {
                    _id: '$trainer',
                    count: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'trainer'
                }
            },
            {
                $unwind: '$trainer'
            },
            {
                $project: {
                    trainerName: '$trainer.username',
                    clientCount: '$count'
                }
            }
        ]);

        res.json({
            totalUsers: userCount,
            totalTrainers: trainerCount,
            totalClients: clientCount,
            totalWorkouts: workoutCount,
            clientsPerTrainer
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Error fetching statistics' });
    }
};

// Get all trainers (admin only)
exports.getAllTrainers = async (req, res) => {
    try {
        const trainers = await User.find({ 
            role: 'trainer'
        }).select('-password');

        // Get client count for each trainer
        const trainersWithStats = await Promise.all(trainers.map(async (trainer) => {
            const clientCount = await Client.countDocuments({ trainer: trainer._id });
            return {
                ...trainer.toObject(),
                clientCount
            };
        }));

        res.json(trainersWithStats);
    } catch (error) {
        console.error('Error fetching trainers:', error);
        res.status(500).json({ message: 'Error fetching trainers' });
    }
};

// Get clients by trainer (admin only)
exports.getClientsByTrainer = async (req, res) => {
    try {
        const { trainerId } = req.params;
        
        const clients = await Client.find({ trainer: trainerId })
            .populate('trainer', 'username email')
            .sort({ createdAt: -1 });
        
        res.json(clients);
    } catch (error) {
        console.error('Error fetching clients by trainer:', error);
        res.status(500).json({ message: 'Error fetching clients' });
    }
};

// Create new trainer (admin only)
exports.createTrainer = async (req, res) => {
    try {
        const { username, email, password, profile } = req.body;
        
        // Check if trainer already exists
        const existingTrainer = await User.findOne({ 
            $or: [{ email }, { username }] 
        });
        
        if (existingTrainer) {
            return res.status(400).json({ message: 'Trainer already exists' });
        }
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create new trainer
        const newTrainer = new User({
            username,
            email,
            password: hashedPassword,
            role: 'trainer',
            profile: profile || {},
            isActive: true
        });
        
        await newTrainer.save();
        
        // Return trainer without password
        const { password: _, ...trainerData } = newTrainer.toObject();
        res.status(201).json(trainerData);
        
    } catch (error) {
        console.error('Error creating trainer:', error);
        res.status(500).json({ message: 'Error creating trainer' });
    }
};

// Update trainer (admin only)
exports.updateTrainer = async (req, res) => {
    try {
        const { trainerId } = req.params;
        const { username, email, profile, isActive } = req.body;
        
        // Só inclui isActive no update se for explicitamente fornecido
        const updateData = { username, email, profile };
        if (isActive !== undefined) {
            updateData.isActive = isActive;
        }
        
        const updatedTrainer = await User.findByIdAndUpdate(
            trainerId,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!updatedTrainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        res.json(updatedTrainer);
    } catch (error) {
        console.error('Error updating trainer:', error);
        res.status(500).json({ message: 'Error updating trainer' });
    }
};

// Delete trainer (admin only) - soft delete by setting isActive to false
exports.deleteTrainer = async (req, res) => {
    try {
        const { trainerId } = req.params;
        
        // Check if trainer has clients
        const clientCount = await Client.countDocuments({ trainer: trainerId });
        
        if (clientCount > 0) {
            return res.status(400).json({ 
                message: `Cannot delete trainer with ${clientCount} active clients. Please reassign clients first.` 
            });
        }
        
        const deletedTrainer = await User.findByIdAndUpdate(
            trainerId,
            { isActive: false },
            { new: true }
        ).select('-password');
        
        if (!deletedTrainer) {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        res.json({ message: 'Trainer deactivated successfully' });
    } catch (error) {
        console.error('Error deleting trainer:', error);
        res.status(500).json({ message: 'Error deleting trainer' });
    }
};

// Reassign client to different trainer (admin only)
exports.reassignClient = async (req, res) => {
    try {
        const { clientId } = req.params;
        const { newTrainerId } = req.body;
        
        // Verify new trainer exists and is active
        const newTrainer = await User.findOne({ 
            _id: newTrainerId, 
            role: { $in: ['trainer', 'user'] },
            isActive: true 
        });
        
        if (!newTrainer) {
            return res.status(404).json({ message: 'New trainer not found or inactive' });
        }
        
        const updatedClient = await Client.findByIdAndUpdate(
            clientId,
            { trainer: newTrainerId },
            { new: true }
        ).populate('trainer', 'username email');
        
        if (!updatedClient) {
            return res.status(404).json({ message: 'Client not found' });
        }
        
        res.json(updatedClient);
    } catch (error) {
        console.error('Error reassigning client:', error);
        res.status(500).json({ message: 'Error reassigning client' });
    }
};

// Get all users (admin only)
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// Update user role (admin only)
exports.updateUserRole = async (req, res) => {
    try {
        const { userId, role } = req.body;
        
        if (!['user', 'trainer', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role specified' });
        }
        
        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { role }, 
            { new: true }
        ).select('-password');
        
        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar função do usuário' });
    }
};

// Delete a user (admin only)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        
        const deletedUser = await User.findByIdAndDelete(userId);
        
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        
        res.json({ message: 'Usuário excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir usuário' });
    }
};

// Get all clients (admin only)
exports.getAllClients = async (req, res) => {
    try {
        const clients = await Client.find()
            .populate('trainer', 'username profile')
            .sort({ name: 1 });

        res.json(clients);
    } catch (error) {
        console.error('Error fetching all clients:', error);
        res.status(500).json({ message: 'Error fetching clients' });
    }
};

// Deactivate a trainer (admin only)
exports.deactivateTrainer = async (req, res) => {
    try {
        const { trainerId } = req.params;
        
        const trainer = await User.findById(trainerId);
        
        if (!trainer || trainer.role !== 'trainer') {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        // Deactivate trainer
        trainer.isActive = false;
        await trainer.save();
        
        // Optionally, you might want to reassign their clients to other trainers
        // For now, we'll just mark the trainer as inactive
        
        res.json({ message: 'Trainer deactivated successfully', trainer });
    } catch (error) {
        console.error('Error deactivating trainer:', error);
        res.status(500).json({ message: 'Error deactivating trainer' });
    }
};

// Reactivate trainer (admin only)
exports.reactivateTrainer = async (req, res) => {
    try {
        const { trainerId } = req.params;
        
        const trainer = await User.findById(trainerId);
        
        if (!trainer || trainer.role !== 'trainer') {
            return res.status(404).json({ message: 'Trainer not found' });
        }
        
        // Reactivate trainer
        trainer.isActive = true;
        await trainer.save();
        
        res.json({ message: 'Trainer reactivated successfully', trainer });
    } catch (error) {
        console.error('Error reactivating trainer:', error);
        res.status(500).json({ message: 'Error reactivating trainer' });
    }
};

// Create new client (admin only)
exports.createClient = async (req, res) => {
    try {
        const { name, email, phone, trainer, metrics } = req.body;
        
        // Validar dados obrigatórios
        if (!name || !email) {
            return res.status(400).json({ message: 'Name and email are required' });
        }
        
        // Verificar se o email já existe
        const existingClient = await Client.findOne({ email });
        if (existingClient) {
            return res.status(400).json({ message: 'Client with this email already exists' });
        }
        
        // Verificar se o treinador existe e está ativo
        if (trainer) {
            const trainerExists = await User.findOne({ 
                _id: trainer, 
                role: { $in: ['trainer', 'user'] },
                isActive: true 
            });
            
            if (!trainerExists) {
                return res.status(404).json({ message: 'Trainer not found or inactive' });
            }
        }
        
        // Criar cliente
        const newClient = new Client({
            name,
            email,
            phone: phone || '',
            trainer: trainer || null,
            metrics: metrics || []
        });
        
        await newClient.save();
        
        // Popular dados do treinador na resposta
        const populatedClient = await Client.findById(newClient._id)
            .populate('trainer', 'username email profile');
        
        res.status(201).json(populatedClient);
    } catch (error) {
        console.error('Error creating client:', error);
        res.status(500).json({ message: 'Error creating client' });
    }
};
