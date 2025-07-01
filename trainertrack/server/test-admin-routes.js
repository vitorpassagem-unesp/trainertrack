// Script para testar as rotas de admin
const axios = require('axios');

async function testAdminRoutes() {
    try {
        console.log('🔐 Testando login do admin...');
        
        // Login como admin
        const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@admin.com',
            password: 'admin'
        });

        const token = loginResponse.data.token;
        console.log('✅ Login realizado com sucesso');
        console.log('Token:', token);
        console.log('User:', loginResponse.data.user);

        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };

        // Testar rota de stats
        console.log('\n📊 Testando dashboard stats...');
        try {
            const statsResponse = await axios.get('http://localhost:5000/api/admin/dashboard/stats', { headers });
            console.log('✅ Stats carregadas:', statsResponse.data);
        } catch (error) {
            console.log('❌ Erro nas stats:', error.response?.data || error.message);
        }

        // Testar rota de trainers
        console.log('\n👨‍💼 Testando lista de trainers...');
        try {
            const trainersResponse = await axios.get('http://localhost:5000/api/admin/trainers', { headers });
            console.log('✅ Trainers carregados:', trainersResponse.data.length, 'encontrados');
            trainersResponse.data.forEach(trainer => {
                console.log(`  - ${trainer.username} (${trainer.email}) - ${trainer.clientCount} clientes`);
            });
        } catch (error) {
            console.log('❌ Erro nos trainers:', error.response?.data || error.message);
        }

        // Testar rota de clients
        console.log('\n🏃‍♂️ Testando lista de clientes...');
        try {
            const clientsResponse = await axios.get('http://localhost:5000/api/admin/clients', { headers });
            console.log('✅ Clientes carregados:', clientsResponse.data.length, 'encontrados');
            clientsResponse.data.forEach(client => {
                console.log(`  - ${client.name} (${client.email}) - Treinador: ${client.trainer?.username || 'Nenhum'}`);
            });
        } catch (error) {
            console.log('❌ Erro nos clientes:', error.response?.data || error.message);
        }

    } catch (error) {
        console.error('❌ Erro no login:', error.response?.data || error.message);
    }
}

testAdminRoutes();
