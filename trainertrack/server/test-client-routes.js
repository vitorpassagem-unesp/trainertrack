// Script para testar as novas rotas de cliente
const http = require('http');

// Função para fazer requisições HTTP
function makeRequest(options, data) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
            });
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

async function testRoutes() {
    console.log('🔍 Testando rotas de cliente...');

    try {
        // 1. Primeiro fazer login como cliente para obter token
        console.log('\n1. Fazendo login como cliente...');
        const loginData = JSON.stringify({
            email: 'joao.pereira@client.com',
            password: 'client123'
        });

        const loginOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth/login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(loginData)
            }
        };

        const loginResponse = await makeRequest(loginOptions, loginData);
        console.log('Login Status:', loginResponse.statusCode);
        console.log('Login Response:', loginResponse.body);

        if (loginResponse.statusCode !== 200) {
            console.log('❌ Login falhou, não é possível testar as rotas protegidas');
            return;
        }

        const loginResult = JSON.parse(loginResponse.body);
        const token = loginResult.token;
        console.log('✅ Login realizado com sucesso');

        // 2. Testar rota /api/clients/my-data
        console.log('\n2. Testando /api/clients/my-data...');
        const myDataOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/clients/my-data',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const myDataResponse = await makeRequest(myDataOptions);
        console.log('My Data Status:', myDataResponse.statusCode);
        console.log('My Data Response:', myDataResponse.body);

        // 3. Testar rota /api/clients/my-trainer
        console.log('\n3. Testando /api/clients/my-trainer...');
        const myTrainerOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/clients/my-trainer',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const myTrainerResponse = await makeRequest(myTrainerOptions);
        console.log('My Trainer Status:', myTrainerResponse.statusCode);
        console.log('My Trainer Response:', myTrainerResponse.body);

        // 4. Testar rota /api/workouts/my-workouts
        console.log('\n4. Testando /api/workouts/my-workouts...');
        const myWorkoutsOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/workouts/my-workouts',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const myWorkoutsResponse = await makeRequest(myWorkoutsOptions);
        console.log('My Workouts Status:', myWorkoutsResponse.statusCode);
        console.log('My Workouts Response:', myWorkoutsResponse.body);

        // 5. Testar se existe dados de cliente criados
        console.log('\n5. Testando se há dados de clientes...');
        const allClientsOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/clients',
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const allClientsResponse = await makeRequest(allClientsOptions);
        console.log('All Clients Status:', allClientsResponse.statusCode);
        console.log('All Clients Response (first 200 chars):', allClientsResponse.body.substring(0, 200));

        console.log('\n✅ Teste de rotas concluído');

    } catch (error) {
        console.error('❌ Erro ao testar rotas:', error);
    }
}

testRoutes();
