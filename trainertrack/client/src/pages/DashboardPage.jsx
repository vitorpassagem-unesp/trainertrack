import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Link, useHistory } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import Dashboard from '../components/dashboard/Dashboard';
import Stats from '../components/dashboard/Stats';

// Ícones SVG para os módulos do dashboard
const WorkoutIcon = ({ size = 32, color = '#6366f1' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z" fill={color}/>
    </svg>
);

const ProgressIcon = ({ size = 32, color = '#10b981' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" fill={color}/>
    </svg>
);

const TrainerIcon = ({ size = 32, color = '#f59e0b' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" fill={color}/>
    </svg>
);

const DashboardPage = () => {
    const { user } = useContext(AuthContext);
    const history = useHistory();

    // Redirecionar treinadores para a página específica
    useEffect(() => {
        if (user && user.role === 'trainer') {
            history.push('/trainer/dashboard');
        }
    }, [user, history]);

    if (!user) {
        return <div>Carregando...</div>;
    }

    // Se for admin, mostrar dashboard de admin
    if (user.role === 'admin') {
        return <AdminDashboard />;
    }

    // Se for cliente (role 'user'), mostrar dashboard de cliente
    if (user.role === 'user') {
        return (
            <div className="client-dashboard">
                <h1>Painel - Cliente</h1>
                <div className="welcome-message">
                    <h2>Bem-vindo, {user.name || user.username}!</h2>
                    <p>Aqui você pode acompanhar seus treinos e progressos.</p>
                </div>
                <div className="client-stats">
                    <Link to="/my-workouts" className="stat-card-link">
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon">
                                    <WorkoutIcon size={28} color="#6366f1" />
                                </div>
                                <h3 className="stat-title">Meus Treinos</h3>
                            </div>
                            <p>Visualize seus planos de treino e exercícios.</p>
                            <span className="card-action">Ver Treinos →</span>
                        </div>
                    </Link>
                    <Link to="/my-progress" className="stat-card-link">
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon">
                                    <ProgressIcon size={28} color="#10b981" />
                                </div>
                                <h3 className="stat-title">Meu Progresso</h3>
                            </div>
                            <p>Acompanhe sua evolução e métricas corporais.</p>
                            <span className="card-action">Ver Progresso →</span>
                        </div>
                    </Link>
                    <Link to="/my-trainer" className="stat-card-link">
                        <div className="stat-card">
                            <div className="stat-header">
                                <div className="stat-icon">
                                    <TrainerIcon size={28} color="#f59e0b" />
                                </div>
                                <h3 className="stat-title">Meu Treinador</h3>
                            </div>
                            <p>Informações sobre seu personal trainer.</p>
                            <span className="card-action">Ver Treinador →</span>
                        </div>
                    </Link>
                </div>
            </div>
        );
    }

    // Fallback para outros tipos de usuário
    return (
        <div className="dashboard">
            <h1>Painel</h1>
            <div className="welcome-message">
                <h2>Bem-vindo, {user.name || user.username}!</h2>
                <p>Tipo de usuário: {user.role || 'Não definido'}</p>
            </div>
        </div>
    );
};

export default DashboardPage;