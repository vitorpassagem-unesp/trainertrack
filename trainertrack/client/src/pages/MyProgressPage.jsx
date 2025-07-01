import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Ícones SVG minimalistas
const WeightIcon = ({ size = 24, color = '#6366f1' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z" fill={color}/>
    </svg>
);

const ChartIcon = ({ size = 24, color = '#10b981' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" fill={color}/>
    </svg>
);

const BodyIcon = ({ size = 24, color = '#f59e0b' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,1A3,3 0 0,1 15,4A3,3 0 0,1 12,7A3,3 0 0,1 9,4A3,3 0 0,1 12,1M21,9V7L19,8V6H5V8L3,7V9L5,10V19A2,2 0 0,0 7,21H10V19H7.5L8.5,11H15.5L16.5,19H14V21H17A2,2 0 0,0 19,19V10L21,9Z" fill={color}/>
    </svg>
);

const CalendarIcon = ({ size = 24, color = '#8b5cf6' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19,3H18V1H16V3H8V1H6V3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V8H19V19Z" fill={color}/>
    </svg>
);

const MyProgressPage = () => {
    const { user } = useContext(AuthContext);
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMetrics();
    }, []);

    const fetchMetrics = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/metrics', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setMetrics(data || []);
            } else {
                console.log('Nenhuma métrica encontrada ou erro na resposta');
                setMetrics([]);
            }
        } catch (err) {
            console.error('Erro ao buscar métricas:', err);
            setError('Erro ao carregar dados');
            setMetrics([]);
        } finally {
            setLoading(false);
        }
    };

    const getLatestMetrics = () => {
        if (metrics.length === 0) return null;
        return metrics[metrics.length - 1];
    };

    const getPreviousMetrics = () => {
        if (metrics.length < 2) return null;
        return metrics[metrics.length - 2];
    };

    const calculateChange = (current, previous, field) => {
        if (!current || !previous || !current[field] || !previous[field]) return null;
        return current[field] - previous[field];
    };

    const formatChange = (change) => {
        if (change === null) return '--';
        return change > 0 ? `+${change.toFixed(1)}` : change.toFixed(1);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    const latest = getLatestMetrics();
    const previous = getPreviousMetrics();

    if (loading) {
        return (
            <div className="progress-page">
                <div className="loading-state">Carregando...</div>
            </div>
        );
    }

    return (
        <div className="progress-page">
            <div className="page-header">
                <h1>Meu Progresso</h1>
                <p>Acompanhe sua evolução e métricas corporais</p>
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            <div className="progress-grid">
                {/* Card de Peso */}
                <div className="metric-card">
                    <div className="card-header">
                        <div className="card-icon">
                            <WeightIcon />
                        </div>
                        <h3>Peso Atual</h3>
                    </div>
                    <div className="card-content">
                        <div className="metric-value">
                            {latest?.weight ? `${latest.weight} kg` : '--'}
                        </div>
                        {previous && (
                            <div className="metric-change">
                                {formatChange(calculateChange(latest, previous, 'weight'))} kg
                            </div>
                        )}
                        {latest?.date && (
                            <div className="metric-date">
                                Última medição: {formatDate(latest.date)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Card de Gordura Corporal */}
                <div className="metric-card">
                    <div className="card-header">
                        <div className="card-icon">
                            <ChartIcon />
                        </div>
                        <h3>Gordura Corporal</h3>
                    </div>
                    <div className="card-content">
                        <div className="metric-value">
                            {latest?.bodyFatPercentage ? `${latest.bodyFatPercentage}%` : '--'}
                        </div>
                        {previous && (
                            <div className="metric-change">
                                {formatChange(calculateChange(latest, previous, 'bodyFatPercentage'))}%
                            </div>
                        )}
                        {latest?.date && (
                            <div className="metric-date">
                                Última medição: {formatDate(latest.date)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Card de Massa Muscular */}
                <div className="metric-card">
                    <div className="card-header">
                        <div className="card-icon">
                            <BodyIcon />
                        </div>
                        <h3>Massa Muscular</h3>
                    </div>
                    <div className="card-content">
                        <div className="metric-value">
                            {latest?.muscleMassPercentage ? `${latest.muscleMassPercentage}%` : '--'}
                        </div>
                        {previous && (
                            <div className="metric-change">
                                {formatChange(calculateChange(latest, previous, 'muscleMassPercentage'))}%
                            </div>
                        )}
                        {latest?.date && (
                            <div className="metric-date">
                                Última medição: {formatDate(latest.date)}
                            </div>
                        )}
                    </div>
                </div>

                {/* Card de Histórico */}
                <div className="metric-card">
                    <div className="card-header">
                        <div className="card-icon">
                            <CalendarIcon />
                        </div>
                        <h3>Histórico</h3>
                    </div>
                    <div className="card-content">
                        <div className="metric-value">
                            {metrics.length} registros
                        </div>
                        <div className="metric-description">
                            Total de medições realizadas
                        </div>
                    </div>
                </div>
            </div>

            {/* Histórico de Métricas */}
            {metrics.length > 0 && (
                <div className="history-section">
                    <h2>Histórico de Medições</h2>
                    <div className="history-table">
                        <div className="table-header">
                            <span>Data</span>
                            <span>Peso</span>
                            <span>Gordura</span>
                            <span>Músculo</span>
                        </div>
                        {metrics.slice(-10).reverse().map((metric, index) => (
                            <div key={metric._id || index} className="table-row">
                                <span>{formatDate(metric.date)}</span>
                                <span>{metric.weight ? `${metric.weight} kg` : '--'}</span>
                                <span>{metric.bodyFatPercentage ? `${metric.bodyFatPercentage}%` : '--'}</span>
                                <span>{metric.muscleMassPercentage ? `${metric.muscleMassPercentage}%` : '--'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {metrics.length === 0 && !loading && (
                <div className="empty-state">
                    <h3>Nenhuma medição encontrada</h3>
                    <p>Entre em contato com seu treinador para registrar suas primeiras métricas.</p>
                </div>
            )}
        </div>
    );
};

export default MyProgressPage;
