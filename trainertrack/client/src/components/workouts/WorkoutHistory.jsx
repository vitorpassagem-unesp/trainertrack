import React, { useEffect, useState } from 'react';
import { getWorkoutsByClientId } from '../../services/workout.service';

const WorkoutHistory = ({ clientId }) => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWorkoutHistory = async () => {
            if (!clientId) {
                setLoading(false);
                return;
            }

            try {
                const response = await getWorkoutsByClientId(clientId);
                setWorkouts(Array.isArray(response) ? response : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkoutHistory();
    }, [clientId]);

    if (loading) {
        return <div className="loading">Carregando histórico de treinos...</div>;
    }

    if (error) {
        return <div className="error-message">Erro ao carregar treinos: {error}</div>;
    }

    if (!workouts || workouts.length === 0) {
        return (
            <div className="empty-state">
                <p>Nenhum treino encontrado para este cliente.</p>
            </div>
        );
    }

    return (
        <div className="workout-history">
            <div className="workouts-list">
                {workouts.map((workout, index) => (
                    <div key={workout._id || workout.id || index} className="workout-item">
                        <div className="workout-header">
                            <h4>{workout.title || workout.name || 'Treino sem título'}</h4>
                            {workout.date && (
                                <span className="workout-date">
                                    {new Date(workout.date).toLocaleDateString('pt-BR')}
                                </span>
                            )}
                        </div>
                        {workout.description && (
                            <p className="workout-description">{workout.description}</p>
                        )}
                        {workout.exercises && workout.exercises.length > 0 && (
                            <div className="exercises-summary">
                                <span className="exercises-count">
                                    {workout.exercises.length} exercício(s)
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WorkoutHistory;