import React, { useContext } from 'react';
import { ClientContext } from '../../contexts/ClientContext';
import ClientCard from './ClientCard';

const ClientsList = () => {
    const { clients } = useContext(ClientContext);

    return (
        <div className="clients-list">
            <h2>Clients</h2>
            {clients.length === 0 ? (
                <p>No clients found.</p>
            ) : (
                clients.map(client => (
                    <ClientCard key={client.id} client={client} />
                ))
            )}
        </div>
    );
};

export default ClientsList;