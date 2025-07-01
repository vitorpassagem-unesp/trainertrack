import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Redirect, Link } from 'react-router-dom';
import axios from 'axios';
import AdminClientForm from '../components/admin/AdminClientForm';
import TrainerForm from '../components/admin/TrainerForm';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTrainers: 0,
        totalClients: 0,
        totalWorkouts: 0,
        clientsPerTrainer: []
    });
    const [trainers, setTrainers] = useState([]);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [trainerClients, setTrainerClients] = useState([]);
    const [showClientForm, setShowClientForm] = useState(false);
    const [showTrainerForm, setShowTrainerForm] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState(null);

    // If user is not admin, redirect to regular dashboard
    if (user && user.role !== 'admin') {
        return <Redirect to="/" />;
    }

    const fetchDashboardStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
        }
    };

    const fetchTrainers = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/admin/trainers', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrainers(response.data);
        } catch (error) {
            console.error('Error fetching trainers:', error);
        }
    };

    const fetchTrainerClients = async (trainerId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/admin/trainers/${trainerId}/clients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrainerClients(response.data);
        } catch (error) {
            console.error('Error fetching trainer clients:', error);
        }
    };

    const handleTrainerEdit = (trainer, e) => {
        e.stopPropagation();
        setEditingTrainer(trainer);
        setShowTrainerForm(true);
    };

    const handleTrainerSelect = async (trainer) => {
        setSelectedTrainer(trainer);
        await fetchTrainerClients(trainer._id);
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([
                fetchDashboardStats(),
                fetchTrainers()
            ]);
            setLoading(false);
        };

        loadData();
    }, []);

    if (loading) {
        return (
            <div className="admin-dashboard">
                <h1>Painel Administrativo</h1>
                <div className="loading">Carregando dados do painel...</div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Painel Administrativo</h1>
                <div className="admin-actions">
                    <Link to="/admin/trainers/new" className="btn btn-primary">
                        Adicionar Personal
                    </Link>
                    <Link to="/admin/users" className="btn btn-secondary">
                        Gerenciar Usuários
                    </Link>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="admin-stats">
                <div className="stat-card">
                    <h3>Total de Usuários</h3>
                    <div className="stat-value">{stats.totalUsers}</div>
                </div>
                
                <div className="stat-card">
                    <h3>Personal Trainers</h3>
                    <div className="stat-value">{stats.totalTrainers}</div>
                </div>
                
                <div className="stat-card">
                    <h3>Total de Clientes</h3>
                    <div className="stat-value">{stats.totalClients}</div>
                </div>
                
                <div className="stat-card">
                    <h3>Planos de Treino</h3>
                    <div className="stat-value">{stats.totalWorkouts}</div>
                </div>
            </div>

            <div className="admin-content">
                {/* Trainers List */}
                <div className="trainers-section">
                    <h2>Personal Trainers</h2>
                    <div className="trainers-grid">
                        {trainers.map(trainer => (
                            <div 
                                key={trainer._id} 
                                className={`trainer-card ${selectedTrainer?._id === trainer._id ? 'selected' : ''}`}
                                onClick={() => handleTrainerSelect(trainer)}
                            >
                                <h3>{trainer.username}</h3>
                                <p className="trainer-email">{trainer.email}</p>
                                <div className="trainer-stats">
                                    <span className="client-count">
                                        {trainer.clientCount} clientes
                                    </span>
                                    <span className={`status ${trainer.isActive ? 'active' : 'inactive'}`}>
                                        {trainer.isActive ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                <div className="trainer-actions">
                                    <button 
                                        className="btn btn-small btn-secondary"
                                        onClick={(e) => handleTrainerEdit(trainer, e)}
                                    >
                                        Editar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Selected Trainer's Clients */}
                {selectedTrainer && (
                    <div className="trainer-clients-section">
                        <h2>Clientes de {selectedTrainer.username}</h2>
                        
                        <div className="section-actions">
                            <button 
                                className="btn btn-primary"
                                onClick={() => setShowClientForm(true)}
                            >
                                Adicionar Cliente
                            </button>
                        </div>

                        {trainerClients.length === 0 ? (
                            <p className="no-clients">Este personal ainda não possui clientes.</p>
                        ) : (
                            <div className="clients-table">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Nome</th>
                                            <th>Email</th>
                                            <th>Telefone</th>
                                            <th>Data de Cadastro</th>
                                            <th>Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {trainerClients.map(client => (
                                            <tr key={client._id}>
                                                <td>{client.name}</td>
                                                <td>{client.email}</td>
                                                <td>{client.phone}</td>
                                                <td>{new Date(client.createdAt).toLocaleDateString('pt-BR')}</td>
                                                <td>
                                                    <div className="client-actions">
                                                        <Link 
                                                            to={`/clients/${client._id}`}
                                                            className="btn btn-small btn-secondary"
                                                        >
                                                            Ver
                                                        </Link>
                                                        <Link 
                                                            to={`/clients/${client._id}/edit`}
                                                            className="btn btn-small btn-primary"
                                                        >
                                                            Editar
                                                        </Link>
                                                        <button 
                                                            className="btn btn-small btn-warning"
                                                            onClick={() => {/* TODO: Implementar reatribuição */}}
                                                        >
                                                            Reatribuir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Quick Stats per Trainer */}
            {stats.clientsPerTrainer.length > 0 && (
                <div className="trainer-stats-section">
                    <h2>Distribuição de Clientes</h2>
                    <div className="stats-chart">
                        {stats.clientsPerTrainer.map((item, index) => (
                            <div key={index} className="stat-item">
                                <span className="trainer-name">{item.trainerName}</span>
                                <span className="client-count">{item.clientCount} clientes</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modal para adicionar cliente */}
            {showClientForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <AdminClientForm 
                            trainerId={selectedTrainer?._id}
                            onClose={() => {
                                setShowClientForm(false);
                                // Recarregar clientes do treinador selecionado
                                if (selectedTrainer) {
                                    fetchTrainerClients(selectedTrainer._id);
                                }
                            }}
                        />
                    </div>
                </div>
            )}

            {/* Modal para editar trainer */}
            {showTrainerForm && editingTrainer && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <TrainerForm 
                            trainer={editingTrainer}
                            onClose={() => {
                                setShowTrainerForm(false);
                                setEditingTrainer(null);
                                // Recarregar lista de trainers
                                fetchTrainers();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;