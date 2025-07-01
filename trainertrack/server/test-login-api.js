// Script para testar a API de login diretamente
const axios = require('axios');

async function testLoginAPI() {
    try {
        console.log('🔍 Testando API de login...');
        
        const response = await axios.post('http://localhost:5000/api/auth/login', {
            email: 'admin@admin.com',
            password: 'admin'
        });

        console.log('✅ Login bem-sucedido!');
        console.log('Status:', response.status);
        console.log('Dados retornados:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.log('❌ Erro no login:');
        if (error.response) {
            console.log('Status:', error.response.status);
            console.log('Dados do erro:', error.response.data);
        } else {
            console.log('Erro de rede:', error.message);
        }
    }
}

testLoginAPI();
