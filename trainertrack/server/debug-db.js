// Script para debugar o problema das rotas de cliente
const mongoose = require('mongoose');
const { dbConfig } = require('./config/db');
const User = require('./models/user.model');
const Client = require('./models/client.model');

async function debugDatabase() {
    try {
        console.log('🔗 Conectando ao MongoDB...');
        await mongoose.connect(dbConfig.url, dbConfig.options);
        console.log('✅ Conectado ao MongoDB');

        // 1. Buscar o usuário João
        console.log('\n📍 Buscando usuário João...');
        const user = await User.findOne({ email: 'joao.pereira@client.com' });
        if (user) {
            console.log('✅ Usuário encontrado:');
            console.log('ID:', user._id);
            console.log('Username:', user.username);
            console.log('Email:', user.email);
            console.log('Role:', user.role);
        } else {
            console.log('❌ Usuário não encontrado');
            return;
        }

        // 2. Buscar todos os clientes
        console.log('\n📍 Buscando todos os clientes...');
        const allClients = await Client.find({});
        console.log(`✅ Encontrados ${allClients.length} clientes:`);
        
        allClients.forEach((client, index) => {
            console.log(`Cliente ${index + 1}:`);
            console.log('  ID:', client._id);
            console.log('  Nome:', client.name);
            console.log('  Email:', client.email);
            console.log('  User ID:', client.user);
            console.log('  User ID tipo:', typeof client.user);
            console.log('  ---');
        });

        // 3. Buscar cliente específico pelo user ID
        console.log('\n📍 Buscando cliente pelo user ID...');
        const clientByUserId = await Client.findOne({ user: user._id });
        if (clientByUserId) {
            console.log('✅ Cliente encontrado pelo user ID:');
            console.log('Cliente ID:', clientByUserId._id);
            console.log('Nome:', clientByUserId.name);
            console.log('Email:', clientByUserId.email);
        } else {
            console.log('❌ Cliente não encontrado pelo user ID');
            
            // Tentar buscar por email
            console.log('\n📍 Tentando buscar cliente pelo email...');
            const clientByEmail = await Client.findOne({ email: user.email });
            if (clientByEmail) {
                console.log('✅ Cliente encontrado pelo email:');
                console.log('Cliente ID:', clientByEmail._id);
                console.log('Nome:', clientByEmail.name);
                console.log('User ID no cliente:', clientByEmail.user);
                
                // Comparar IDs
                console.log('\n🔍 Comparação de IDs:');
                console.log('User ID do banco:', user._id);
                console.log('User ID no cliente:', clientByEmail.user);
                console.log('São iguais?', user._id.equals(clientByEmail.user));
                console.log('String do user ID:', user._id.toString());
                console.log('String do user ID no cliente:', clientByEmail.user ? clientByEmail.user.toString() : 'null');
            } else {
                console.log('❌ Cliente também não encontrado pelo email');
            }
        }

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        mongoose.disconnect();
    }
}

debugDatabase();
