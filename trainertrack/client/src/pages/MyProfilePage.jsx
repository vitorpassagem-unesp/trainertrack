import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Ícones SVG
const ProfileIcon = ({ size = 24, color = '#6366f1' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z" fill={color}/>
    </svg>
);

const ScaleIcon = ({ size = 24, color = '#10b981' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19,3H5C3.9,3 3,3.9 3,5V19C3,20.1 3.9,21 5,21H19C20.1,21 21,20.1 21,19V5C21,3.9 20.1,3 19,3M19,19H5V5H19V19M8,17H6V15H8V17M8,13H6V11H8V13M8,9H6V7H8V9M18,17H10V15H18V17M18,13H10V11H18V13M18,9H10V7H18V9Z" fill={color}/>
    </svg>
);

const BodyIcon = ({ size = 24, color = '#f59e0b' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,1L12,2C13.1,2 14,2.9 14,4C14,5.1 13.1,6 12,6C10.9,6 10,5.1 10,4C10,2.9 10.9,2 12,2L12,1M21,9V7L19,8V6C19,5.45 18.55,5 18,5C17.45,5 17,5.45 17,6V10.5C17,10.78 16.78,11 16.5,11C16.22,11 16,10.78 16,10.5V6C16,5.45 15.55,5 15,5C14.45,5 14,5.45 14,6V10.5C14,10.78 13.78,11 13.5,11C13.22,11 13,10.78 13,10.5V8H11V10.5C11,10.78 10.78,11 10.5,11C10.22,11 10,10.78 10,10.5V6C10,5.45 9.55,5 9,5C8.45,5 8,5.45 8,6V10.5C8,10.78 7.78,11 7.5,11C7.22,11 7,10.78 7,10.5V6C7,5.45 6.55,5 6,5C5.45,5 5,5.45 5,6V8L3,7V9L5,10V14C5,16.21 6.79,18 9,18H15C17.21,18 19,16.21 19,14V10L21,9Z" fill={color}/>
    </svg>
);

const SaveIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" fill={color}/>
    </svg>
);

const MyProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        dateOfBirth: '',
        height: '',
        currentWeight: '',
        bodyFatPercentage: '',
        muscleMass: ''
    });
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || '',
                dateOfBirth: user.dateOfBirth || '',
                height: user.height || '',
                currentWeight: user.currentWeight || '',
                bodyFatPercentage: user.bodyFatPercentage || '',
                muscleMass: user.muscleMass || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const updatedUser = await response.json();
                setMessage('Dados atualizados com sucesso!');
                setMessageType('success');
                setIsEditing(false);
                // Atualizar o contexto do usuário se necessário
            } else {
                throw new Error('Erro ao atualizar dados');
            }
        } catch (error) {
            setMessage('Erro ao atualizar dados. Tente novamente.');
            setMessageType('error');
        }
    };

    const addBodyMetrics = async () => {
        if (!formData.currentWeight && !formData.bodyFatPercentage && !formData.muscleMass) {
            setMessage('Preencha pelo menos um campo de métricas corporais.');
            setMessageType('error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/metrics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    weight: formData.currentWeight,
                    bodyFatPercentage: formData.bodyFatPercentage,
                    muscleMass: formData.muscleMass
                })
            });

            if (response.ok) {
                setMessage('Métricas corporais adicionadas com sucesso!');
                setMessageType('success');
            } else {
                throw new Error('Erro ao adicionar métricas');
            }
        } catch (error) {
            setMessage('Erro ao adicionar métricas. Tente novamente.');
            setMessageType('error');
        }
    };

    if (!user) {
        return <div>Carregando...</div>;
    }

    return (
        <div className="my-profile-page">
            <div className="page-header">
                <h1>Meus Dados</h1>
                <button 
                    className={`btn ${isEditing ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? 'Cancelar' : 'Editar'}
                </button>
            </div>

            {message && (
                <div className={`message ${messageType}`}>
                    {message}
                </div>
            )}

            <div className="profile-content">
                {/* Informações Pessoais */}
                <div className="profile-section">
                    <div className="section-header">
                        <ProfileIcon />
                        <h2>Informações Pessoais</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="profile-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="firstName">Nome</label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Sobrenome</label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Telefone</label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="dateOfBirth">Data de Nascimento</label>
                                <input
                                    type="date"
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="height">Altura (cm)</label>
                                <input
                                    type="number"
                                    id="height"
                                    name="height"
                                    value={formData.height}
                                    onChange={handleInputChange}
                                    disabled={!isEditing}
                                    className="form-input"
                                    min="1"
                                    max="250"
                                />
                            </div>
                        </div>

                        {isEditing && (
                            <button type="submit" className="btn btn-primary">
                                <SaveIcon />
                                Salvar Informações
                            </button>
                        )}
                    </form>
                </div>

                {/* Métricas Corporais */}
                <div className="profile-section">
                    <div className="section-header">
                        <ScaleIcon />
                        <h2>Métricas Corporais Atuais</h2>
                    </div>
                    
                    <div className="metrics-form">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="currentWeight">Peso Atual (kg)</label>
                                <input
                                    type="number"
                                    id="currentWeight"
                                    name="currentWeight"
                                    value={formData.currentWeight}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="1"
                                    max="300"
                                    step="0.1"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="bodyFatPercentage">% Gordura Corporal</label>
                                <input
                                    type="number"
                                    id="bodyFatPercentage"
                                    name="bodyFatPercentage"
                                    value={formData.bodyFatPercentage}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="1"
                                    max="50"
                                    step="0.1"
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="muscleMass">% Massa Muscular</label>
                                <input
                                    type="number"
                                    id="muscleMass"
                                    name="muscleMass"
                                    value={formData.muscleMass}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    min="1"
                                    max="70"
                                    step="0.1"
                                />
                            </div>
                            <div className="form-group">
                                <button 
                                    type="button" 
                                    className="btn btn-success"
                                    onClick={addBodyMetrics}
                                >
                                    <BodyIcon size={20} />
                                    Adicionar Métricas
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfilePage;
