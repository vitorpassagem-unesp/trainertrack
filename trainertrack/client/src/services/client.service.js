import axios from 'axios';

const API_URL = 'http://localhost:5000/api/clients/';

// Add auth token to requests
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

// Function to get all clients
export const getClients = async () => {
    try {
        const response = await axios.get(API_URL, { 
            headers: getAuthHeader() 
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to get a client by ID
export const getClientById = async (clientId) => {
    try {
        // Get user info to determine the correct endpoint
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Decode token to get user role
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userRole = tokenPayload.role;

        let endpoint;
        if (userRole === 'trainer') {
            // For trainers, get client from their list and filter by ID
            endpoint = 'http://localhost:5000/api/trainer/clients';
        } else if (userRole === 'admin') {
            endpoint = 'http://localhost:5000/api/admin/clients';
        } else {
            endpoint = `${API_URL}${clientId}`;
        }

        console.log('🔍 Buscando cliente por ID:', clientId, 'usando endpoint:', endpoint);

        if (userRole === 'trainer' || userRole === 'admin') {
            // Get all clients and filter by ID
            const response = await axios.get(endpoint, { 
                headers: getAuthHeader() 
            });
            
            const client = response.data.find(client => client._id === clientId);
            if (!client) {
                throw new Error('Cliente não encontrado ou você não tem permissão para acessá-lo');
            }
            
            console.log('✅ Cliente encontrado:', client);
            return client;
        } else {
            // Direct access for regular users
            const response = await axios.get(endpoint, { 
                headers: getAuthHeader() 
            });
            return response.data;
        }
    } catch (error) {
        console.error('❌ Erro ao buscar cliente por ID:', error);
        throw error;
    }
};

// Function to create a new client
export const createClient = async (clientData) => {
    try {
        const response = await axios.post(API_URL, clientData, { 
            headers: getAuthHeader() 
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to update an existing client
export const updateClient = async (clientId, clientData) => {
    try {
        const response = await axios.put(`${API_URL}${clientId}`, clientData, { 
            headers: getAuthHeader() 
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to delete a client
export const deleteClient = async (clientId) => {
    try {
        const response = await axios.delete(`${API_URL}${clientId}`, { 
            headers: getAuthHeader() 
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Function to get all clients based on user role
export const getAllClients = async () => {
    try {
        // Get user info to determine the correct endpoint
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No authentication token found');
        }

        // Decode token to get user role (simple approach)
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const userRole = tokenPayload.role;

        let endpoint;
        if (userRole === 'trainer') {
            endpoint = 'http://localhost:5000/api/trainer/clients';
        } else if (userRole === 'admin') {
            endpoint = 'http://localhost:5000/api/admin/clients';
        } else {
            endpoint = API_URL; // Default client endpoint
        }

        console.log('Fetching clients from:', endpoint, 'for role:', userRole);
        
        const response = await axios.get(endpoint, { 
            headers: getAuthHeader() 
        });
        
        console.log('Response received:', response.data);
        return response.data; // Retornar apenas os dados, não o objeto response completo
    } catch (error) {
        console.error('Error fetching clients:', error);
        
        if (error.response) {
            // Server responded with error status
            throw new Error(`Erro do servidor: ${error.response.status} - ${error.response.data?.message || 'Erro desconhecido'}`);
        } else if (error.request) {
            // Request was made but no response
            throw new Error('Servidor não respondeu. Verifique se o servidor está funcionando.');
        } else {
            // Something else happened
            throw new Error(error.message || 'Erro ao buscar clientes');
        }
    }
};

// Default export with all functions
const clientService = {
    getClients,
    getAllClients,
    getClientById,
    createClient,
    updateClient,
    deleteClient
};

export default clientService;