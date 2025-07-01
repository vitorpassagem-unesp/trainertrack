import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const MyWorkoutsPage = () => {
    const { user } = useContext(AuthContext);
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyWorkouts();
    }, []);

    const fetchMyWorkouts = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/workouts/my-workouts', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar treinos');
            }

            const data = await response.json();
            setWorkouts(data);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao buscar treinos:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Carregando seus treinos...</div>;
    }

    if (error) {
        return <div className="error">Erro: {error}</div>;
    }

    return (
        <div className="my-workouts-page">
            <div className="page-header">
                <h1>Meus Treinos</h1>
                <p>Acompanhe seus planos de treino e exercícios</p>
            </div>

            {workouts.length === 0 ? (
                <div className="no-workouts">
                    <h2>Nenhum treino encontrado</h2>
                    <p>Seu treinador ainda não criou planos de treino para você.</p>
                    <p>Entre em contato com seu personal trainer para começar!</p>
                </div>
            ) : (
                <div className="workouts-list">
                    {workouts.map(workout => (
                        <div key={workout._id} className="workout-card">
                            <h3>{workout.name}</h3>
                            <p className="workout-description">{workout.description}</p>
                            <div className="workout-details">
                                <span className="workout-type">Tipo: {workout.type}</span>
                                <span className="workout-duration">Duração: {workout.duration} min</span>
                            </div>
                            {workout.exercises && workout.exercises.length > 0 && (
                                <div className="exercises">
                                    <h4>Exercícios:</h4>
                                    <ul>
                                        {workout.exercises.map((exercise, index) => (
                                            <li key={index}>
                                                <strong>{exercise.name}</strong>
                                                {exercise.sets && <span> - {exercise.sets} séries</span>}
                                                {exercise.reps && <span> x {exercise.reps} repetições</span>}
                                                {exercise.weight && <span> - {exercise.weight}kg</span>}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <div className="workout-meta">
                                <small>Criado em: {new Date(workout.createdAt).toLocaleDateString('pt-BR')}</small>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyWorkoutsPage;
