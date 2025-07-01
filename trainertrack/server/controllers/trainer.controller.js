const User = require('../models/user.model');
const Client = require('../models/client.model');
const Workout = require('../models/workout.model');
const Metrics = require('../models/metrics.model');

// Obter estatísticas do dashboard do trainer
const getDashboardStats = async (req, res) => {
    try {
        const trainerId = req.user._id;

        // Buscar clientes do trainer
        const clients = await Client.find({ trainer: trainerId }).populate('user', 'username email');
        
        // Buscar treinos criados pelo trainer
        const workouts = await Workout.find({ trainerId: trainerId });
        
        // Buscar métricas dos clientes do trainer
        const clientIds = clients.map(client => client._id);
        const metrics = await Metrics.find({ client: { $in: clientIds } });

        // Calcular estatísticas
        const stats = {
            totalClients: clients.length,
            totalWorkouts: workouts.length,
            totalMetrics: metrics.length,
            activeClients: clients.filter(client => client.isActive !== false).length
        };

        res.json({
            stats,
            clients: clients.map(client => ({
                _id: client._id,
                name: client.name,
                email: client.email,
                phone: client.phone,
                isActive: client.isActive !== false,
                createdAt: client.createdAt,
                workoutCount: workouts.filter(w => w.clientId && w.clientId.toString() === client._id.toString()).length
            }))
        });

    } catch (error) {
        console.error('Error fetching trainer dashboard stats:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Obter clientes do trainer
const getMyClients = async (req, res) => {
    try {
        const trainerId = req.user._id;
        
        const clients = await Client.find({ trainer: trainerId })
            .populate('user', 'username email')
            .populate('workoutPlans')
            .sort({ createdAt: -1 });

        // Buscar métricas separadas para cada cliente e incluí-las
        const clientsWithMetrics = await Promise.all(clients.map(async (client) => {
            const clientObj = client.toObject();
            
            // Buscar métricas da coleção separada
            const separateMetrics = await Metrics.find({ clientId: client._id })
                .sort({ date: 1 });
            
            // Se tem métricas separadas, usar elas; senão usar as embutidas
            if (separateMetrics.length > 0) {
                clientObj.metrics = separateMetrics.map(metric => ({
                    date: metric.date,
                    weight: metric.weight,
                    height: metric.height,
                    bodyFatPercentage: metric.bodyFatPercentage,
                    muscleMassPercentage: metric.muscleMassPercentage,
                    notes: metric.notes
                }));
            }
            
            // Adicionar informações da métrica mais recente
            if (clientObj.metrics && clientObj.metrics.length > 0) {
                const latestMetric = clientObj.metrics[clientObj.metrics.length - 1];
                clientObj.latestMetrics = {
                    weight: latestMetric.weight,
                    height: latestMetric.height,
                    bodyFatPercentage: latestMetric.bodyFatPercentage,
                    muscleMassPercentage: latestMetric.muscleMassPercentage,
                    date: latestMetric.date
                };
            }
            
            return clientObj;
        }));

        res.json(clientsWithMetrics);
    } catch (error) {
        console.error('Error fetching trainer clients:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Obter treinos do trainer
const getMyWorkouts = async (req, res) => {
    try {
        const trainerId = req.user._id;
        
        const workouts = await Workout.find({ trainerId: trainerId })
            .populate('clientId', 'name email')
            .sort({ createdAt: -1 });

        res.json(workouts.map(workout => ({
            ...workout.toObject(),
            client: workout.clientId // Mapear clientId para client para compatibilidade
        })));
    } catch (error) {
        console.error('Error fetching trainer workouts:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

// Obter atividades relacionadas ao trainer
const getMyActivities = async (req, res) => {
    try {
        const trainerId = req.user._id;
        
        // Buscar clientes do trainer
        const clients = await Client.find({ trainer: trainerId }).populate('user', 'username');
        const clientIds = clients.map(client => client._id);
        
        // Buscar treinos do trainer
        const workouts = await Workout.find({ trainerId: trainerId })
            .populate('clientId', 'name')
            .sort({ createdAt: -1 })
            .limit(10);
        
        // Buscar métricas dos clientes do trainer
        const metrics = await Metrics.find({ client: { $in: clientIds } })
            .populate('client', 'name')
            .sort({ createdAt: -1 })
            .limit(10);

        // Combinar e formatar atividades
        const activities = [];

        // Adicionar atividades de treinos
        workouts.forEach(workout => {
            activities.push({
                id: `workout_${workout._id}`,
                type: 'workout',
                title: 'Treino criado',
                description: `${workout.name} foi criado para ${workout.clientId?.name || 'Cliente'}`,
                user: workout.clientId?.name || 'Cliente',
                timestamp: workout.createdAt,
                relatedTo: 'trainer'
            });
        });

        // Adicionar atividades de métricas
        metrics.forEach(metric => {
            activities.push({
                id: `metrics_${metric._id}`,
                type: 'metrics',
                title: 'Métrica registrada',
                description: `${metric.client?.name || 'Cliente'} registrou peso: ${metric.weight}kg`,
                user: metric.client?.name || 'Cliente',
                timestamp: metric.createdAt,
                relatedTo: 'trainer'
            });
        });

        // Ordenar por data mais recente
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        res.json(activities.slice(0, 20)); // Retornar apenas as 20 mais recentes

    } catch (error) {
        console.error('Error fetching trainer activities:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
};

module.exports = {
    getDashboardStats,
    getMyClients,
    getMyWorkouts,
    getMyActivities
};
