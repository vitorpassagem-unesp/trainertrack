import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Ícones SVG
const ClientIcon = ({ size = 32, color = '#6366f1' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" fill={color}/>
    </svg>
);

const WorkoutIcon = ({ size = 32, color = '#10b981' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z" fill={color}/>
    </svg>
);

const MetricsIcon = ({ size = 32, color = '#f59e0b' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" fill={color}/>
    </svg>
);

const ActivityIcon = ({ size = 32, color = '#8b5cf6' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill={color}/>
    </svg>
);

const TrainerDashboardPage = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalClients: 0,
        totalWorkouts: 0,
        totalMetrics: 0,
        activeClients: 0
    });
    const [clients, setClients] = useState([]);
    const [recentWorkouts, setRecentWorkouts] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            
            // Buscar estatísticas do dashboard
            const statsResponse = await axios.get('http://localhost:5000/api/trainer/dashboard/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setStats(statsResponse.data.stats);
            setClients(statsResponse.data.clients);

            // Buscar treinos recentes
            const workoutsResponse = await axios.get('http://localhost:5000/api/trainer/workouts', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            setRecentWorkouts(workoutsResponse.data.slice(0, 5)); // Últimos 5 treinos

        } catch (error) {
            console.error('Error fetching trainer dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="trainer-dashboard">
                <h1>Painel do Personal Trainer</h1>
                <div className="loading">Carregando dados do painel...</div>
            </div>
        );
    }

    return (
        <div className="trainer-dashboard">
            <div className="dashboard-header">
                <h1>Painel do Personal Trainer</h1>
                <div className="welcome-message">
                    <h2>Bem-vindo, {user?.profile?.firstName || user?.username}!</h2>
                    <p>Gerencie seus clientes, treinos e acompanhe o progresso.</p>
                </div>
            </div>

            {/* Cards de Estatísticas */}
            <div className="trainer-stats">
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">
                            <ClientIcon size={28} color="#6366f1" />
                        </div>
                        <h3 className="stat-title">Meus Clientes</h3>
                    </div>
                    <div className="stat-value">{stats.totalClients}</div>
                    <div className="stat-subtitle">
                        {stats.activeClients} ativos
                    </div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">
                            <WorkoutIcon size={28} color="#10b981" />
                        </div>
                        <h3 className="stat-title">Treinos Criados</h3>
                    </div>
                    <div className="stat-value">{stats.totalWorkouts}</div>
                    <div className="stat-subtitle">Total de planos</div>
                </div>
                
                <div className="stat-card">
                    <div className="stat-header">
                        <div className="stat-icon">
                            <MetricsIcon size={28} color="#f59e0b" />
                        </div>
                        <h3 className="stat-title">Métricas</h3>
                    </div>
                    <div className="stat-value">{stats.totalMetrics}</div>
                    <div className="stat-subtitle">Registros corporais</div>
                </div>
                
                <Link to="/activities" className="stat-card stat-card-link">
                    <div className="stat-header">
                        <div className="stat-icon">
                            <ActivityIcon size={28} color="#8b5cf6" />
                        </div>
                        <h3 className="stat-title">Atividades</h3>
                    </div>
                    <div className="stat-subtitle">Ver histórico completo</div>
                    <span className="card-action">Ver Todas →</span>
                </Link>
            </div>

            <div className="dashboard-content">
                {/* Lista de Clientes */}
                <div className="clients-section">
                    <div className="section-header">
                        <h2>Meus Clientes</h2>
                        <Link to="/clients" className="btn btn-primary">
                            Ver Todos
                        </Link>
                    </div>
                    
                    {clients.length === 0 ? (
                        <div className="empty-state">
                            <p>Você ainda não possui clientes.</p>
                            <p>Entre em contato com o administrador para ter clientes atribuídos.</p>
                        </div>
                    ) : (
                        <div className="clients-grid">
                            {clients.slice(0, 6).map(client => (
                                <div key={client._id} className="client-card">
                                    <div className="client-info">
                                        <h3>{client.name}</h3>
                                        <p className="client-email">{client.email}</p>
                                        <div className="client-stats">
                                            <span className="workout-count">
                                                {client.workoutCount} treinos
                                            </span>
                                            <span className={`status ${client.isActive ? 'active' : 'inactive'}`}>
                                                {client.isActive ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="client-actions">
                                        <Link 
                                            to={`/clients/${client._id}`}
                                            className="btn btn-small btn-secondary"
                                        >
                                            Ver Perfil
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Treinos Recentes */}
                <div className="workouts-section">
                    <div className="section-header">
                        <h2>Treinos Recentes</h2>
                        <Link to="/workout-plan" className="btn btn-secondary">
                            Ver Todos
                        </Link>
                    </div>
                    
                    {recentWorkouts.length === 0 ? (
                        <div className="empty-state">
                            <p>Nenhum treino criado ainda.</p>
                            <Link to="/workouts/new" className="btn btn-primary">
                                Criar Primeiro Treino
                            </Link>
                        </div>
                    ) : (
                        <div className="workouts-list">
                            {recentWorkouts.map(workout => (
                                <div key={workout._id} className="workout-item">
                                    <div className="workout-info">
                                        <h4>{workout.name}</h4>
                                        <p>Cliente: {workout.client?.name || 'Não definido'}</p>
                                        <span className="workout-date">
                                            Criado em {new Date(workout.createdAt).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="workout-actions">
                                        <Link 
                                            to={`/workouts/${workout._id}`}
                                            className="btn btn-small btn-primary"
                                        >
                                            Ver Detalhes
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TrainerDashboardPage;
