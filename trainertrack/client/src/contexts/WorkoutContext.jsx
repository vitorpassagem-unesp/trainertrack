import React, { createContext, useState, useEffect } from 'react';
import * as workoutService from '../services/workout.service';

export const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
    const [workouts, setWorkouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [clientId, setClientId] = useState(null);

    useEffect(() => {
        if (clientId) {
            fetchWorkouts();
        }
    }, [clientId]);

    const fetchWorkouts = async () => {
        try {
            setLoading(true);
            const data = await workoutService.getWorkoutPlans();
            setWorkouts(data);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const addWorkout = async (workoutData) => {
        try {
            const data = await workoutService.createWorkoutPlan(workoutData);
            setWorkouts([...workouts, data]);
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const updateWorkout = async (id, workoutData) => {
        try {
            const data = await workoutService.updateWorkoutPlan(id, workoutData);
            setWorkouts(workouts.map(w => w._id === id ? data : w));
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    const value = {
        workouts,
        loading,
        error,
        clientId,
        setClientId,
        fetchWorkouts,
        addWorkout,
        updateWorkout
    };

    return (
        <WorkoutContext.Provider value={value}>
            {children}
        </WorkoutContext.Provider>
    );
};

export default WorkoutProvider;
