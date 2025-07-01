import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TrainerForm = ({ trainer, onClose }) => {
    const isEditing = !!trainer;
    const [editingFields, setEditingFields] = useState({}); // Controla quais campos estão sendo editados

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        profile: {
            firstName: '',
            lastName: '',
            phone: '',
            specialties: [],
            experience: '',
            certification: ''
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const specialtyOptions = [
        'Musculação',
        'Cardio',
        'Funcional',
        'Pilates',
        'Yoga',
        'CrossFit',
        'Natação',
        'Corrida',
        'Fisioterapia',
        'Nutrição Esportiva'
    ];

    useEffect(() => {
        if (isEditing && trainer) {
            setFormData({
                username: trainer.username || '',
                email: trainer.email || '',
                password: '',
                confirmPassword: '',
                profile: {
                    firstName: trainer.profile?.firstName || '',
                    lastName: trainer.profile?.lastName || '',
                    phone: trainer.profile?.phone || '',
                    specialties: trainer.profile?.specialties || [],
                    experience: trainer.profile?.experience || '',
                    certification: trainer.profile?.certification || ''
                }
            });
        }
    }, [trainer, isEditing]);

    // Função para habilitar/desabilitar edição de um campo específico
    const toggleFieldEdit = (fieldName) => {
        setEditingFields(prev => ({
            ...prev,
            [fieldName]: !prev[fieldName]
        }));
    };

    // Função para cancelar edição de um campo
    const cancelFieldEdit = (fieldName) => {
        setEditingFields(prev => ({
            ...prev,
            [fieldName]: false
        }));
        // Restaurar valor original
        if (isEditing && trainer) {
            if (fieldName.startsWith('profile.')) {
                const profileField = fieldName.replace('profile.', '');
                setFormData(prev => ({
                    ...prev,
                    profile: {
                        ...prev.profile,
                        [profileField]: trainer.profile?.[profileField] || ''
                    }
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    [fieldName]: trainer[fieldName] || ''
                }));
            }
        }
    };

    // Função para salvar um campo específico
    const saveField = async (fieldName) => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');
            let updateData = {};

            if (fieldName.startsWith('profile.')) {
                const profileField = fieldName.replace('profile.', '');
                updateData = {
                    profile: {
                        ...trainer.profile,
                        [profileField]: formData.profile[profileField]
                    }
                };
            } else {
                updateData = {
                    [fieldName]: formData[fieldName]
                };
            }

            await axios.put(
                `http://localhost:5000/api/admin/trainers/${trainer._id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditingFields(prev => ({
                ...prev,
                [fieldName]: false
            }));

            // Atualizar dados locais
            if (fieldName.startsWith('profile.')) {
                const profileField = fieldName.replace('profile.', '');
                trainer.profile[profileField] = formData.profile[profileField];
            } else {
                trainer[fieldName] = formData[fieldName];
            }

        } catch (error) {
            console.error('Error updating field:', error);
            setError(error.response?.data?.message || `Erro ao atualizar ${fieldName}`);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name.startsWith('profile.')) {
            const profileField = name.replace('profile.', '');
            setFormData(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    [profileField]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSpecialtyChange = (specialty) => {
        setFormData(prev => ({
            ...prev,
            profile: {
                ...prev.profile,
                specialties: prev.profile.specialties.includes(specialty)
                    ? prev.profile.specialties.filter(s => s !== specialty)
                    : [...prev.profile.specialties, specialty]
            }
        }));
    };

    // Função para salvar especialidades
    const saveSpecialties = async () => {
        try {
            setLoading(true);
            setError('');

            const token = localStorage.getItem('token');
            const updateData = {
                profile: {
                    ...trainer.profile,
                    specialties: formData.profile.specialties
                }
            };

            await axios.put(
                `http://localhost:5000/api/admin/trainers/${trainer._id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setEditingFields(prev => ({
                ...prev,
                'profile.specialties': false
            }));

            trainer.profile.specialties = formData.profile.specialties;

        } catch (error) {
            console.error('Error updating specialties:', error);
            setError(error.response?.data?.message || 'Erro ao atualizar especialidades');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validações para criação
        if (!isEditing && formData.password !== formData.confirmPassword) {
            setError('As senhas não coincidem');
            setLoading(false);
            return;
        }

        if (!isEditing && formData.password.length < 6) {
            setError('A senha deve ter pelo menos 6 caracteres');
            setLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const submitData = {
                username: formData.username,
                email: formData.email,
                profile: formData.profile
            };

            if (!isEditing) {
                submitData.password = formData.password;
            }

            const url = isEditing 
                ? `http://localhost:5000/api/admin/trainers/${trainer._id}`
                : 'http://localhost:5000/api/admin/trainers';
            
            const method = isEditing ? 'put' : 'post';
            
            await axios[method](url, submitData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            onClose(); // Fechar o modal e atualizar a lista
        } catch (error) {
            console.error('Error saving trainer:', error);
            setError(error.response?.data?.message || 'Erro ao salvar personal');
        } finally {
            setLoading(false);
        }
    };

    // Componente para renderizar um campo editável
    const EditableField = ({ 
        fieldName, 
        label, 
        value, 
        type = 'text', 
        multiline = false,
        placeholder = ''
    }) => {
        const isFieldEditing = editingFields[fieldName];
        
        return (
            <div className="form-group" style={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontWeight: '600', color: '#333' }}>{label}</label>
                    {!isFieldEditing && (
                        <button
                            type="button"
                            onClick={() => toggleFieldEdit(fieldName)}
                            className="btn btn-secondary btn-small"
                            style={{ padding: '4px 8px', fontSize: '12px' }}
                        >
                            ✏️ Editar
                        </button>
                    )}
                </div>
                
                {isFieldEditing ? (
                    <div>
                        {multiline ? (
                            <textarea
                                name={fieldName}
                                value={value}
                                onChange={handleChange}
                                placeholder={placeholder}
                                rows="3"
                                style={{ width: '100%', marginBottom: '10px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        ) : (
                            <input
                                type={type}
                                name={fieldName}
                                value={value}
                                onChange={handleChange}
                                placeholder={placeholder}
                                style={{ width: '100%', marginBottom: '10px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                        )}
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                                type="button"
                                onClick={() => saveField(fieldName)}
                                className="btn btn-primary btn-small"
                                disabled={loading}
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                                ✓ Salvar
                            </button>
                            <button
                                type="button"
                                onClick={() => cancelFieldEdit(fieldName)}
                                className="btn btn-secondary btn-small"
                                style={{ padding: '4px 8px', fontSize: '12px' }}
                            >
                                ✕ Cancelar
                            </button>
                        </div>
                    </div>
                ) : (
                    <div 
                        style={{ 
                            padding: '8px 12px', 
                            background: '#f8f9fa', 
                            border: '1px solid #dee2e6',
                            borderRadius: '4px',
                            minHeight: '38px',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                    >
                        {value || <span style={{ color: '#6c757d', fontStyle: 'italic' }}>Não informado</span>}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="trainer-form-modal">
            <div className="form-header">
                <h2>{isEditing ? 'Perfil do Personal Trainer' : 'Adicionar Personal Trainer'}</h2>
                <button 
                    onClick={onClose}
                    className="btn btn-secondary close-btn"
                    type="button"
                >
                    ✕
                </button>
            </div>

            {error && <div className="error-message" style={{ margin: '20px' }}>{error}</div>}

            {isEditing ? (
                // Modo visualização/edição campo por campo para treinadores existentes
                <div style={{ padding: '20px' }}>
                    <div className="form-section">
                        <h3>Informações de Login</h3>
                        
                        <EditableField
                            fieldName="username"
                            label="Nome de usuário"
                            value={formData.username}
                        />
                        
                        <EditableField
                            fieldName="email"
                            label="Email"
                            value={formData.email}
                            type="email"
                        />
                    </div>

                    <div className="form-section">
                        <h3>Informações Pessoais</h3>
                        
                        <EditableField
                            fieldName="profile.firstName"
                            label="Nome"
                            value={formData.profile.firstName}
                        />
                        
                        <EditableField
                            fieldName="profile.lastName"
                            label="Sobrenome"
                            value={formData.profile.lastName}
                        />
                        
                        <EditableField
                            fieldName="profile.phone"
                            label="Telefone"
                            value={formData.profile.phone}
                            placeholder="(11) 99999-9999"
                        />
                    </div>

                    <div className="form-section">
                        <h3>Informações Profissionais</h3>
                        
                        {/* Especialidades - Tratamento especial */}
                        <div className="form-group" style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                <label style={{ fontWeight: '600', color: '#333' }}>Especialidades</label>
                                {!editingFields['profile.specialties'] && (
                                    <button
                                        type="button"
                                        onClick={() => toggleFieldEdit('profile.specialties')}
                                        className="btn btn-secondary btn-small"
                                        style={{ padding: '4px 8px', fontSize: '12px' }}
                                    >
                                        ✏️ Editar
                                    </button>
                                )}
                            </div>
                            
                            {editingFields['profile.specialties'] ? (
                                <div>
                                    <div className="specialties-grid" style={{ marginBottom: '10px' }}>
                                        {specialtyOptions.map(specialty => (
                                            <label key={specialty} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.profile.specialties.includes(specialty)}
                                                    onChange={() => handleSpecialtyChange(specialty)}
                                                />
                                                {specialty}
                                            </label>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button
                                            type="button"
                                            onClick={saveSpecialties}
                                            className="btn btn-primary btn-small"
                                            disabled={loading}
                                            style={{ padding: '4px 8px', fontSize: '12px' }}
                                        >
                                            ✓ Salvar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => cancelFieldEdit('profile.specialties')}
                                            className="btn btn-secondary btn-small"
                                            style={{ padding: '4px 8px', fontSize: '12px' }}
                                        >
                                            ✕ Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div 
                                    style={{ 
                                        padding: '8px 12px', 
                                        background: '#f8f9fa', 
                                        border: '1px solid #dee2e6',
                                        borderRadius: '4px',
                                        minHeight: '38px',
                                        display: 'flex',
                                        alignItems: 'center'
                                    }}
                                >
                                    {formData.profile.specialties.length > 0 
                                        ? formData.profile.specialties.join(', ')
                                        : <span style={{ color: '#6c757d', fontStyle: 'italic' }}>Não informado</span>
                                    }
                                </div>
                            )}
                        </div>
                        
                        <EditableField
                            fieldName="profile.experience"
                            label="Experiência"
                            value={formData.profile.experience}
                            multiline={true}
                            placeholder="Descreva a experiência profissional..."
                        />
                        
                        <EditableField
                            fieldName="profile.certification"
                            label="Certificações"
                            value={formData.profile.certification}
                            multiline={true}
                            placeholder="Liste as certificações..."
                        />
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            ) : (
                // Modo criação para novos treinadores
                <form onSubmit={handleSubmit} className="trainer-form">
                    <div className="form-section">
                        <h3>Informações de Login</h3>
                        
                        <div className="form-group">
                            <label htmlFor="username">Nome de usuário *</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Email *</label>
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
                            <label htmlFor="password">Senha *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                minLength="6"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Senha *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Informações Pessoais</h3>
                        
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="profile.firstName">Nome</label>
                                <input
                                    type="text"
                                    id="profile.firstName"
                                    name="profile.firstName"
                                    value={formData.profile.firstName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="profile.lastName">Sobrenome</label>
                                <input
                                    type="text"
                                    id="profile.lastName"
                                    name="profile.lastName"
                                    value={formData.profile.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="profile.phone">Telefone</label>
                            <input
                                type="text"
                                id="profile.phone"
                                name="profile.phone"
                                value={formData.profile.phone}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Informações Profissionais</h3>
                        
                        <div className="form-group">
                            <label>Especialidades</label>
                            <div className="specialties-grid">
                                {specialtyOptions.map(specialty => (
                                    <label key={specialty} className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.profile.specialties.includes(specialty)}
                                            onChange={() => handleSpecialtyChange(specialty)}
                                        />
                                        {specialty}
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="profile.experience">Experiência</label>
                            <textarea
                                id="profile.experience"
                                name="profile.experience"
                                value={formData.profile.experience}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Descreva a experiência profissional..."
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="profile.certification">Certificações</label>
                            <textarea
                                id="profile.certification"
                                name="profile.certification"
                                value={formData.profile.certification}
                                onChange={handleChange}
                                rows="3"
                                placeholder="Liste as certificações..."
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="btn btn-secondary"
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading ? 'Criando...' : 'Criar Personal'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default TrainerForm;
