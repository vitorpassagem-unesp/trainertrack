// Script para testar as rotas de clientes filtradas por treinador
const https = require('https');

// Função auxiliar para fazer requisições HTTP
function makeRequest(options) {
    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({
                        status: res.statusCode,
                        data: jsonData,
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        status: res.statusCode,
                        data: data,
                        headers: res.headers
                    });
                }
            });
        });
        
        req.on('error', reject);
        
        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        
        req.end();
    });
}

async function testClientRoutes() {
    console.log('🧪 === TESTE DAS ROTAS DE CLIENTES ===\n');

    try {
        // 1. Login como treinador
        console.log('1. 🔐 Fazendo login como treinador...');
        const loginOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: {
                email: 'ricardo.costa@trainer.com',
                password: 'trainer123'
            }
        };

        const loginResponse = await makeRequest(loginOptions);
        
        if (loginResponse.status === 200) {
            console.log('✅ Login realizado com sucesso');
            console.log('Treinador:', loginResponse.data.user?.profile?.firstName, loginResponse.data.user?.profile?.lastName);
            
            const token = loginResponse.data.token;
            
            // 2. Testar rota /api/clients/ (deve retornar apenas clientes do treinador)
            console.log('\n2. 📋 Testando /api/clients/ (deve filtrar por treinador)...');
            const clientsOptions = {
                hostname: 'localhost',
                port: 5000,
                path: '/api/clients/',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const clientsResponse = await makeRequest(clientsOptions);
            
            if (clientsResponse.status === 200) {
                console.log('✅ Clientes carregados com sucesso');
                console.log('Número de clientes:', Array.isArray(clientsResponse.data) ? clientsResponse.data.length : 'N/A');
                
                if (Array.isArray(clientsResponse.data)) {
                    clientsResponse.data.forEach((client, index) => {
                        console.log(`  ${index + 1}. ${client.name || 'Nome não definido'} - Treinador: ${client.trainer?.profile?.firstName || 'N/A'} ${client.trainer?.profile?.lastName || ''}`);
                    });
                }
            } else {
                console.log('❌ Erro na rota /api/clients/:');
                console.log('  Status:', clientsResponse.status);
                console.log('  Response:', clientsResponse.data);
            }

            // 3. Testar rota /api/trainer/my-clients
            console.log('\n3. 👥 Testando /api/trainer/my-clients...');
            const trainerClientsOptions = {
                hostname: 'localhost',
                port: 5000,
                path: '/api/trainer/my-clients',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const trainerClientsResponse = await makeRequest(trainerClientsOptions);
            
            if (trainerClientsResponse.status === 200) {
                console.log('✅ Clientes do treinador carregados com sucesso');
                console.log('Número de clientes:', Array.isArray(trainerClientsResponse.data) ? trainerClientsResponse.data.length : 'N/A');
                
                if (Array.isArray(trainerClientsResponse.data)) {
                    trainerClientsResponse.data.forEach((client, index) => {
                        console.log(`  ${index + 1}. ${client.name || 'Nome não definido'} - Email: ${client.email || 'N/A'}`);
                    });
                }
            } else {
                console.log('❌ Erro na rota /api/trainer/my-clients:');
                console.log('  Status:', trainerClientsResponse.status);
                console.log('  Response:', trainerClientsResponse.data);
            }

            // 4. Login como admin e testar se vê todos os clientes
            console.log('\n4. 👑 Fazendo login como admin...');
            const adminLoginOptions = {
                hostname: 'localhost',
                port: 5000,
                path: '/api/auth/login',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: {
                    email: 'admin@admin.com',
                    password: 'admin'
                }
            };

            const adminLoginResponse = await makeRequest(adminLoginOptions);
            
            if (adminLoginResponse.status === 200) {
                console.log('✅ Login admin realizado com sucesso');
                
                const adminToken = adminLoginResponse.data.token;
                
                // 5. Testar se admin vê todos os clientes
                console.log('\n5. 📋 Testando /api/clients/ como admin (deve ver todos)...');
                const adminClientsOptions = {
                    hostname: 'localhost',
                    port: 5000,
                    path: '/api/clients/',
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${adminToken}`,
                        'Content-Type': 'application/json'
                    }
                };

                const adminClientsResponse = await makeRequest(adminClientsOptions);
                
                if (adminClientsResponse.status === 200) {
                    console.log('✅ Admin - Todos os clientes carregados com sucesso');
                    console.log('Número total de clientes:', Array.isArray(adminClientsResponse.data) ? adminClientsResponse.data.length : 'N/A');
                } else {
                    console.log('❌ Erro na rota /api/clients/ (admin):');
                    console.log('  Status:', adminClientsResponse.status);
                    console.log('  Response:', adminClientsResponse.data);
                }
            } else {
                console.log('❌ Erro no login admin:', adminLoginResponse.status);
            }

        } else {
            console.log('❌ Erro no login do treinador:', loginResponse.status);
            console.log('Response:', loginResponse.data);
        }

        console.log('\n✅ Teste concluído!');

    } catch (error) {
        console.error('❌ Erro durante o teste:', error.message);
    }
}

// Executar o teste
testClientRoutes();
