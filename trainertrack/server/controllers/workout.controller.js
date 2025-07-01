// server/controllers/workout.controller.js

const Workout = require('../models/workout.model');
const Client = require('../models/client.model');

// Create a new workout plan
exports.createWorkout = async (req, res) => {
    try {
        const workout = new Workout(req.body);
        await workout.save();
        res.status(201).send(workout);
    } catch (error) {
        res.status(400).send({ error: 'Error creating workout plan' });
    }
};

// Get all workout plans
exports.getAllWorkouts = async (req, res) => {
    try {
        const workouts = await Workout.find();
        res.status(200).send(workouts);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching workout plans' });
    }
};

// Get current user's workouts
exports.getMyWorkouts = async (req, res) => {
    try {
        console.log('Getting workouts for user:', req.user.id);
        console.log('req.user:', req.user);
        
        // Try both possible user ID fields
        const userId = req.user.id || req.user._id || req.userId;
        console.log('Using userId:', userId);
        
        // Find the client data for this user
        const client = await Client.findOne({ user: userId });
        console.log('Found client:', client);
        
        if (!client) {
            // Try to find by email as fallback
            const clientByEmail = await Client.findOne({ email: req.user.email });
            console.log('Found client by email:', clientByEmail);
            
            if (clientByEmail) {
                // Find workouts assigned to this client
                const workouts = await Workout.find({ clientId: clientByEmail._id });
                return res.status(200).json(workouts);
            }
            
            return res.status(404).json({ message: 'Dados de cliente não encontrados' });
        }
        
        // Find workouts assigned to this client
        const workouts = await Workout.find({ clientId: client._id });
        
        res.status(200).json(workouts);
    } catch (error) {
        console.error('Error in getMyWorkouts:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Get a workout plan by ID
exports.getWorkoutById = async (req, res) => {
    try {
        const workout = await Workout.findById(req.params.id);
        if (!workout) {
            return res.status(404).send({ error: 'Workout not found' });
        }
        res.status(200).send(workout);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching workout plan' });
    }
};

// Update a workout plan by ID
exports.updateWorkout = async (req, res) => {
    try {
        const workout = await Workout.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!workout) {
            return res.status(404).send({ error: 'Workout not found' });
        }
        res.status(200).send(workout);
    } catch (error) {
        res.status(400).send({ error: 'Error updating workout plan' });
    }
};

// Get workouts by client ID
exports.getWorkoutsByClientId = async (req, res) => {
    try {
        const { clientId } = req.params;
        console.log('🏋️ getWorkoutsByClientId - Buscando treinos para cliente:', clientId);
        console.log('🏋️ getWorkoutsByClientId - User:', req.user);

        // Verificar se o cliente existe
        const client = await Client.findById(clientId).populate('trainer');
        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        // Verificar permissões
        if (req.user.role === 'trainer') {
            // Treinador só pode ver treinos de seus próprios clientes
            console.log('🔍 Verificando permissão do treinador para treinos');
            console.log('🔍 Client trainer ID:', client.trainer?._id?.toString());
            console.log('🔍 Request user ID:', req.userId?.toString());
            
            if (client.trainer && client.trainer._id.toString() !== req.userId.toString()) {
                console.log('❌ Treinador tentando acessar treinos de cliente de outro treinador');
                return res.status(403).json({ message: 'Acesso negado: você só pode visualizar treinos de seus próprios clientes' });
            }
        } else if (req.user.role === 'user') {
            // Cliente só pode ver seus próprios treinos
            console.log('🔍 Verificando permissão do cliente para treinos');
            console.log('🔍 Client user ID:', client.user?._id?.toString());
            console.log('🔍 Request user ID:', req.userId?.toString());
            
            if (client.user && client.user._id.toString() !== req.userId.toString()) {
                console.log('❌ Cliente tentando acessar treinos de outro cliente');
                return res.status(403).json({ message: 'Acesso negado: você só pode visualizar seus próprios treinos' });
            }
        }
        // Admin pode ver qualquer treino

        // Buscar treinos do cliente
        const workouts = await Workout.find({ clientId: clientId })
            .populate('trainerId', 'username email profile')
            .sort({ createdAt: -1 });

        console.log('✅ Treinos encontrados:', workouts.length);
        res.status(200).json(workouts);
    } catch (error) {
        console.error('❌ Erro em getWorkoutsByClientId:', error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
    }
};

// Delete a workout plan by ID
exports.deleteWorkout = async (req, res) => {
    try {
        const workout = await Workout.findByIdAndDelete(req.params.id);
        if (!workout) {
            return res.status(404).send({ error: 'Workout not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: 'Error deleting workout plan' });
    }
};