import React, { useState, useEffect } from 'react';

// Ícones SVG simples
const WorkoutIcon = ({ size = 20, color = '#6366f1' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z" fill={color}/>
    </svg>
);

const ExerciseIcon = ({ size = 16, color = '#10b981' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.4,10H16.6L19,7.6L16.6,5.2L14.2,7.6L9.8,7.6L7.4,5.2L5,7.6L7.4,10M16.6,14L14.2,16.4L9.8,16.4L7.4,14L5,16.4L7.4,18.8L16.6,18.8L19,16.4L16.6,14Z" fill={color}/>
    </svg>
);

const TimeIcon = ({ size = 16, color = '#8b5cf6' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.7L16.2,16.2Z" fill={color}/>
    </svg>
);

const WorkoutPlan = ({ plans = [] }) => {
    const [expandedPlans, setExpandedPlans] = useState(new Set());

    const toggleExpand = (planId) => {
        const newExpanded = new Set(expandedPlans);
        if (newExpanded.has(planId)) {
            newExpanded.delete(planId);
        } else {
            newExpanded.add(planId);
        }
        setExpandedPlans(newExpanded);
    };

    const formatExerciseDetails = (exercise) => {
        const details = [];
        if (exercise.sets) details.push(`${exercise.sets} séries`);
        if (exercise.reps) details.push(`${exercise.reps} rep`);
        if (exercise.weight) details.push(`${exercise.weight}kg`);
        if (exercise.duration) details.push(`${exercise.duration} min`);
        if (exercise.rest) details.push(`${exercise.rest}s descanso`);
        return details.join(' • ');
    };

    if (!plans || plans.length === 0) {
        return (
            <div className="workout-plans-container">
                <div className="plans-header">
                    <div className="header-content">
                        <div className="header-info">
                            <WorkoutIcon size={24} />
                            <div>
                                <h1>Planos de Treino</h1>
                                <p>Seus treinos personalizados</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="empty-state">
                    <WorkoutIcon size={48} color="#9ca3af" />
                    <h3>Nenhum plano de treino encontrado</h3>
                    <p>Você ainda não possui planos de treino configurados. Entre em contato com seu personal trainer para criar seus treinos.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="workout-plans-container">
            <div className="plans-header">
                <div className="header-content">
                    <div className="header-info">
                        <WorkoutIcon size={24} />
                        <div>
                            <h1>Planos de Treino</h1>
                            <p>Seus treinos personalizados</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="plans-content">
                <div className="plans-list">
                    {plans.map((plan, index) => {
                        const isExpanded = expandedPlans.has(plan._id || plan.id || index);
                        const exercises = plan.exercises || [];
                        
                        return (
                            <div key={plan._id || plan.id || index} className="workout-plan-card">
                                <div 
                                    className="plan-header" 
                                    onClick={() => toggleExpand(plan._id || plan.id || index)}
                                >
                                    <div className="plan-title">
                                        <WorkoutIcon size={20} />
                                        <h3>{plan.name || 'Treino sem nome'}</h3>
                                    </div>
                                    
                                    <div className="plan-meta">
                                        <div className="meta-item">
                                            <ExerciseIcon size={14} />
                                            <span className="exercise-count">
                                                {exercises.length} exercício{exercises.length !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        
                                        {plan.estimatedDuration && (
                                            <div className="meta-item">
                                                <TimeIcon size={14} />
                                                <span>{plan.estimatedDuration} min</span>
                                            </div>
                                        )}
                                        
                                        {plan.difficulty && (
                                            <div className="meta-item">
                                                <span style={{ 
                                                    color: plan.difficulty === 'Iniciante' ? '#10b981' : 
                                                           plan.difficulty === 'Intermediário' ? '#f59e0b' : '#ef4444' 
                                                }}>
                                                    {plan.difficulty}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <button className="expand-button">
                                        {isExpanded ? '−' : '+'}
                                    </button>
                                </div>
                                
                                {plan.description && (
                                    <div className="plan-description">
                                        <p>{plan.description}</p>
                                    </div>
                                )}
                                
                                {isExpanded && (
                                    <div className="plan-details">
                                        <div className="exercises-section">
                                            <h4>
                                                <ExerciseIcon size={18} />
                                                Exercícios
                                            </h4>
                                            
                                            {exercises.length === 0 ? (
                                                <div className="no-exercises">
                                                    Nenhum exercício configurado para este treino
                                                </div>
                                            ) : (
                                                <div className="exercises-list">
                                                    {exercises.map((exercise, exerciseIndex) => (
                                                        <div key={exerciseIndex} className="exercise-item">
                                                            <div className="exercise-header">
                                                                <div className="exercise-number">
                                                                    {exerciseIndex + 1}
                                                                </div>
                                                                <h5>{exercise.name || 'Exercício sem nome'}</h5>
                                                            </div>
                                                            
                                                            {(exercise.sets || exercise.reps || exercise.weight || exercise.duration || exercise.rest) && (
                                                                <div className="exercise-details">
                                                                    {exercise.sets && (
                                                                        <div className="detail-item">
                                                                            <span className="label">Séries:</span>
                                                                            <span className="value">{exercise.sets}</span>
                                                                        </div>
                                                                    )}
                                                                    {exercise.reps && (
                                                                        <div className="detail-item">
                                                                            <span className="label">Repetições:</span>
                                                                            <span className="value">{exercise.reps}</span>
                                                                        </div>
                                                                    )}
                                                                    {exercise.weight && (
                                                                        <div className="detail-item">
                                                                            <span className="label">Peso:</span>
                                                                            <span className="value">{exercise.weight}kg</span>
                                                                        </div>
                                                                    )}
                                                                    {exercise.duration && (
                                                                        <div className="detail-item">
                                                                            <span className="label">Duração:</span>
                                                                            <span className="value">{exercise.duration} min</span>
                                                                        </div>
                                                                    )}
                                                                    {exercise.rest && (
                                                                        <div className="detail-item">
                                                                            <span className="label">Descanso:</span>
                                                                            <span className="value">{exercise.rest}s</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {plan.notes && (
                                            <div className="notes-section">
                                                <h4>Observações</h4>
                                                <p>{plan.notes}</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export { WorkoutPlan };
export default WorkoutPlan;