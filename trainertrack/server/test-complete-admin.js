// Script para testar login e acesso admin completo
const http = require('http');

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        
        req.on('error', (err) => {
            reject(err);
        });
        
        if (postData) {
            req.write(postData);
        }
        
        req.end();
    });
}

async function testCompleteAdminFlow() {
    try {
        console.log('🔑 Fazendo login como admin...');
        
        // Login como admin
        const loginOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        const loginData = JSON.stringify({
            email: 'admin@admin.com',
            password: 'admin'
        });

        const loginResponse = await makeRequest(loginOptions, loginData);
        
        if (loginResponse.status !== 200) {
            console.log('❌ Falha no login');
            console.log('Status:', loginResponse.status);
            console.log('Response:', loginResponse.data);
            return;
        }

        console.log('✅ Login realizado com sucesso');
        console.log('Response data:', loginResponse.data);

        const token = loginResponse.data.token || loginResponse.data.accessToken;
        if (!token) {
            console.log('❌ Nenhum token retornado no login');
            return;
        }

        console.log('🔐 Token obtido:', token.substring(0, 20) + '...');
        console.log('👤 Usuário:', loginResponse.data.user);

        // Testar rota de stats
        console.log('\n📊 Testando dashboard stats...');
        try {
            const statsOptions = {
                hostname: 'localhost',
                port: 5000,
                path: '/api/admin/dashboard/stats',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            
            const statsResponse = await makeRequest(statsOptions);
            
            if (statsResponse.status === 200) {
                console.log('✅ Stats carregadas com sucesso');
                console.log('Stats:', JSON.stringify(statsResponse.data, null, 2));
            } else {
                console.log('❌ Erro nas stats:');
                console.log('  Status:', statsResponse.status);
                console.log('  Response:', statsResponse.data);
            }
        } catch (error) {
            console.log('❌ Erro nas stats:', error.message);
        }

        // Testar rota de trainers
        console.log('\n👨‍💼 Testando lista de trainers...');
        try {
            const trainersOptions = {
                hostname: 'localhost',
                port: 5000,
                path: '/api/admin/trainers',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            
            const trainersResponse = await makeRequest(trainersOptions);
            
            if (trainersResponse.status === 200) {
                console.log('✅ Trainers carregados com sucesso');
                console.log('Trainers:', Array.isArray(trainersResponse.data) ? trainersResponse.data.length : 'N/A', 'encontrados');
            } else {
                console.log('❌ Erro nos trainers:');
                console.log('  Status:', trainersResponse.status);
                console.log('  Response:', trainersResponse.data);
            }
        } catch (error) {
            console.log('❌ Erro nos trainers:', error.message);
        }

        // Testar rota de clients
        console.log('\n🏃‍♂️ Testando lista de clientes...');
        try {
            const clientsOptions = {
                hostname: 'localhost',
                port: 5000,
                path: '/api/admin/clients',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };
            
            const clientsResponse = await makeRequest(clientsOptions);
            
            if (clientsResponse.status === 200) {
                console.log('✅ Clientes carregados com sucesso');
                console.log('Clientes:', Array.isArray(clientsResponse.data) ? clientsResponse.data.length : 'N/A', 'encontrados');
            } else {
                console.log('❌ Erro nos clientes:');
                console.log('  Status:', clientsResponse.status);
                console.log('  Response:', clientsResponse.data);
            }
        } catch (error) {
            console.log('❌ Erro nos clientes:', error.message);
        }

    } catch (error) {
        console.error('❌ Erro no teste geral:', error.message);
    }
}

testCompleteAdminFlow();
