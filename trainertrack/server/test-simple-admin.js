// Teste simples de login e admin
const http = require('http');

async function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    resolve({ status: res.statusCode, data: data });
                }
            });
        });
        req.on('error', reject);
        if (postData) req.write(postData);
        req.end();
    });
}

async function testAdminAuth() {
    console.log('🔑 Fazendo login...');
    
    const loginResponse = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: '/api/auth/login',
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({
        email: 'admin@admin.com',
        password: 'admin'
    }));
    
    console.log('📋 Login response:', loginResponse.status, loginResponse.data);
    
    if (loginResponse.status !== 200) {
        console.log('❌ Login falhou');
        return;
    }
    
    const token = loginResponse.data.token;
    console.log('🔐 Token:', token.substring(0, 30) + '...');
    
    console.log('\n📊 Testando admin stats...');
    const statsResponse = await makeRequest({
        hostname: 'localhost',
        port: 5000,
        path: '/api/admin/dashboard/stats',
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log('📋 Stats response:', statsResponse.status, statsResponse.data);
}

testAdminAuth().catch(console.error);
