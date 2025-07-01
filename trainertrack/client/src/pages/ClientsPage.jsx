import React, { useState } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import ClientsList from '../components/clients/ClientsList';
import ClientForm from '../components/clients/ClientForm';
import ClientDetailPage from './ClientDetailPage';

const ClientsPage = () => {
    const history = useHistory();

    const handleFormSuccess = () => {
        history.push('/clients');
    };

    return (
        <div className="clients-page">
            <h1>Gerenciar Clientes</h1>
            
            <Switch>
                <Route exact path="/clients" render={() => <ClientsList />} />
                <Route path="/clients/new" render={() => <ClientForm onSuccess={handleFormSuccess} />} />
                <Route path="/clients/:clientId/edit" render={(props) => {
                    const clientId = props.match.params.clientId;
                    return <ClientForm clientId={clientId} onSuccess={handleFormSuccess} />;
                }} />
                <Route path="/clients/:clientId" component={ClientDetailPage} />
            </Switch>
        </div>
    );
};

export default ClientsPage;