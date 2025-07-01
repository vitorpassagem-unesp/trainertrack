// This file contains utility functions used in the server for the TrainerTrack application.

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

const calculateBMI = (weight, height) => {
    if (height <= 0) return null;
    return (weight / (height * height)).toFixed(2);
};

const generateId = () => {
    return '_' + Math.random().toString(36).substr(2, 9);
};

module.exports = {
    validateEmail,
    formatDate,
    calculateBMI,
    generateId,
};