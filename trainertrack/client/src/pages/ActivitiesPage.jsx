import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

// Ícones SVG
const ActivityIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z" fill={color}/>
    </svg>
);

const UserIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" fill={color}/>
    </svg>
);

const WorkoutIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z" fill={color}/>
    </svg>
);

const MetricsIcon = ({ size = 16, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" fill={color}/>
    </svg>
);

const ActivitiesPage = () => {
    const { user } = useContext(AuthContext);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchActivities();
    }, [user]);

    const fetchActivities = async () => {
        try {
            setLoading(true);
            
            // Se for trainer, buscar atividades específicas do trainer
            if (user?.role === 'trainer') {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5000/api/trainer/activities', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                console.log('Activities from API:', response.data);
                
                // Mapear os dados da API para o formato esperado
                const formattedActivities = response.data.map(activity => {
                    // Garantir que o timestamp seja uma data válida
                    const timestamp = activity.timestamp ? new Date(activity.timestamp) : new Date();
                    
                    return {
                        ...activity,
                        timestamp: timestamp,
                        iconComponent: activity.type === 'workout' ? WorkoutIcon : 
                                     activity.type === 'metrics' ? MetricsIcon : 
                                     activity.type === 'client' ? UserIcon : ActivityIcon,
                        color: activity.type === 'workout' ? '#3B82F6' : 
                               activity.type === 'metrics' ? '#8B5CF6' : 
                               activity.type === 'client' ? '#F59E0B' : '#10B981'
                    };
                });
                
                setActivities(formattedActivities);
            } else {
                // Para admin ou outros roles, usar dados mock
                const mockActivities = generateMockActivities();
                setActivities(mockActivities);
            }
        } catch (error) {
            console.error('Erro ao buscar atividades:', error);
            // Fallback para dados mock em caso de erro
            const mockActivities = generateMockActivities();
            setActivities(mockActivities);
        } finally {
            setLoading(false);
        }
    };

    const generateMockActivities = () => {
        const now = new Date();
        const activities = [];

        if (user?.role === 'admin') {
            // Atividades para admin - visão geral do sistema
            activities.push(
                {
                    id: 1,
                    type: 'login',
                    title: 'Login realizado',
                    description: 'Usuário fez login no sistema',
                    user: user?.profile?.firstName || 'Usuário',
                    timestamp: new Date(now - 1000 * 60 * 15), // 15 min atrás
                    iconComponent: UserIcon,
                    color: '#10B981'
                },
                {
                    id: 2,
                    type: 'workout',
                    title: 'Novo treino criado',
                    description: 'Treino A - Peito e Tríceps foi criado para Diego Barbosa',
                    user: 'Carlos Silva',
                    timestamp: new Date(now - 1000 * 60 * 45), // 45 min atrás
                    iconComponent: WorkoutIcon,
                    color: '#3B82F6'
                },
                {
                    id: 3,
                    type: 'metrics',
                    title: 'Métrica atualizada',
                    description: 'Maria Oliveira registrou peso: 64.2kg',
                    user: 'Maria Oliveira',
                    timestamp: new Date(now - 1000 * 60 * 90), // 1.5h atrás
                    iconComponent: MetricsIcon,
                    color: '#8B5CF6'
                },
                {
                    id: 4,
                    type: 'client',
                    title: 'Novo cliente adicionado',
                    description: 'João Fernandes foi adicionado como cliente',
                    user: 'Ana Costa',
                    timestamp: new Date(now - 1000 * 60 * 120), // 2h atrás
                    iconComponent: UserIcon,
                    color: '#F59E0B'
                },
                {
                    id: 5,
                    type: 'workout',
                    title: 'Treino completado',
                    description: 'Lucas Almeida completou Treino B - Costas e Bíceps',
                    user: 'Lucas Almeida',
                    timestamp: new Date(now - 1000 * 60 * 180), // 3h atrás
                    icon: WorkoutIcon,
                    color: '#10B981'
                },
                {
                    id: 6,
                    type: 'system',
                    title: 'Backup realizado',
                    description: 'Backup automático do banco de dados foi concluído',
                    user: 'Sistema',
                    timestamp: new Date(now - 1000 * 60 * 240), // 4h atrás
                    icon: ActivityIcon,
                    color: '#6B7280'
                }
            );
        } else if (user?.role === 'trainer') {
            // Atividades para trainer - apenas relacionadas aos seus clientes
            activities.push(
                {
                    id: 1,
                    type: 'login',
                    title: 'Login realizado',
                    description: 'Você fez login no sistema',
                    user: user?.profile?.firstName || 'Você',
                    timestamp: new Date(now - 1000 * 60 * 15), // 15 min atrás
                    icon: UserIcon,
                    color: '#10B981'
                },
                {
                    id: 2,
                    type: 'workout',
                    title: 'Treino criado',
                    description: 'Você criou um novo treino para seu cliente',
                    user: 'Você',
                    timestamp: new Date(now - 1000 * 60 * 45), // 45 min atrás
                    icon: WorkoutIcon,
                    color: '#3B82F6'
                },
                {
                    id: 3,
                    type: 'metrics',
                    title: 'Cliente registrou progresso',
                    description: 'Um de seus clientes atualizou suas métricas corporais',
                    user: 'Cliente',
                    timestamp: new Date(now - 1000 * 60 * 90), // 1.5h atrás
                    icon: MetricsIcon,
                    color: '#8B5CF6'
                },
                {
                    id: 4,
                    type: 'workout',
                    title: 'Treino executado',
                    description: 'Cliente completou treino de peito e tríceps',
                    user: 'Cliente',
                    timestamp: new Date(now - 1000 * 60 * 180), // 3h atrás
                    icon: WorkoutIcon,
                    color: '#10B981'
                }
            );
        } else {
            // Atividades para cliente - apenas relacionadas a ele mesmo
            activities.push(
                {
                    id: 1,
                    type: 'login',
                    title: 'Login realizado',
                    description: 'Você fez login no sistema',
                    user: user?.profile?.firstName || 'Você',
                    timestamp: new Date(now - 1000 * 60 * 15), // 15 min atrás
                    icon: UserIcon,
                    color: '#10B981'
                },
                {
                    id: 2,
                    type: 'workout',
                    title: 'Treino visualizado',
                    description: 'Você visualizou seu plano de treino',
                    user: 'Você',
                    timestamp: new Date(now - 1000 * 60 * 45), // 45 min atrás
                    icon: WorkoutIcon,
                    color: '#3B82F6'
                },
                {
                    id: 3,
                    type: 'metrics',
                    title: 'Progresso atualizado',
                    description: 'Você atualizou suas métricas corporais',
                    user: 'Você',
                    timestamp: new Date(now - 1000 * 60 * 90), // 1.5h atrás
                    icon: MetricsIcon,
                    color: '#8B5CF6'
                }
            );
        }

        return activities;
    };

    const formatTimestamp = (timestamp) => {
        if (!timestamp) return 'Data não disponível';
        
        let timestampDate;
        
        // Se já é um objeto Date
        if (timestamp instanceof Date) {
            timestampDate = timestamp;
        } else {
            // Tentar converter string ou número para Date
            timestampDate = new Date(timestamp);
        }
        
        // Verificar se a data é válida
        if (isNaN(timestampDate.getTime())) {
            console.warn('Invalid timestamp:', timestamp);
            return 'Data inválida';
        }
        
        const now = new Date();
        const diffMs = now - timestampDate;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHours < 24) return `${diffHours}h atrás`;
        if (diffDays < 7) return `${diffDays}d atrás`;
        
        return timestampDate.toLocaleDateString('pt-BR');
    };

    const filteredActivities = activities.filter(activity => {
        if (filter === 'all') return true;
        return activity.type === filter;
    });

    const getFilterButtons = () => {
        const filters = [
            { key: 'all', label: 'Todas', count: activities.length },
            { key: 'workout', label: 'Treinos', count: activities.filter(a => a.type === 'workout').length },
            { key: 'metrics', label: 'Métricas', count: activities.filter(a => a.type === 'metrics').length },
            { key: 'client', label: 'Clientes', count: activities.filter(a => a.type === 'client').length },
            { key: 'login', label: 'Login', count: activities.filter(a => a.type === 'login').length }
        ];

        return filters;
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Carregando atividades...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="page-header">
                <div className="header-content">
                    <div className="header-info">
                        <ActivityIcon size={24} color="#3B82F6" />
                        <div>
                            <h1>Atividades Recentes</h1>
                            <p>Acompanhe as atividades e eventos do sistema</p>
                        </div>
                    </div>
                </div>
            </div>

                <div className="page-content">
                    {/* Filtros */}
                    <div className="activities-filters">
                        {getFilterButtons().map((filterOption) => (
                            <button
                                key={filterOption.key}
                                className={`filter-button ${filter === filterOption.key ? 'active' : ''}`}
                                onClick={() => setFilter(filterOption.key)}
                            >
                                {filterOption.label}
                                <span className="filter-count">{filterOption.count}</span>
                            </button>
                        ))}
                    </div>

                    {/* Lista de Atividades */}
                    <div className="activities-list">
                        {filteredActivities.length === 0 ? (
                            <div className="empty-state">
                                <ActivityIcon size={48} color="#9CA3AF" />
                                <h3>Nenhuma atividade encontrada</h3>
                                <p>Não há atividades para o filtro selecionado.</p>
                            </div>
                        ) : (
                            filteredActivities.map((activity) => (
                                <div key={activity.id} className="activity-card">
                                    <div className="activity-icon" style={{ backgroundColor: activity.color + '20' }}>
                                        {React.createElement(activity.iconComponent || ActivityIcon, { 
                                            size: 20, 
                                            color: activity.color 
                                        })}
                                    </div>
                                    <div className="activity-content">
                                        <div className="activity-header">
                                            <h4>{activity.title}</h4>
                                            <span className="activity-time">
                                                {formatTimestamp(activity.timestamp)}
                                            </span>
                                        </div>
                                        <p className="activity-description">{activity.description}</p>
                                        <div className="activity-user">
                                            <UserIcon size={14} color="#6B7280" />
                                            <span>{activity.user}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
    );
};

export default ActivitiesPage;
