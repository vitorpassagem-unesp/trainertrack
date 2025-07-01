import React from 'react';
import { Link } from 'react-router-dom';

const ClientCard = ({ client }) => {
    // Get the most recent metrics if available
    const latestMetrics = client.metrics && client.metrics.length > 0 
        ? client.metrics[client.metrics.length - 1] 
        : null;

    return (
        <div className="client-card">
            <h3>{client.name}</h3>
            <p><strong>Email:</strong> {client.email}</p>
            <p><strong>Phone:</strong> {client.phone}</p>
            
            {latestMetrics && (
                <>
                    <h4>Latest Metrics</h4>
                    <p><strong>Weight:</strong> {latestMetrics.weight} kg</p>
                    <p><strong>Height:</strong> {latestMetrics.height} cm</p>
                    <p><strong>Body Fat Percentage:</strong> {latestMetrics.bodyFatPercentage}%</p>
                    <p><strong>Muscle Mass Percentage:</strong> {latestMetrics.muscleMassPercentage}%</p>
                    <p><strong>Date:</strong> {new Date(latestMetrics.date).toLocaleDateString()}</p>
                </>
            )}

            <Link to={`/clients/${client._id}`} className="details-button">
                View Details
            </Link>
        </div>
    );
};

export default ClientCard;