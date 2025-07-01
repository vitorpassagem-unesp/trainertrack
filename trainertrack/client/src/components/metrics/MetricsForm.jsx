import React, { useState } from 'react';
import { useClientContext } from '../../contexts/ClientContext';
import { createMetric } from '../../services/metrics.service';

const MetricsForm = () => {
    const { selectedClient } = useClientContext();
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');
    const [bodyFat, setBodyFat] = useState('');
    const [muscleMass, setMuscleMass] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!weight || !height || !bodyFat || !muscleMass) {
            setError('Todos os campos são obrigatórios.');
            return;
        }

        try {
            await createMetric(selectedClient.id, { weight, height, bodyFat, muscleMass });
            // Clear the form after submission
            setWeight('');
            setHeight('');
            setBodyFat('');
            setMuscleMass('');
        } catch (err) {
            setError('Erro ao registrar métricas. Tente novamente.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrar Métricas</h2>
            {error && <p className="error">{error}</p>}
            <div>
                <label>Peso (kg):</label>
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Altura (cm):</label>
                <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Percentual de Gordura (%):</label>
                <input
                    type="number"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Percentual de Massa Muscular (%):</label>
                <input
                    type="number"
                    value={muscleMass}
                    onChange={(e) => setMuscleMass(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Registrar Métricas</button>
        </form>
    );
};

export default MetricsForm;