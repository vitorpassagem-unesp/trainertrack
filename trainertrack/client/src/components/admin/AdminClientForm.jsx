import React, { useState } from 'react';
import axios from 'axios';

const AdminClientForm = ({ trainerId, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        // Initial metrics
        weight: '',
        height: '',
        bodyFatPercentage: '',
        muscleMassPercentage: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validations
        if (!formData.name || !formData.email) {
            setError('Nome e email são obrigatórios');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            
            // Preparar dados do cliente
            const clientData = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                trainer: trainerId
            };

            // Adicionar métricas se fornecidas
            if (formData.weight || formData.height || formData.bodyFatPercentage || formData.muscleMassPercentage) {
                clientData.metrics = [{
                    weight: formData.weight ? parseFloat(formData.weight) : undefined,
                    height: formData.height ? parseFloat(formData.height) : undefined,
                    bodyFatPercentage: formData.bodyFatPercentage ? parseFloat(formData.bodyFatPercentage) : undefined,
                    muscleMassPercentage: formData.muscleMassPercentage ? parseFloat(formData.muscleMassPercentage) : undefined,
                    date: new Date()
                }];
            }

            // Criar cliente via API admin
            await axios.post('http://localhost:5000/api/admin/clients', clientData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onClose(); // Fechar modal e atualizar lista
        } catch (error) {
            console.error('Error creating client:', error);
            setError(error.response?.data?.message || 'Erro ao criar cliente');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="client-form-modal">
            <div className="form-header">
                <h2>Adicionar Novo Cliente</h2>
                <button 
                    onClick={onClose}
                    className="btn btn-secondary close-btn"
                    type="button"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleSubmit} className="client-form">
                {error && <div className="error-message">{error}</div>}

                <div className="form-section">
                    <h3>Informações Básicas</h3>
                    
                    <div className="form-group">
                        <label htmlFor="name">Nome Completo *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Ex: João Silva"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Ex: joao@email.com"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Telefone</label>
                        <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Ex: (11) 99999-9999"
                        />
                    </div>
                </div>

                <div className="form-section">
                    <h3>Métricas Iniciais (Opcional)</h3>
                    
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="weight">Peso (kg)</label>
                            <input
                                type="number"
                                id="weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                placeholder="Ex: 70.5"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="height">Altura (m)</label>
                            <input
                                type="number"
                                id="height"
                                name="height"
                                value={formData.height}
                                onChange={handleChange}
                                step="0.01"
                                min="0"
                                placeholder="Ex: 1.75"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="bodyFatPercentage">% Gordura Corporal</label>
                            <input
                                type="number"
                                id="bodyFatPercentage"
                                name="bodyFatPercentage"
                                value={formData.bodyFatPercentage}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                max="100"
                                placeholder="Ex: 15.5"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="muscleMassPercentage">% Massa Muscular</label>
                            <input
                                type="number"
                                id="muscleMassPercentage"
                                name="muscleMassPercentage"
                                value={formData.muscleMassPercentage}
                                onChange={handleChange}
                                step="0.1"
                                min="0"
                                max="100"
                                placeholder="Ex: 45.2"
                            />
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button 
                        type="button" 
                        onClick={onClose}
                        className="btn btn-secondary"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading ? 'Criando...' : 'Criar Cliente'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AdminClientForm;
