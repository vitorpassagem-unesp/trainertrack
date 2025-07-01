import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';

const UserDebugInfo = () => {
    const { user, isAuthenticated } = useContext(AuthContext) || {};
    const [testResult, setTestResult] = useState('');
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const storedUser = localStorage.getItem('user');
    
    let parsedStoredUser = null;
    try {
        if (storedUser) {
            parsedStoredUser = JSON.parse(storedUser);
        }
    } catch (e) {
        parsedStoredUser = { error: 'Failed to parse' };
    }

    // Decode token to check expiration
    let tokenInfo = null;
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            
            tokenInfo = JSON.parse(jsonPayload);
        } catch (e) {
            tokenInfo = { error: 'Invalid token format' };
        }
    }

    const testAdminAPI = async () => {
        setTestResult('Testing...');
        try {
            const response = await fetch('http://localhost:5000/api/admin/dashboard/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.ok) {
                setTestResult('✅ API works!');
            } else {
                const errorText = await response.text();
                setTestResult(`❌ ${response.status}: ${errorText}`);
            }
        } catch (error) {
            setTestResult(`❌ Error: ${error.message}`);
        }
    };

    return (
        <div style={{ 
            position: 'fixed', 
            top: '10px', 
            right: '10px', 
            background: '#f0f0f0', 
            padding: '10px', 
            border: '1px solid #ccc',
            fontSize: '11px',
            zIndex: 9999,
            maxWidth: '350px',
            fontFamily: 'monospace',
            maxHeight: '300px',
            overflowY: 'auto'
        }}>
            <strong>🔍 Debug Info:</strong><br/>
            <strong>Auth Status:</strong><br/>
            • Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}<br/>
            • Token exists: {token ? '✅ Yes' : '❌ No'}<br/>
            {token && (
                <>
                    • Token length: {token.length}<br/>
                    • Token preview: {token.substring(0, 20)}...<br/>
                    {tokenInfo && !tokenInfo.error && (
                        <>
                            • Token ID: {tokenInfo.id}<br/>
                            • Token role: {tokenInfo.role}<br/>
                            • Token exp: {tokenInfo.exp ? new Date(tokenInfo.exp * 1000).toLocaleString() : 'N/A'}<br/>
                            • Token valid: {tokenInfo.exp && tokenInfo.exp > Date.now() / 1000 ? '✅' : '❌'}<br/>
                        </>
                    )}
                </>
            )}
            <strong>User Data:</strong><br/>
            • Role (localStorage): {userRole || '❌ None'}<br/>
            • Context User: {user ? `✅ ${user.username} (${user.role})` : '❌ None'}<br/>
            • Stored User: {parsedStoredUser && !parsedStoredUser.error ? `✅ ${parsedStoredUser.username || 'No username'} (${parsedStoredUser.role || 'No role'})` : '❌ None/Error'}<br/>
            
            <strong>API Test:</strong><br/>
            <button 
                onClick={testAdminAPI} 
                style={{ 
                    fontSize: '10px', 
                    padding: '2px 4px', 
                    marginRight: '5px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    cursor: 'pointer'
                }}
            >
                Test Admin API
            </button>
            {testResult && <span>{testResult}</span>}
        </div>
    );
};

export default UserDebugInfo;
