import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Redirect } from 'react-router-dom';

const AdminPage = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalClients: 0,
        totalWorkouts: 0
    });

    useEffect(() => {
        // Here you would fetch admin-related data from your API
        const fetchAdminData = async () => {
            try {
                // These are placeholder API calls - implement these endpoints on your server
                // const usersResponse = await fetch('/api/admin/users');
                // const statsResponse = await fetch('/api/admin/stats');
                
                // const usersData = await usersResponse.json();
                // const statsData = await statsResponse.json();
                
                // Mocked data for demonstration
                setUsers([
                    { id: 1, username: 'trainer1', email: 'trainer1@example.com', role: 'user' },
                    { id: 2, username: 'trainer2', email: 'trainer2@example.com', role: 'user' },
                    { id: 3, username: 'admin', email: 'admin@example.com', role: 'admin' }
                ]);
                
                setStats({
                    totalUsers: 3,
                    totalClients: 15,
                    totalWorkouts: 28
                });
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching admin data:', error);
                setLoading(false);
            }
        };

        fetchAdminData();
    }, []);

    // If user is not admin, redirect to dashboard
    if (user && user.role !== 'admin') {
        return <Redirect to="/" />;
    }

    if (loading) {
        return (
            <div className="admin-page">
                <h1>Admin Dashboard</h1>
                <div className="loading">Loading admin data...</div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>
            
            <div className="admin-stats">
                <div className="stat-card">
                    <h2>Users</h2>
                    <div className="stat-value">{stats.totalUsers}</div>
                </div>
                
                <div className="stat-card">
                    <h2>Clients</h2>
                    <div className="stat-value">{stats.totalClients}</div>
                </div>
                
                <div className="stat-card">
                    <h2>Workouts</h2>
                    <div className="stat-value">{stats.totalWorkouts}</div>
                </div>
            </div>
            
            <div className="admin-section">
                <h2>User Management</h2>
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>
                                    <button className="edit-button">Edit</button>
                                    <button className="delete-button">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminPage;
