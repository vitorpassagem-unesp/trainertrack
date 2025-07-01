# Credenciais de Teste - TrainerTrack

## Usuários Disponíveis

### 👨‍💼 Treinador
- **Email:** carlos.silva@trainertrack.com
- **Senha:** trainer123
- **Nome:** Carlos Silva
- **Tipo:** Treinador

### 🏃‍♂️ Cliente
- **Email:** diego.barbosa@gmail.com
- **Senha:** client123
- **Nome:** Diego Barbosa
- **Tipo:** Cliente/Usuário

### 🔧 Administrador
- **Email:** admin@test.com
- **Senha:** admin
- **Nome:** Admin
- **Tipo:** Administrador

## Como usar

1. Certifique-se de que o banco de dados está rodando: `mongod --dbpath C:\data\db`
2. Certifique-se de que o servidor está rodando: `node server.js` (na pasta server)
3. Certifique-se de que o cliente está rodando: `npm start` (na pasta client)
4. Acesse http://localhost:3000
5. Use qualquer uma das credenciais acima para fazer login

## Criar usuários

Para criar os usuários de teste, execute os seguintes comandos na pasta server:

```bash
# Criar usuários básicos (treinador e cliente)
node populate-database.js

# Criar administrador
node create-admin.js
```