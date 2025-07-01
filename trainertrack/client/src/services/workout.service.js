// This file contains functions for managing workout-related API calls.

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/workouts/';

// Add auth token to requests
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new workout plan
export const createWorkoutPlan = async (workoutData) => {
    const response = await axios.post(API_URL, workoutData, { 
        headers: getAuthHeader() 
    });
    return response.data;
};

// Get all workout plans
export const getWorkoutPlans = async () => {
    const response = await axios.get(API_URL, { 
        headers: getAuthHeader() 
    });
    return response.data;
};

// Get a specific workout plan by ID
export const getWorkoutPlanById = async (id) => {
    const response = await axios.get(`${API_URL}${id}`, { 
        headers: getAuthHeader() 
    });
    return response.data;
};

// Update a workout plan by ID
export const updateWorkoutPlan = async (id, workoutData) => {
    const response = await axios.put(`${API_URL}${id}`, workoutData, { 
        headers: getAuthHeader() 
    });
    return response.data;
};

// Delete a workout plan by ID
export const deleteWorkoutPlan = async (id) => {
    const response = await axios.delete(`${API_URL}${id}`, { 
        headers: getAuthHeader() 
    });
    return response.data;
};

// Get workouts by client ID
export const getWorkoutsByClientId = async (clientId) => {
    const response = await axios.get(`${API_URL}client/${clientId}`, { 
        headers: getAuthHeader() 
    });
    return response.data;
};