// client/src/hooks/useAuthValidation.js
import { useEffect, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { authService } from '../services/auth.service';
import { isTokenExpired } from '../utils/httpInterceptor';

export const useAuthValidation = () => {
    const { user, logout } = useContext(AuthContext);
    const history = useHistory();

    useEffect(() => {
        const validateAuth = () => {
            const token = localStorage.getItem('token');
            
            // Se não há token, redirecionar para login
            if (!token) {
                if (user) {
                    logout();
                }
                return;
            }

            // Se token expirado, fazer logout e redirecionar
            if (isTokenExpired(token)) {
                console.log('🔒 Token expirado detectado no hook. Fazendo logout...');
                logout();
                history.push('/login');
                return;
            }

            // Se há token válido mas não há usuário no contexto, tentar recuperar
            if (!user && token && !isTokenExpired(token)) {
                const storedUser = authService.getCurrentUser();
                if (!storedUser) {
                    // Se não conseguir recuperar usuário, fazer logout
                    logout();
                    history.push('/login');
                }
            }
        };

        // Validar imediatamente
        validateAuth();

        // Configurar validação periódica (a cada 30 segundos)
        const interval = setInterval(validateAuth, 30000);

        // Cleanup
        return () => clearInterval(interval);
    }, [user, logout, history]);

    return {
        isValid: authService.isAuthenticated(),
        user
    };
};

export default useAuthValidation;
