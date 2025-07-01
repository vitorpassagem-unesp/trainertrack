import React, { useState } from 'react';

const ExerciseForm = ({ onSubmit }) => {
    const [exerciseName, setExerciseName] = useState('');
    const [reps, setReps] = useState('');
    const [sets, setSets] = useState('');
    const [weight, setWeight] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const exerciseData = {
            exerciseName,
            reps,
            sets,
            weight,
        };
        onSubmit(exerciseData);
        resetForm();
    };

    const resetForm = () => {
        setExerciseName('');
        setReps('');
        setSets('');
        setWeight('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Exercise Name:</label>
                <input
                    type="text"
                    value={exerciseName}
                    onChange={(e) => setExerciseName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Reps:</label>
                <input
                    type="number"
                    value={reps}
                    onChange={(e) => setReps(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Sets:</label>
                <input
                    type="number"
                    value={sets}
                    onChange={(e) => setSets(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Weight (kg):</label>
                <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Add Exercise</button>
        </form>
    );
};

export default ExerciseForm;