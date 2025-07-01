import React from 'react';
import { useContext } from 'react';
import { ClientContext } from '../../contexts/ClientContext';
import ClientsList from '../clients/ClientsList';
import Stats from './Stats';

const Dashboard = () => {
    const { clients } = useContext(ClientContext);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <Stats clients={clients} />
            <ClientsList clients={clients} />
        </div>
    );
};

export default Dashboard;