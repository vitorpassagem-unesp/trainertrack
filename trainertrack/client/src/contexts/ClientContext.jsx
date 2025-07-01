import React, { createContext, useState, useEffect } from 'react';
import clientService from '../services/client.service';

export const ClientContext = createContext();

export const ClientProvider = ({ children }) => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const data = await clientService.getAllClients();
                setClients(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClients();
    }, []);

    const addClient = async (clientData) => {
        try {
            const newClient = await clientService.createClient(clientData);
            setClients((prevClients) => [...prevClients, newClient]);
        } catch (err) {
            setError(err);
        }
    };

    const updateClient = async (clientId, updatedData) => {
        try {
            const updatedClient = await clientService.updateClient(clientId, updatedData);
            setClients((prevClients) =>
                prevClients.map((client) => (client.id === clientId ? updatedClient : client))
            );
        } catch (err) {
            setError(err);
        }
    };

    const deleteClient = async (clientId) => {
        try {
            await clientService.deleteClient(clientId);
            setClients((prevClients) => prevClients.filter((client) => client.id !== clientId));
        } catch (err) {
            setError(err);
        }
    };

    return (
        <ClientContext.Provider value={{ clients, loading, error, addClient, updateClient, deleteClient }}>
            {children}
        </ClientContext.Provider>
    );
};