import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientsPage from './pages/ClientsPage';
import ClientDetailPage from './pages/ClientDetailPage';
import DashboardPage from './pages/DashboardPage';
import TrainerDashboardPage from './pages/TrainerDashboardPage';
import ActivitiesPage from './pages/ActivitiesPage';
import WorkoutPlanPage from './pages/WorkoutPlanPage';
import TrainersManagementPage from './pages/TrainersManagementPage';
import AllClientsPage from './pages/AllClientsPage';
import MyWorkoutsPage from './pages/MyWorkoutsPage';
import MyProgressPage from './pages/MyProgressPage';
import MyTrainerPage from './pages/MyTrainerPage';
import TrainerForm from './components/admin/TrainerForm';
import Header from './components/shared/Header';
import TabNavigation from './components/shared/TabNavigation';
import Footer from './components/shared/Footer';
import { AuthProvider } from './contexts/AuthContext';
import { ClientProvider } from './contexts/ClientContext';
import { WorkoutProvider } from './contexts/WorkoutContext';
import { authService } from './services/auth.service';
import useAuthValidation from './hooks/useAuthValidation';

// Protected route component with token validation
const ProtectedRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                const isAuthenticated = authService.isAuthenticated ? authService.isAuthenticated() : false;
                
                if (!isAuthenticated) {
                    console.log('🔒 Usuário não autenticado. Redirecionando para login...');
                    return <Redirect to="/login" />;
                }
                
                return <Component {...props} />;
            }}
        />
    );
};

// Admin route component - requires both authentication and admin role
const AdminRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                const isAuthenticated = authService.isAuthenticated ? authService.isAuthenticated() : false;
                const user = authService.getCurrentUser ? authService.getCurrentUser() : null;
                
                if (!isAuthenticated) {
                    console.log('🔒 Admin route: Usuário não autenticado. Redirecionando para login...');
                    return <Redirect to="/login" />;
                }
                
                if (!user || user.role !== 'admin') {
                    console.log('🔒 Admin route: Usuário não é admin. Redirecionando para dashboard...');
                    return <Redirect to="/" />;
                }
                
                return <Component {...props} />;
            }}
        />
    );
};

// Trainer route component - requires authentication and trainer role
const TrainerRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => {
                const isAuthenticated = authService.isAuthenticated ? authService.isAuthenticated() : false;
                const user = authService.getCurrentUser ? authService.getCurrentUser() : null;
                
                if (!isAuthenticated) {
                    console.log('🔒 Trainer route: Usuário não autenticado. Redirecionando para login...');
                    return <Redirect to="/login" />;
                }
                
                if (!user || user.role !== 'trainer') {
                    console.log('🔒 Trainer route: Usuário não é treinador. Redirecionando para dashboard...');
                    return <Redirect to="/" />;
                }
                
                return <Component {...props} />;
            }}
        />
    );
};

const AppRoutes = () => {
    return (
        <Router>
            <AuthProvider>
                <ClientProvider>
                    <WorkoutProvider>
                        <Header />
                        <TabNavigation />
                        <main className="main-content">
                            <Switch>
                                <Route path="/login" component={LoginPage} />
                                <Route path="/register" component={RegisterPage} />
                                
                                <ProtectedRoute path="/" exact component={DashboardPage} />
                                <ProtectedRoute path="/dashboard" component={DashboardPage} />
                                <ProtectedRoute path="/clients" component={ClientsPage} />
                                <ProtectedRoute path="/clients/:clientId" component={ClientDetailPage} />
                                <ProtectedRoute path="/workout-plan" component={WorkoutPlanPage} />
                                
                                {/* Trainer routes */}
                                <TrainerRoute path="/trainer/dashboard" component={TrainerDashboardPage} />
                                <TrainerRoute path="/activities" component={ActivitiesPage} />
                                
                                {/* Client routes */}
                                <ProtectedRoute path="/my-workouts" component={MyWorkoutsPage} />
                                <ProtectedRoute path="/my-progress" component={MyProgressPage} />
                                <ProtectedRoute path="/my-trainer" component={MyTrainerPage} />
                                
                                {/* Admin routes */}
                                <AdminRoute path="/admin/trainers" exact component={TrainersManagementPage} />
                                <AdminRoute path="/admin/clients" exact component={AllClientsPage} />
                                <AdminRoute path="/admin/activities" exact component={ActivitiesPage} />
                                <AdminRoute path="/admin/trainers/new" component={TrainerForm} />
                                <AdminRoute path="/admin/trainers/:trainerId/edit" component={TrainerForm} />
                                
                                <Redirect to="/login" />
                            </Switch>
                        </main>
                        <Footer />
                    </WorkoutProvider>
                </ClientProvider>
            </AuthProvider>
        </Router>
    );
};

export default AppRoutes;