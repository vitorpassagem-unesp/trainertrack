import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

// Ícones SVG para navegação
const HomeIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" fill={color}/>
    </svg>
);

const TrainerIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" fill={color}/>
    </svg>
);

const ClientsIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,4C18.21,4 20,5.79 20,8C20,10.21 18.21,12 16,12C13.79,12 12,10.21 12,8C12,5.79 13.79,4 16,4M16,14C20.42,14 24,15.79 24,18V20H8V18C8,15.79 11.58,14 16,14M8,4C10.21,4 12,5.79 12,8C12,10.21 10.21,12 8,12C5.79,12 4,10.21 4,8C4,5.79 5.79,4 8,4M8,14C12.42,14 16,15.79 16,18V20H0V18C0,15.79 3.58,14 8,14Z" fill={color}/>
    </svg>
);

const ActivitiesIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,11V3H8V7H2V21H22V11H16M10,5H14V19H10V5M4,9H8V19H4V9M20,13V19H16V13H20Z" fill={color}/>
    </svg>
);

const WorkoutIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.57,14.86L22,13.43L20.57,12L17,15.57L8.43,7L12,3.43L10.57,2L9.14,3.43L7.71,2L5.57,4.14L4.14,2.71L2.71,4.14L4.14,5.57L2,7.71L3.43,9.14L2,10.57L3.43,12L7,8.43L15.57,17L12,20.57L13.43,22L14.86,20.57L16.29,22L18.43,19.86L19.86,21.29L21.29,19.86L19.86,18.43L22,16.29L20.57,14.86Z" fill={color}/>
    </svg>
);

const ProgressIcon = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16,6L18.29,8.29L13.41,13.17L9.41,9.17L2,16.59L3.41,18L9.41,12L13.41,16L19.71,9.71L22,12V6H16Z" fill={color}/>
    </svg>
);

const TabNavigation = () => {
    const { user } = useContext(AuthContext);
    const location = useLocation();

    // Função para verificar se a aba está ativa
    const isActive = (path) => {
        return location.pathname === path || 
               (path === '/' && (location.pathname === '/dashboard' || location.pathname === '/'));
    };

    // Definir abas baseadas no tipo de usuário
    const getTabsForUser = () => {
        if (!user) return [];

        const commonTabs = [
            { path: '/', label: 'Dashboard', icon: HomeIcon }
        ];

        if (user.role === 'admin') {
            return [
                ...commonTabs,
                { path: '/admin/trainers', label: 'Treinadores', icon: TrainerIcon },
                { path: '/admin/clients', label: 'Todos os Clientes', icon: ClientsIcon },
                { path: '/admin/activities', label: 'Atividades', icon: ActivitiesIcon }
            ];
        } else if (user.role === 'trainer') {
            return [
                { path: '/trainer/dashboard', label: 'Dashboard', icon: HomeIcon },
                { path: '/clients', label: 'Meus Clientes', icon: ClientsIcon },
                { path: '/activities', label: 'Atividades', icon: ActivitiesIcon },
                { path: '/workout-plan', label: 'Planos de Treino', icon: WorkoutIcon }
            ];
        } else {
            return [
                ...commonTabs,
                { path: '/my-progress', label: 'Meu Progresso', icon: ProgressIcon },
                { path: '/my-workouts', label: 'Meus Treinos', icon: WorkoutIcon },
                { path: '/my-trainer', label: 'Meu Treinador', icon: TrainerIcon }
            ];
        }
    };

    const tabs = getTabsForUser();

    if (!user || tabs.length === 0) {
        return null;
    }

    return (
        <nav className="tab-navigation">
            <div className="tab-container">
                <div className="tab-list">
                    {tabs.map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`tab-item ${isActive(tab.path) ? 'active' : ''}`}
                        >
                            <div className="tab-icon">
                                {React.createElement(tab.icon, { size: 20 })}
                            </div>
                            <span className="tab-label">{tab.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default TabNavigation;
