// client/src/utils/httpInterceptor.js
import axios from 'axios';
import { authService } from '../services/auth.service';

let isRedirecting = false;

// Função para redirecionar para login
const redirectToLogin = () => {
    if (!isRedirecting) {
        isRedirecting = true;
        
        // Limpar dados de autenticação
        authService.logout();
        
        // Aguardar um pouco antes de redirecionar para evitar múltiplos redirecionamentos
        setTimeout(() => {
            window.location.href = '/login';
            isRedirecting = false;
        }, 100);
    }
};

// Interceptor para requisições
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para respostas
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        const { response } = error;
        
        // Verificar se o erro é de token expirado/inválido
        if (response && (response.status === 401 || response.status === 403)) {
            const errorMessage = response.data?.message || response.data?.error || '';
            
            // Verificar mensagens específicas de token inválido/expirado
            const tokenExpiredMessages = [
                'token expired',
                'token invalid',
                'jwt expired',
                'jwt malformed',
                'invalid token',
                'unauthorized',
                'no token provided',
                'access denied'
            ];
            
            const isTokenError = tokenExpiredMessages.some(msg => 
                errorMessage.toLowerCase().includes(msg)
            );
            
            if (isTokenError) {
                console.log('🔒 Token expirado ou inválido. Redirecionando para login...');
                redirectToLogin();
                return Promise.reject(new Error('Token expirado. Redirecionando para login...'));
            }
        }
        
        return Promise.reject(error);
    }
);

// Função para verificar se o token está expirado (decodificação JWT básica)
export const isTokenExpired = (token) => {
    if (!token) return true;
    
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const currentTime = Date.now() / 1000;
        
        // Verificar se o token tem campo exp e se está expirado
        if (payload.exp && payload.exp < currentTime) {
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Erro ao verificar expiração do token:', error);
        return true; // Se não conseguir verificar, considerar expirado
    }
};

// Função para verificar token periodicamente
export const startTokenValidation = () => {
    const checkToken = () => {
        const token = localStorage.getItem('token');
        
        if (token && isTokenExpired(token)) {
            console.log('🔒 Token expirado detectado. Redirecionando para login...');
            redirectToLogin();
            return;
        }
        
        // Verificar novamente em 1 minuto
        setTimeout(checkToken, 60000);
    };
    
    // Iniciar verificação
    checkToken();
};

export default {
    isTokenExpired,
    startTokenValidation,
    redirectToLogin
};
