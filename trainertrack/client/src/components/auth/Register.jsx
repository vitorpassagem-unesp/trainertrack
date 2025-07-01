import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        userType: 'trainer' // 'trainer' or 'client'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleUserTypeChange = (type) => {
        setFormData({ ...formData, userType: type });
        if (error) setError('');
    };

    const validateForm = () => {
        if (!formData.username || !formData.email || !formData.password) {
            setError('Todos os campos obrigatórios devem ser preenchidos');
            return false;
        }
        
        if (formData.username.length < 3) {
            setError('Nome de usuário deve ter pelo menos 3 caracteres');
            return false;
        }
        
        if (formData.password.length < 6) {
            setError('Senha deve ter pelo menos 6 caracteres');
            return false;
        }
        
        if (formData.password !== formData.confirmPassword) {
            setError('Senhas não coincidem');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Por favor, digite um email válido');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);
        
        try {
            // Remove confirmPassword before sending to backend and map userType to role
            const { confirmPassword, userType, ...registrationData } = formData;
            
            // Map userType to the appropriate role for backend
            const role = userType === 'client' ? 'user' : 'trainer';
            
            await authService.register({
                ...registrationData,
                role
            });
            history.push('/login');
        } catch (err) {
            console.error('Registration error:', err);
            const errorMessage = err.response?.data?.message || 'Falha no registro. Tente novamente.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2>Criar Conta</h2>
            
            {/* User Type Selection */}
            <div className="user-type-selection">
                <div className="user-type-options">
                    <button
                        type="button"
                        className={`user-type-btn ${formData.userType === 'trainer' ? 'active' : ''}`}
                        onClick={() => handleUserTypeChange('trainer')}
                    >
                        <div className="user-type-icon">👨‍💼</div>
                        <span>Sou Treinador</span>
                    </button>
                    <button
                        type="button"
                        className={`user-type-btn ${formData.userType === 'client' ? 'active' : ''}`}
                        onClick={() => handleUserTypeChange('client')}
                    >
                        <div className="user-type-icon">🏃‍♂️</div>
                        <span>Sou Cliente</span>
                    </button>
                </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="firstName">Nome</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="Digite seu nome"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Sobrenome</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="Digite seu sobrenome"
                        />
                    </div>
                </div>
                
                <div className="form-group">
                    <label htmlFor="username">Nome de Usuário *</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        placeholder="Digite seu nome de usuário"
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
                        placeholder="Digite seu email"
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
                        placeholder="Digite sua senha (mín. 6 caracteres)"
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
                        placeholder="Confirme sua senha"
                    />
                </div>
                
                <button type="submit" disabled={loading} className="register-btn">
                    {loading ? 'Criando Conta...' : `Criar Conta como ${formData.userType === 'trainer' ? 'Treinador' : 'Cliente'}`}
                </button>
                
                <p className="login-link">
                    Já tem uma conta? 
                    <button 
                        type="button" 
                        onClick={() => history.push('/login')}
                        className="link-btn"
                    >
                        Fazer Login
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Register;