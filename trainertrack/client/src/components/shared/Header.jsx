import React, { useContext } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

// Ícone de logout/saída
const LogoutIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17,7L15.59,8.41L18.17,11H8V13H18.17L15.59,15.59L17,17L22,12L17,7M4,5H12V3H4C2.89,3 2,3.89 2,5V19A2,2 0 0,0 4,21H12V19H4V5Z" fill={color}/>
    </svg>
);

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const history = useHistory();

    const handleLogout = async () => {
        try {
            await logout();
            history.push('/login');
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <Link to="/">
                        <h1>TrainerTrack</h1>
                    </Link>
                </div>
                
                <div className="header-actions">
                    {user && (
                        <div className="user-info">
                            <span className="user-greeting">
                                Olá, {user.name || user.username}!
                            </span>
                            <button 
                                className="logout-btn" 
                                onClick={handleLogout}
                                title="Sair do sistema"
                            >
                                <LogoutIcon size={18} />
                                <span>Sair</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;