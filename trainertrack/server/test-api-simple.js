// Script simples para testar API admin
const http = require('http');

function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        console.log(`🌐 Fazendo requisição: ${options.method} ${options.hostname}:${options.port}${options.path}`);
        
        const req = http.request(options, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                console.log(`📊 Status: ${res.statusCode}`);
                console.log(`📄 Headers:`, res.headers);
                
                try {
                    const jsonData = JSON.parse(data);
                    console.log(`✅ JSON Response:`, jsonData);
                    resolve({ status: res.statusCode, data: jsonData, headers: res.headers });
                } catch (e) {
                    console.log(`📄 Raw Response:`, data);
                    resolve({ status: res.statusCode, data: data, headers: res.headers });
                }
            });
        });
        
        req.on('error', (err) => {
            console.error(`❌ Erro na requisição:`, err);
            reject(err);
        });
        
        if (postData) {
            console.log(`📤 Enviando dados:`, postData);
            req.write(postData);
        }
        
        req.end();
    });
}

async function testAPI() {
    try {
        console.log('=== TESTE DE LOGIN ===');
        
        // 1. Fazer login
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
            console.log('❌ FALHA NO LOGIN');
            return;
        }

        console.log('✅ LOGIN SUCESSO');
        const token = loginResponse.data.token || loginResponse.data.accessToken;
        
        if (!token) {
            console.log('❌ TOKEN NÃO ENCONTRADO NA RESPOSTA');
            return;
        }

        console.log(`🔐 Token: ${token.substring(0, 50)}...`);
        
        // 2. Testar endpoint admin
        console.log('\n=== TESTE DE ENDPOINT ADMIN ===');
        
        const adminOptions = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/admin/dashboard/stats',
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        };
        
        const adminResponse = await makeRequest(adminOptions);
        
        if (adminResponse.status === 200) {
            console.log('✅ ENDPOINT ADMIN FUNCIONANDO');
        } else {
            console.log('❌ ENDPOINT ADMIN FALHOU');
        }

    } catch (error) {
        console.error('❌ Erro geral:', error);
    }
}

console.log('🚀 Iniciando teste da API...');
testAPI();
