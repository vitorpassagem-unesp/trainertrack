// Script para testar as credenciais do admin
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { dbConfig } = require('./config/db');
const User = require('./models/user.model');

async function testAdminCredentials() {
    try {
        console.log('Conectando ao MongoDB...');
        await mongoose.connect(dbConfig.url, dbConfig.options);
        console.log('Conectado ao MongoDB');

        // Buscar o usuário admin
        const adminUser = await User.findOne({ email: 'admin@admin.com' });
        
        if (!adminUser) {
            console.log('❌ Usuário admin não encontrado!');
            return;
        }

        console.log('✅ Usuário admin encontrado:');
        console.log('  ID:', adminUser._id);
        console.log('  Username:', adminUser.username);
        console.log('  Email:', adminUser.email);
        console.log('  Role:', adminUser.role);
        console.log('  Created:', adminUser.createdAt);

        // Testar a senha
        const testPassword = 'admin';
        const isPasswordValid = await bcrypt.compare(testPassword, adminUser.password);
        
        console.log('\n🔐 Testando senha:');
        console.log('  Senha testada:', testPassword);
        console.log('  Hash armazenado:', adminUser.password);
        console.log('  Resultado:', isPasswordValid ? '✅ VÁLIDA' : '❌ INVÁLIDA');

        if (!isPasswordValid) {
            console.log('\n🔧 Redefindo a senha...');
            const salt = await bcrypt.genSalt(10);
            const newHashedPassword = await bcrypt.hash('admin', salt);
            
            adminUser.password = newHashedPassword;
            await adminUser.save();
            
            console.log('✅ Senha redefinida com sucesso!');
            
            // Testar novamente
            const isNewPasswordValid = await bcrypt.compare('admin', adminUser.password);
            console.log('✅ Nova senha válida:', isNewPasswordValid);
        }

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        mongoose.disconnect();
    }
}

testAdminCredentials();
