import React, { useState, useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ClientContext } from '../../contexts/ClientContext';
import { getClientById } from '../../services/client.service';

const ClientForm = ({ client, clientId, onSuccess }) => {
    const { addClient, updateClient, loading } = useContext(ClientContext);
    const history = useHistory();
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        // Initial metrics
        weight: '',
        height: '',
        bodyFatPercentage: '',
        muscleMassPercentage: '',
    });

    useEffect(() => {
        if (client) {
            setFormData({
                name: client.name || '',
                email: client.email || '',
                phone: client.phone || '',
                weight: client.metrics?.[0]?.weight || '',
                height: client.metrics?.[0]?.height || '',
                bodyFatPercentage: client.metrics?.[0]?.bodyFatPercentage || '',
                muscleMassPercentage: client.metrics?.[0]?.muscleMassPercentage || '',
            });
        } else if (clientId) {
            const loadClient = async () => {
                try {
                    const loadedClient = await getClientById(clientId);
                    if (loadedClient) {
                        setFormData({
                            name: loadedClient.name || '',
                            email: loadedClient.email || '',
                            phone: loadedClient.phone || '',
                            weight: loadedClient.metrics?.[0]?.weight || '',
                            height: loadedClient.metrics?.[0]?.height || '',
                            bodyFatPercentage: loadedClient.metrics?.[0]?.bodyFatPercentage || '',
                            muscleMassPercentage: loadedClient.metrics?.[0]?.muscleMassPercentage || '',
                        });
                    }
                } catch (error) {
                    console.error('Error loading client:', error);
                }
            };
            loadClient();
        }
    }, [client, clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const clientData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
        };
        
        // Add metrics if this is a new client or we're adding initial metrics
        if ((!client && !clientId) || 
            (client && (!client.metrics || client.metrics.length === 0))) {
            clientData.metrics = [{
                weight: parseFloat(formData.weight),
                height: parseFloat(formData.height),
                bodyFatPercentage: parseFloat(formData.bodyFatPercentage),
                muscleMassPercentage: parseFloat(formData.muscleMassPercentage),
                date: new Date()
            }];
        }

        let result;
        if (client?._id) {
            result = await updateClient(client._id, clientData);
        } else if (clientId) {
            result = await updateClient(clientId, clientData);
        } else {
            result = await addClient(clientData);
        }

        if (result) {
            if (onSuccess) {
                onSuccess();
            } else {
                history.push('/clients');
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="client-form">
            <h2>{client ? 'Update Client' : 'Add New Client'}</h2>
            
            <div className="form-group">
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="phone">Phone:</label>
                <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>
            
            {(!client || !client.metrics || client.metrics.length === 0) && (
                <>
                    <h3>Initial Metrics</h3>
                    
                    <div className="form-group">
                        <label htmlFor="weight">Weight (kg):</label>
                        <input
                            type="number"
                            id="weight"
                            name="weight"
                            step="0.1"
                            value={formData.weight}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="height">Height (cm):</label>
                        <input
                            type="number"
                            id="height"
                            name="height"
                            step="0.1"
                            value={formData.height}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="bodyFatPercentage">Body Fat Percentage (%):</label>
                        <input
                            type="number"
                            id="bodyFatPercentage"
                            name="bodyFatPercentage"
                            step="0.1"
                            value={formData.bodyFatPercentage}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="muscleMassPercentage">Muscle Mass Percentage (%):</label>
                        <input
                            type="number"
                            id="muscleMassPercentage"
                            name="muscleMassPercentage"
                            step="0.1"
                            value={formData.muscleMassPercentage}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </>
            )}
            
            <div className="form-actions">
                <button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : (client ? 'Update Client' : 'Add Client')}
                </button>
                <button type="button" onClick={() => history.push('/clients')} className="cancel-button">
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default ClientForm;