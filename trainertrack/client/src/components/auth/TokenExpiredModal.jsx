// client/src/components/auth/TokenExpiredModal.jsx
import React from 'react';

const TokenExpiredModal = ({ show, onLogin }) => {
    if (!show) return null;

    return (
        <div className="token-expired-modal-overlay">
            <div className="token-expired-modal">
                <div className="token-expired-icon">⏰</div>
                <h2>Sessão Expirada</h2>
                <p>Sua sessão expirou por motivos de segurança. Por favor, faça login novamente para continuar.</p>
                
                <div className="token-expired-actions">
                    <button 
                        className="btn btn-primary"
                        onClick={onLogin}
                    >
                        Fazer Login Novamente
                    </button>
                </div>
                
                <div className="token-expired-info">
                    <small>
                        Por segurança, sua sessão expira automaticamente após um período de inatividade.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default TokenExpiredModal;
