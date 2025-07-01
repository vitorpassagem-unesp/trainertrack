import React, { useState, useEffect } from 'react';

const AllClientsPage = () => {
    const [clients, setClients] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token');
            
            // Buscar todos os clientes
            const clientsResponse = await fetch('http://localhost:5000/api/admin/clients', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            // Buscar todos os treinadores para o dropdown
            const trainersResponse = await fetch('http://localhost:5000/api/admin/trainers', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!clientsResponse.ok || !trainersResponse.ok) {
                throw new Error('Falha ao carregar dados');
            }

            const clientsData = await clientsResponse.json();
            const trainersData = await trainersResponse.json();
            
            setClients(clientsData);
            setTrainers(trainersData);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao buscar dados:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleReassignClient = async (clientId, newTrainerId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/clients/${clientId}/reassign`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newTrainerId: newTrainerId })
            });

            if (!response.ok) {
                throw new Error('Falha ao reatribuir cliente');
            }

            // Atualizar a lista
            fetchData();
        } catch (err) {
            setError(err.message);
            console.error('Erro ao reatribuir cliente:', err);
        }
    };

    if (loading) return <div className="loading">Carregando clientes...</div>;

    return (
        <div className="all-clients">
            <div className="page-header">
                <h1>Todos os Clientes</h1>
                <p>Gerencie e visualize todos os clientes do sistema</p>
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="clients-summary">
                <div className="summary-cards">
                    <div className="summary-card">
                        <h3>Total de Clientes</h3>
                        <span className="number">{clients.length}</span>
                    </div>
                    <div className="summary-card">
                        <h3>Treinadores Ativos</h3>
                        <span className="number">{trainers.filter(t => t.isActive).length}</span>
                    </div>
                </div>
            </div>

            <div className="clients-list">
                {clients.length === 0 ? (
                    <p>Nenhum cliente encontrado.</p>
                ) : (
                    <div className="clients-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Nome</th>
                                    <th>Email</th>
                                    <th>Telefone</th>
                                    <th>Treinador Atual</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {clients.map(client => (
                                    <tr key={client._id}>
                                        <td>{client.name}</td>
                                        <td>{client.email}</td>
                                        <td>{client.phone}</td>
                                        <td>
                                            {client.trainer ? 
                                                `${client.trainer.profile?.firstName || ''} ${client.trainer.profile?.lastName || ''}`.trim() || client.trainer.username
                                                : 'Sem treinador'
                                            }
                                        </td>
                                        <td>
                                            <select 
                                                onChange={(e) => handleReassignClient(client._id, e.target.value)}
                                                defaultValue={client.trainer?._id || ''}
                                                className="trainer-select"
                                            >
                                                <option value="">Reatribuir para...</option>
                                                {trainers.filter(t => t.isActive).map(trainer => (
                                                    <option key={trainer._id} value={trainer._id}>
                                                        {`${trainer.profile?.firstName || ''} ${trainer.profile?.lastName || ''}`.trim() || trainer.username}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllClientsPage;
