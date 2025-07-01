import React, { useEffect, useState, useContext } from 'react';
import { ClientContext } from '../contexts/ClientContext';
import WorkoutPlan from '../components/workouts/WorkoutPlan';
import { getWorkoutPlans } from '../services/workout.service';

const WorkoutPlanPage = () => {
    const { clients } = useContext(ClientContext);
    const [workoutPlans, setWorkoutPlans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWorkoutPlans = async () => {
            try {
                const plans = await getWorkoutPlans();
                setWorkoutPlans(plans);
            } catch (error) {
                console.error('Error fetching workout plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWorkoutPlans();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Workout Plans</h1>
            {clients.length === 0 ? (
                <p>No clients available. Please add clients to manage workout plans.</p>
            ) : (
                <WorkoutPlan plans={workoutPlans} />
            )}
        </div>
    );
};

export default WorkoutPlanPage;