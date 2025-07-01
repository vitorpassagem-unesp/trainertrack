// client/src/services/metrics.service.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/metrics/';

// Add auth token to requests
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getMetricsByClientId = async (clientId) => {
    try {
        const response = await axios.get(`${API_URL}${clientId}`, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching metrics:', error);
        throw error;
    }
};

export const createMetric = async (clientId, metricData) => {
    try {
        const response = await axios.post(`${API_URL}${clientId}`, metricData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error creating metric:', error);
        throw error;
    }
};

export const updateMetric = async (clientId, metricId, metricData) => {
    try {
        const response = await axios.put(`${API_URL}${metricId}`, metricData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        console.error('Error updating metric:', error);
        throw error;
    }
};

export const deleteMetric = async (clientId, metricId) => {
    try {
        const response = await axios.delete(`${API_URL}${clientId}/${metricId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};