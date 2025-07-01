import React, { useContext, useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { ClientContext } from '../contexts/ClientContext';
import clientService from '../services/client.service';
import MetricsHistory from '../components/metrics/MetricsHistory';
import WorkoutHistory from '../components/workouts/WorkoutHistory';

// Ícone SVG para o botão de voltar
const BackIcon = ({ size = 24, color = '#6b7280' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={color}/>
    </svg>
);

// Ícone para cliente
const ClientIcon = ({ size = 32, color = '#6366f1' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" fill={color}/>
    </svg>
);

const ClientDetailPage = () => {
    const { clientId } = useParams();
    const history = useHistory();
    const { clients } = useContext(ClientContext);
    const [client, setClient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClientDetails = async () => {
            try {
                const response = await clientService.getClientById(clientId);
                console.log('📊 Dados do cliente recebidos:', response);
                
                // Se response já é o cliente (não tem .data), usar diretamente
                const clientData = response.data || response;
                console.log('📊 Dados do cliente processados:', clientData);
                console.log('📊 Métricas do cliente:', clientData.metrics);
                console.log('📊 Tem métricas?', clientData.metrics && clientData.metrics.length > 0);
                
                setClient(clientData);
            } catch (err) {
                console.error('❌ Erro ao buscar cliente:', err);
                setError('Falha ao carregar detalhes do cliente');
            } finally {
                setLoading(false);
            }
        };

        fetchClientDetails();
    }, [clientId]);

    if (loading) {
        return (
            <div className="trainer-dashboard">
                <div className="loading">Carregando detalhes do cliente...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="trainer-dashboard">
                <div className="dashboard-header">
                    <div className="header-actions">
                        <button 
                            className="back-button"
                            onClick={() => history.goBack()}
                            title="Voltar"
                        >
                            <BackIcon size={20} />
                            Voltar
                        </button>
                    </div>
                    <h1>Erro ao carregar cliente</h1>
                </div>
                <div className="error-message">{error}</div>
            </div>
        );
    }

    return (
        <div className="trainer-dashboard">
            <div className="dashboard-header">
                <div className="header-actions">
                    <button 
                        className="back-button"
                        onClick={() => history.goBack()}
                        title="Voltar"
                    >
                        <BackIcon size={20} />
                        Voltar
                    </button>
                </div>
                <h1>Detalhes do Cliente</h1>
                {client && (
                    <div className="welcome-message">
                        <h2>
                            <ClientIcon size={24} color="#6366f1" />
                            {client.name}
                        </h2>
                        <p>Visualize o histórico completo de treinos e métricas</p>
                    </div>
                )}
            </div>

            {client && (
                <div className="client-details-content">
                    {/* Card com informações básicas */}
                    <div className="trainer-stats">
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3 className="stat-title">Informações do Cliente</h3>
                            </div>
                            <div className="client-info-grid">
                                <div className="info-item">
                                    <span className="info-label">Nome:</span>
                                    <span className="info-value">{client.name}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Email:</span>
                                    <span className="info-value">{client.email}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Telefone:</span>
                                    <span className="info-value">{client.phone}</span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Cliente desde:</span>
                                    <span className="info-value">
                                        {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Card com métricas físicas mais recentes */}
                        {(() => {
                            console.log('🔍 Verificando métricas:', {
                                hasClient: !!client,
                                hasMetrics: client?.metrics,
                                metricsLength: client?.metrics?.length,
                                metricsData: client?.metrics
                            });
                            
                            return client.metrics && client.metrics.length > 0 ? (
                                <div className="stat-card">
                                    <div className="stat-header">
                                        <h3 className="stat-title">Métricas Mais Recentes</h3>
                                        <span className="stat-subtitle">
                                            {new Date(client.metrics[client.metrics.length - 1].date).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                    <div className="client-info-grid">
                                        <div className="info-item">
                                            <span className="info-label">Peso:</span>
                                            <span className="info-value">
                                                {client.metrics[client.metrics.length - 1].weight} kg
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Altura:</span>
                                            <span className="info-value">
                                                {client.metrics[client.metrics.length - 1].height} cm
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Gordura Corporal:</span>
                                            <span className="info-value">
                                                {client.metrics[client.metrics.length - 1].bodyFatPercentage}%
                                            </span>
                                        </div>
                                        <div className="info-item">
                                            <span className="info-label">Massa Muscular:</span>
                                            <span className="info-value">
                                                {client.metrics[client.metrics.length - 1].muscleMassPercentage}%
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="stat-card">
                                    <div className="stat-header">
                                        <h3 className="stat-title">Métricas Físicas</h3>
                                    </div>
                                    <div className="empty-state">
                                        <p>📊 Nenhuma métrica registrada ainda</p>
                                        <p className="text-muted">As métricas físicas aparecerão aqui quando forem registradas.</p>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Card com resumo estatístico */}
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3 className="stat-title">Resumo de Atividades</h3>
                            </div>
                            <div className="client-info-grid">
                                <div className="info-item">
                                    <span className="info-label">Total de Métricas:</span>
                                    <span className="info-value">
                                        {client.metrics ? client.metrics.length : 0}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Planos de Treino:</span>
                                    <span className="info-value">
                                        {client.workoutPlans ? client.workoutPlans.length : 0}
                                    </span>
                                </div>
                                <div className="info-item">
                                    <span className="info-label">Status:</span>
                                    <span className="info-value">
                                        <span className={`status-badge ${client.isActive !== false ? 'active' : 'inactive'}`}>
                                            {client.isActive !== false ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </span>
                                </div>
                                {client.metrics && client.metrics.length > 0 && (
                                    <div className="info-item">
                                        <span className="info-label">Última Atualização:</span>
                                        <span className="info-value">
                                            {new Date(client.metrics[client.metrics.length - 1].date).toLocaleDateString('pt-BR')}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Seções de histórico */}
                    <div className="client-history-sections">
                        <div className="history-section">
                            <div className="section-header">
                                <h3>Histórico de Métricas</h3>
                            </div>
                            <div className="section-content">
                                <MetricsHistory clientId={clientId} />
                            </div>
                        </div>

                        <div className="history-section">
                            <div className="section-header">
                                <h3>Histórico de Treinos</h3>
                            </div>
                            <div className="section-content">
                                <WorkoutHistory clientId={clientId} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDetailPage;