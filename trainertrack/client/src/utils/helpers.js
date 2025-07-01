// This file exports utility functions used throughout the application.

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

export const calculateBMI = (weight, height) => {
    if (height > 0) {
        return (weight / (height * height)).toFixed(2);
    }
    return null;
};

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const getInitials = (name) => {
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).join('');
};