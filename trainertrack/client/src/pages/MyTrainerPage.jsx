import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const MyTrainerPage = () => {
    const { user } = useContext(AuthContext);
    const [trainerData, setTrainerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyTrainer();
    }, []);

    const fetchMyTrainer = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/clients/my-trainer', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Falha ao carregar dados do treinador');
            }

            const data = await response.json();
            setTrainerData(data);
        } catch (err) {
            setError(err.message);
            console.error('Erro ao buscar treinador:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Carregando informações do seu treinador...</div>;
    }

    if (error) {
        return <div className="error">Erro: {error}</div>;
    }

    if (!trainerData) {
        return (
            <div className="my-trainer-page">
                <div className="page-header">
                    <h1>Meu Treinador</h1>
                </div>
                <div className="no-trainer">
                    <h2>Nenhum treinador atribuído</h2>
                    <p>Você ainda não possui um personal trainer atribuído.</p>
                    <p>Entre em contato com a administração para ser vinculado a um profissional.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="my-trainer-page">
            <div className="page-header">
                <h1>Meu Treinador</h1>
                <p>Conheça seu personal trainer e suas qualificações</p>
            </div>

            <div className="trainer-card">
                <div className="trainer-header">
                    <h2>{trainerData.profile?.firstName} {trainerData.profile?.lastName}</h2>
                    <div className="trainer-status">
                        <span className={`status ${trainerData.isActive ? 'active' : 'inactive'}`}>
                            {trainerData.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                </div>

                <div className="trainer-info">
                    <div className="info-section">
                        <h3>Informações de Contato</h3>
                        <div className="contact-info">
                            <div className="contact-item">
                                <strong>Email:</strong> {trainerData.email}
                            </div>
                            {trainerData.profile?.phone && (
                                <div className="contact-item">
                                    <strong>Telefone:</strong> {trainerData.profile.phone}
                                </div>
                            )}
                            <div className="contact-item">
                                <strong>Usuário:</strong> @{trainerData.username}
                            </div>
                        </div>
                    </div>

                    {trainerData.profile?.specialties && trainerData.profile.specialties.length > 0 && (
                        <div className="info-section">
                            <h3>Especialidades</h3>
                            <div className="specialties">
                                {trainerData.profile.specialties.map((specialty, index) => (
                                    <span key={index} className="specialty-tag">
                                        {specialty}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {trainerData.profile?.experience && (
                        <div className="info-section">
                            <h3>Experiência</h3>
                            <p className="experience-text">{trainerData.profile.experience}</p>
                        </div>
                    )}

                    {trainerData.profile?.certification && (
                        <div className="info-section">
                            <h3>Certificações</h3>
                            <p className="certification-text">{trainerData.profile.certification}</p>
                        </div>
                    )}

                    <div className="info-section">
                        <h3>Informações Adicionais</h3>
                        <div className="additional-info">
                            <div className="info-item">
                                <strong>Cadastrado desde:</strong> {new Date(trainerData.createdAt).toLocaleDateString('pt-BR')}
                            </div>
                            <div className="info-item">
                                <strong>Última atualização:</strong> {new Date(trainerData.updatedAt).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="trainer-actions">
                    <div className="contact-section">
                        <h3>Entre em Contato</h3>
                        <p>Para dúvidas sobre treinos, agendamentos ou orientações, entre em contato diretamente:</p>
                        <div className="contact-buttons">
                            {trainerData.email && (
                                <a 
                                    href={`mailto:${trainerData.email}?subject=Contato - Cliente ${user?.username}`}
                                    className="btn btn-primary"
                                >
                                    Enviar Email
                                </a>
                            )}
                            {trainerData.profile?.phone && (
                                <a 
                                    href={`tel:${trainerData.profile.phone.replace(/\D/g, '')}`}
                                    className="btn btn-secondary"
                                >
                                    Ligar
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyTrainerPage;
