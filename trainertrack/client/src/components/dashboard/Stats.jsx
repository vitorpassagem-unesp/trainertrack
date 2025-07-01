import React from 'react';
import { useContext } from 'react';
import { ClientContext } from '../../contexts/ClientContext';

const Stats = () => {
    const { clients } = useContext(ClientContext);

    const calculateAverageMetrics = () => {
        if (clients.length === 0) return {};

        const totalMetrics = clients.reduce((acc, client) => {
            acc.weight += client.metrics.weight || 0;
            acc.height += client.metrics.height || 0;
            acc.bodyFat += client.metrics.bodyFat || 0;
            acc.muscleMass += client.metrics.muscleMass || 0;
            return acc;
        }, { weight: 0, height: 0, bodyFat: 0, muscleMass: 0 });

        return {
            averageWeight: Math.round(totalMetrics.weight / clients.length),
            averageHeight: Math.round(totalMetrics.height / clients.length),
            averageBodyFat: Math.round(totalMetrics.bodyFat / clients.length),
            averageMuscleMass: Math.round(totalMetrics.muscleMass / clients.length),
        };
    };

    const averages = calculateAverageMetrics();

    return (
        <div className="stats">
            <h2>Client Statistics</h2>
            <ul>
                <li>Average Weight: {averages.averageWeight} kg</li>
                <li>Average Height: {averages.averageHeight} cm</li>
                <li>Average Body Fat: {averages.averageBodyFat}%</li>
                <li>Average Muscle Mass: {averages.averageMuscleMass}%</li>
            </ul>
        </div>
    );
};

export default Stats;