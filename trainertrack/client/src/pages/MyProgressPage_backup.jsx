import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import EvolutionChart from '../components/charts/EvolutionChart';
import MetricsHistory from '../components/metrics/MetricsHistory';
import WorkoutHistory from '../components/workouts/WorkoutHistory';

const MyProgressPage = () => {
    const { user } = useContext(AuthContext);
    const [clientData, setClientData] = useState(null);
    const [metrics, setMetrics] = useState([]);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyProgress();
    }, []);

    const fetchMyProgress = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Buscar dados do cliente
            const response = await fetch('http://localhost:5000/api/clients/my-data', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar dados de progresso');
            }

            const data = await response.json();
            console.log('📊 Dados recebidos do cliente:', data);
            setClientData(data);
            setMetrics(data.metrics || []);

        } catch (err) {
            setError(err.message);
            console.error('Erro ao buscar progresso:', err);
        } finally {
            setLoading(false);
        }
    };

    const calculateBMI = (weight, height) => {
        if (!weight || !height) return null;
        return Math.round(weight / (height * height));
    };

    const getBMICategory = (bmi) => {
        if (bmi < 18.5) return 'Abaixo do peso';
        if (bmi < 25) return 'Peso normal';
        if (bmi < 30) return 'Sobrepeso';
        return 'Obesidade';
    };

    const getBMIColor = (bmi) => {
        if (bmi < 18.5) return '#f39c12';
        if (bmi < 25) return '#27ae60';
        if (bmi < 30) return '#f39c12';
        return '#e74c3c';
    };

    if (loading) {
        return (
            <div className="my-progress-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Carregando seu progresso...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-progress-page">
                <div className="error-banner">
                    <span>⚠️</span>
                    <span>Erro: {error}</span>
                </div>
            </div>
        );
    }

    const latestMetrics = metrics.length > 0 ? metrics[metrics.length - 1] : null;
    const currentBMI = latestMetrics ? calculateBMI(latestMetrics.weight, latestMetrics.height) : null;

    return (
        <div className="my-progress-page">
            <div className="dashboard-header">
                <div className="header-content">
                    <div className="client-avatar">
                        <div className="avatar-circle">
                            {(clientData?.name || user?.name)?.charAt(0).toUpperCase()}
                        </div>
                        <div className="client-info">
                            <h1>Meu Progresso</h1>
                            <p>Olá, {clientData?.name || user?.name}!</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="main-content-grid">
                {/* Estatísticas Atuais */}
                <div className="content-section">
                    <div className="section-header">
                        <h2>📊 Dados Atuais</h2>
                        <p>Suas métricas mais recentes</p>
                    </div>
                    
                    {latestMetrics ? (
                        <div className="stats-grid">
                            <div className="stat-card">
                                <div className="stat-icon">⚖️</div>
                                <div className="stat-content">
                                    <h3>Peso</h3>
                                    <span className="stat-value">{Math.round(latestMetrics.weight)} kg</span>
                                </div>
                            </div>
                            
                            <div className="stat-card">
                                <div className="stat-icon">📏</div>
                                <div className="stat-content">
                                    <h3>Altura</h3>
                                    <span className="stat-value">{latestMetrics.height}m</span>
                                </div>
                            </div>
                            
                            {currentBMI && (
                                <div className="stat-card">
                                    <div className="stat-icon">📊</div>
                                    <div className="stat-content">
                                        <h3>IMC</h3>
                                        <span className="stat-value" style={{ color: getBMIColor(parseFloat(currentBMI)) }}>
                                            {currentBMI}
                                        </span>
                                        <small>{getBMICategory(parseFloat(currentBMI))}</small>
                                    </div>
                                </div>
                            )}
                            
                            {latestMetrics.bodyFatPercentage && (
                                <div className="stat-card">
                                    <div className="stat-icon">🔥</div>
                                    <div className="stat-content">
                                        <h3>Gordura Corporal</h3>
                                        <span className="stat-value">{Math.round(latestMetrics.bodyFatPercentage)}%</span>
                                    </div>
                                </div>
                            )}
                            
                            {latestMetrics.muscleMassPercentage && (
                                <div className="stat-card">
                                    <div className="stat-icon">💪</div>
                                    <div className="stat-content">
                                        <h3>Massa Muscular</h3>
                                        <span className="stat-value">{Math.round(latestMetrics.muscleMassPercentage)}%</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">📊</div>
                            <h4>Nenhuma métrica registrada</h4>
                            <p>Suas métricas aparecerão aqui quando forem adicionadas pelo seu treinador</p>
                        </div>
                    )}
                </div>

                {/* Gráficos de Evolução */}
                {metrics.length >= 2 && (
                    <div className="content-section">
                        <div className="section-header">
                            <h2>📈 Evolução</h2>
                            <p>Acompanhe seu progresso ao longo do tempo</p>
                        </div>
                        
                        <div className="charts-grid">
                            <div className="chart-card">
                                <h3>Evolução do Peso</h3>
                                <EvolutionChart 
                                    data={metrics} 
                                    metric="weight" 
                                    title="Peso (kg)" 
                                    color="#3498db" 
                                    unit="kg"
                                />
                            </div>
                            
                            {metrics.some(m => m.bodyFatPercentage) && (
                                <div className="chart-card">
                                    <h3>% Gordura Corporal</h3>
                                    <EvolutionChart 
                                        data={metrics.filter(m => m.bodyFatPercentage)} 
                                        metric="bodyFatPercentage" 
                                        title="Gordura (%)" 
                                        color="#e74c3c" 
                                        unit="%"
                                    />
                                </div>
                            )}
                            
                            {metrics.some(m => m.muscleMassPercentage) && (
                                <div className="chart-card">
                                    <h3>% Massa Muscular</h3>
                                    <EvolutionChart 
                                        data={metrics.filter(m => m.muscleMassPercentage)} 
                                        metric="muscleMassPercentage" 
                                        title="Músculo (%)" 
                                        color="#27ae60" 
                                        unit="%"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Histórico Detalhado */}
                <div className="content-section">
                    <div className="section-header">
                        <h2>📋 Histórico de Métricas</h2>
                        <p>Detalhamento completo das suas medições</p>
                    </div>
                    <MetricsHistory metrics={metrics} />
                </div>

                {/* Treinos */}
                <div className="content-section">
                    <div className="section-header">
                        <h2>💪 Meus Treinos</h2>
                        <p>Planos de treino atribuídos pelo seu treinador</p>
                    </div>
                    <WorkoutHistory clientId={clientData?._id || clientData?.id} />
                </div>
            </div>
        </div>
    );
};

export default MyProgressPage;
