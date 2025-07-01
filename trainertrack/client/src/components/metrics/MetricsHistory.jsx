import React, { useEffect, useState } from 'react';
import { getMetricsByClientId } from '../../services/metrics.service';

const MetricsHistory = ({ clientId }) => {
    const [metrics, setMetrics] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getMetrics = async () => {
            if (!clientId) {
                setLoading(false);
                return;
            }

            try {
                const data = await getMetricsByClientId(clientId);
                setMetrics(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getMetrics();
    }, [clientId]);

    if (loading) {
        return <div className="loading">Carregando histórico de métricas...</div>;
    }

    if (error) {
        return <div className="error-message">Erro ao carregar métricas: {error}</div>;
    }

    if (!metrics || metrics.length === 0) {
        return (
            <div className="empty-state">
                <p>Nenhuma métrica encontrada para este cliente.</p>
            </div>
        );
    }

    return (
        <div className="metrics-history">
            <div className="metrics-table-container">
                <table className="metrics-table">
                    <thead>
                        <tr>
                            <th>Data</th>
                            <th>Peso (kg)</th>
                            <th>Altura (cm)</th>
                            <th>Gordura (%)</th>
                            <th>Massa Muscular (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {metrics.map((metric, index) => (
                            <tr key={metric._id || metric.id || index}>
                                <td>
                                    {metric.date ? 
                                        new Date(metric.date).toLocaleDateString('pt-BR') : 
                                        'Data não informada'
                                    }
                                </td>
                                <td>{metric.weight || '-'}</td>
                                <td>{metric.height || '-'}</td>
                                <td>{metric.bodyFatPercentage || metric.bodyFat || '-'}</td>
                                <td>{metric.muscleMassPercentage || metric.muscleMass || '-'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MetricsHistory;