import React, { useState, useEffect } from 'react';
import TrainerForm from '../components/admin/TrainerForm';

const TrainersManagementPage = () => {
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState(null);

    useEffect(() => {
        fetchTrainers();
    }, []);

    const fetchTrainers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/trainers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar treinadores');
            }

            const data = await response.json();
            setTrainers(data);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao buscar treinadores:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (trainer) => {
        setEditingTrainer(trainer);
        setShowForm(true);
    };

    const handleDeactivate = async (trainerId) => {
        if (!window.confirm('Tem certeza que deseja desativar este treinador?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/trainers/${trainerId}/deactivate`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao desativar treinador');
            }

            // Atualizar a lista
            fetchTrainers();
        } catch (err) {
            setError(err.message);
            console.error('Erro ao desativar treinador:', err);
        }
    };

    const handleReactivate = async (trainerId) => {
        if (!window.confirm('Tem certeza que deseja reativar este treinador?')) {
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/trainers/${trainerId}/reactivate`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao reativar treinador');
            }

            // Atualizar a lista
            fetchTrainers();
        } catch (err) {
            setError(err.message);
            console.error('Erro ao reativar treinador:', err);
        }
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingTrainer(null);
        fetchTrainers();
    };

    if (loading) return <div className="loading">Carregando treinadores...</div>;

    return (
        <div className="trainers-management">
            <div className="page-header">
                <h1>Gerenciar Treinadores</h1>
                <button 
                    className="btn btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    Adicionar Treinador
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <TrainerForm 
                            trainer={editingTrainer}
                            onClose={handleFormClose}
                        />
                    </div>
                </div>
            )}

            <div className="trainers-list">
                {trainers.length === 0 ? (
                    <p>Nenhum treinador encontrado.</p>
                ) : (
                    <div className="trainers-grid">
                        {trainers.map(trainer => (
                            <div key={trainer._id} className="trainer-card">
                                <div className="trainer-info">
                                    <h3>{trainer.profile?.firstName} {trainer.profile?.lastName}</h3>
                                    <p>@{trainer.username}</p>
                                    <p>{trainer.email}</p>
                                    <p>Clientes: {trainer.clientCount || 0}</p>
                                    <p className={`status ${trainer.isActive ? 'active' : 'inactive'}`}>
                                        {trainer.isActive ? 'Ativo' : 'Inativo'}
                                    </p>
                                </div>
                                <div className="trainer-actions">
                                    <button 
                                        className="btn btn-secondary"
                                        onClick={() => handleEdit(trainer)}
                                    >
                                        Editar
                                    </button>
                                    {trainer.isActive ? (
                                        <button 
                                            className="btn btn-danger"
                                            onClick={() => handleDeactivate(trainer._id)}
                                        >
                                            Desativar
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn btn-success"
                                            onClick={() => handleReactivate(trainer._id)}
                                        >
                                            Reativar
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrainersManagementPage;
