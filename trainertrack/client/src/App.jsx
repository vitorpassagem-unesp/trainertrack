import React from 'react';
import AppRoutes from './routes';
import './styles.css';
import './utils/httpInterceptor'; // Importar interceptor HTTP

const App = () => {
    return (
        <div className="app">
            <AppRoutes />
        </div>
    );
};

export default App;