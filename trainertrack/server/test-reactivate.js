// Teste simples da rota de reativar
const http = require('http');

async function testReactivateRoute() {
    try {
        // Primeiro fazer login
        console.log('🔑 Fazendo login...');
        
        const loginData = JSON.stringify({
            email: 'admin@admin.com',
            password: 'admin'
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

        const loginResponse = await new Promise((resolve, reject) => {
            const req = http.request(loginOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        resolve({ status: res.statusCode, data: JSON.parse(data) });
                    } catch (e) {
                        resolve({ status: res.statusCode, data: data });
                    }
                });
            });
            req.on('error', reject);
            req.write(loginData);
            req.end();
        });

        if (loginResponse.status !== 200) {
            console.log('❌ Login failed:', loginResponse);
            return;
        }

        const token = loginResponse.data.token;
        console.log('✅ Login successful, token:', token.substring(0, 20) + '...');

        // Testar rota de reativar com um ID fictício
        console.log('\n🔄 Testando rota de reativar...');
        
        const testTrainerId = '507f1f77bcf86cd799439011'; // ID MongoDB fictício
        
        const reactivateOptions = {
            hostname: 'localhost',
            port: 5000,
            path: `/api/admin/trainers/${testTrainerId}/reactivate`,
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };

        const reactivateResponse = await new Promise((resolve, reject) => {
            const req = http.request(reactivateOptions, (res) => {
                let data = '';
                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => {
                    try {
                        resolve({ status: res.statusCode, data: JSON.parse(data) });
                    } catch (e) {
                        resolve({ status: res.statusCode, data: data });
                    }
                });
            });
            req.on('error', reject);
            req.end();
        });

        console.log('📋 Reactivate response:');
        console.log('  Status:', reactivateResponse.status);
        console.log('  Data:', reactivateResponse.data);

        if (reactivateResponse.status === 404) {
            console.log('❌ Rota não encontrada - verifique se o servidor foi reiniciado');
        } else if (reactivateResponse.status === 404 && reactivateResponse.data.message === 'Trainer not found') {
            console.log('✅ Rota funciona, apenas o treinador não existe (esperado)');
        }

    } catch (error) {
        console.error('❌ Erro:', error);
    }
}

testReactivateRoute();
