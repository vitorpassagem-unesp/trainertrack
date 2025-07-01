// server/controllers/metrics.controller.js
const Metrics = require('../models/metrics.model');
const Client = require('../models/client.model');

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
        const { clientId } = req.params;
        console.log('📊 getMetricsByClientId - Buscando métricas para cliente:', clientId);
        console.log('📊 getMetricsByClientId - User:', req.user);

        // Verificar se o cliente existe e buscar suas métricas
        const client = await Client.findById(clientId).populate('trainer');
        if (!client) {
            return res.status(404).json({ message: 'Cliente não encontrado' });
        }

        // Verificar permissões
        if (req.user.role === 'trainer') {
            // Treinador só pode ver métricas de seus próprios clientes
            console.log('🔍 Verificando permissão do treinador para métricas');
            console.log('🔍 Client trainer ID:', client.trainer?._id?.toString());
            console.log('🔍 Request user ID:', req.userId?.toString());
            
            if (client.trainer && client.trainer._id.toString() !== req.userId.toString()) {
                console.log('❌ Treinador tentando acessar métricas de cliente de outro treinador');
                return res.status(403).json({ message: 'Acesso negado: você só pode visualizar métricas de seus próprios clientes' });
            }
        } else if (req.user.role === 'user') {
            // Cliente só pode ver suas próprias métricas
            console.log('🔍 Verificando permissão do cliente para métricas');
            console.log('🔍 Client user ID:', client.user?._id?.toString());
            console.log('🔍 Request user ID:', req.userId?.toString());
            
            if (client.user && client.user._id.toString() !== req.userId.toString()) {
                console.log('❌ Cliente tentando acessar métricas de outro cliente');
                return res.status(403).json({ message: 'Acesso negado: você só pode visualizar suas próprias métricas' });
            }
        }
        // Admin pode ver qualquer métrica

        // Retornar métricas do campo metrics do cliente
        const metrics = client.metrics || [];
        
        console.log('✅ Métricas encontradas:', metrics.length);
        res.status(200).json(metrics);
    } catch (error) {
        console.error('❌ Erro em getMetricsByClientId:', error);
        res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
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
