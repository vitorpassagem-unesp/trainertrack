// Script simples para testar uma rota específica
const http = require('http');

async function testSingleRoute() {
    console.log('🔍 Testando rota específica...');

    try {
        // 1. Login
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

        const loginResponse = await new Promise((resolve, reject) => {
            const req = http.request(loginOptions, (res) => {
                let body = '';
                res.on('data', (chunk) => { body += chunk; });
                res.on('end', () => { resolve({ statusCode: res.statusCode, body }); });
            });
            req.on('error', reject);
            req.write(loginData);
            req.end();
        });

        if (loginResponse.statusCode !== 200) {
            console.log('❌ Login falhou');
            return;
        }

        const loginResult = JSON.parse(loginResponse.body);
        const token = loginResult.token;
        console.log('✅ Login OK, token:', token.substring(0, 50) + '...');

        // 2. Test my-data route
        const testResponse = await new Promise((resolve, reject) => {
            const req = http.request({
                hostname: 'localhost',
                port: 5000,
                path: '/api/clients/my-data',
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }, (res) => {
                let body = '';
                res.on('data', (chunk) => { body += chunk; });
                res.on('end', () => { resolve({ statusCode: res.statusCode, body }); });
            });
            req.on('error', reject);
            req.end();
        });

        console.log('Status:', testResponse.statusCode);
        console.log('Response:', testResponse.body);

    } catch (error) {
        console.error('❌ Erro:', error);
    }
}

testSingleRoute();
