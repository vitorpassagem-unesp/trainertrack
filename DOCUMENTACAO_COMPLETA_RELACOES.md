# TrainerTrack - Relações e Dependências do Sistema

## 📋 VISÃO GERAL DO SISTEMA

O TrainerTrack é um sistema de gerenciamento de academia com 3 tipos de usuários:
- **Admin**: Controle total do sistema
- **Trainer**: Gerencia clientes e treinos
- **User (Cliente)**: Acessa seus dados pessoais

---

## 🗄️ MODELOS DE DADOS E RELAÇÕES

### 1. **User Model** (`server/models/user.model.js`)
```javascript
{
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (required) // 'admin', 'trainer', 'user'
  profile: {
    firstName: String (required),
    lastName: String (required),
    specialty: String, // Para treinadores
    experience: String  // Para treinadores
  },
  isActive: Boolean (default: true),
  createdAt: Date (default: now)
}
```

**Relações:**
- **1:1** com `Client` (quando role = 'user')
- **1:N** com `Client` (quando role = 'trainer') - trainer pode ter múltiplos clientes
- **1:N** com `Workout` (quando role = 'trainer') - trainer cria múltiplos treinos

### 2. **Client Model** (`server/models/client.model.js`)
```javascript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  user: ObjectId (required, ref: 'User'), // Cliente como usuário
  trainer: ObjectId (required, ref: 'User'), // Treinador responsável
  metrics: [{ // Métricas inline (deprecated - usar Metrics model)
    date: Date,
    weight: Number,
    height: Number,
    bodyFatPercentage: Number,
    muscleMassPercentage: Number
  }],
  workoutPlans: [ObjectId] (ref: 'Workout'),
  createdAt: Date (default: now)
}
```

**Relações:**
- **1:1** com `User` (campo `user`)
- **N:1** com `User` (campo `trainer`)
- **1:N** com `Metrics`
- **1:N** com `Workout`

### 3. **Metrics Model** (`server/models/metrics.model.js`)
```javascript
{
  clientId: ObjectId (required, ref: 'User'), // Referência ao usuário cliente
  date: Date (default: now),
  weight: Number (required),
  height: Number (required),
  bodyFatPercentage: Number (required),
  muscleMassPercentage: Number (required),
  notes: String
}
```

**Relações:**
- **N:1** com `User` (cliente)

### 4. **Workout Model** (`server/models/workout.model.js`)
```javascript
{
  name: String (required),
  clientId: ObjectId (required, ref: 'Client'),
  trainerId: ObjectId (required, ref: 'User'),
  description: String,
  exercises: [{
    name: String (required),
    sets: Number (required),
    reps: Number (required),
    weight: Number (required),
    restTime: Number (default: 60)
  }],
  date: Date (default: now),
  notes: String,
  isActive: Boolean (default: true)
}
```

**Relações:**
- **N:1** com `Client`
- **N:1** with `User` (trainer)

---

## 🔗 DIAGRAMA DE RELAÇÕES

```
User (Admin)
├── Gerencia todos os Users
├── Gerencia todos os Clients
└── Acessa todas as funcionalidades

User (Trainer)
├── trainer_id → Client.trainer (1:N)
├── trainerId → Workout.trainerId (1:N)
└── Gerencia apenas seus clientes

User (Cliente/User)
├── user_id → Client.user (1:1)
├── clientId → Metrics.clientId (1:N)
└── Acessa apenas seus dados

Client
├── user → User._id (1:1)
├── trainer → User._id (N:1)
├── workoutPlans → [Workout._id] (1:N)
└── Vinculado às Metrics via clientId

Metrics
└── clientId → User._id (N:1)

Workout
├── clientId → Client._id (N:1)
└── trainerId → User._id (N:1)
```

---

## 🛠️ CONTROLLERS E SUAS DEPENDÊNCIAS

### 1. **Auth Controller** (`server/controllers/auth.controller.js`)
**Funcionalidades:**
- `register`: Cria novo User
- `login`: Autentica User, retorna JWT
- `getProfile`: Retorna dados do User logado

**Dependências:**
- `User` model
- `bcrypt` (hash de senhas)
- `jsonwebtoken` (JWT)

**Rotas:** `/api/auth/*`

### 2. **Admin Controller** (`server/controllers/admin.controller.js`)
**Funcionalidades:**
- `getAllTrainers`: Lista todos os Users com role 'trainer'
- `createTrainer`: Cria novo User trainer
- `updateTrainer`: Atualiza dados do trainer
- `deleteTrainer`: Remove trainer (soft delete)
- `getClientsByTrainer`: Lista clientes de um trainer específico
- `assignClientToTrainer`: Transfere cliente entre trainers

**Dependências:**
- `User` model
- `Client` model
- Middleware: `authMiddleware`, `isAdmin`

**Rotas:** `/api/admin/*`

### 3. **Client Controller** (`server/controllers/client.controller.js`)
**Funcionalidades:**
- `getAllClients`: Lista clientes (trainer: seus clientes, admin: todos)
- `createClient`: Cria novo cliente
- `updateClient`: Atualiza dados do cliente
- `deleteClient`: Remove cliente
- `getMyTrainer`: Retorna treinador do cliente logado

**Dependências:**
- `User` model
- `Client` model
- Middleware: `authMiddleware`

**Rotas:** `/api/clients/*`

### 4. **Workout Controller** (`server/controllers/workout.controller.js`)
**Funcionalidades:**
- `createWorkout`: Cria novo treino
- `getAllWorkouts`: Lista treinos
- `getMyWorkouts`: Retorna treinos do cliente logado
- `updateWorkout`: Atualiza treino
- `deleteWorkout`: Remove treino

**Dependências:**
- `Workout` model
- `Client` model
- Middleware: `authMiddleware`

**Rotas:** `/api/workouts/*`

### 5. **Metrics Controller** (`server/controllers/metrics.controller.js`)
**Funcionalidades:**
- `createMetric`: Cria nova métrica
- `getMyMetrics`: Retorna métricas do cliente logado
- `updateMetric`: Atualiza métrica
- `deleteMetric`: Remove métrica

**Dependências:**
- `Metrics` model
- Middleware: `authMiddleware`

**Rotas:** `/api/metrics/*`

---

## 🔐 MIDDLEWARES E AUTENTICAÇÃO

### 1. **Auth Middleware** (`server/middleware/auth.middleware.js`)
```javascript
// Verifica JWT e anexa usuário ao req
req.user = userFromDB;
req.userId = user.id;
req.userRole = user.role;
```

### 2. **Admin Middleware** (inline nos controllers)
```javascript
// Verifica se req.user.role === 'admin'
```

### 3. **Validation Middleware** (`server/middleware/validation.middleware.js`)
- Validações de entrada de dados

---

## 🌐 ROTAS E PERMISSÕES

### **Rotas Públicas:**
- `POST /api/auth/register`
- `POST /api/auth/login`

### **Rotas Autenticadas (qualquer usuário logado):**
- `GET /api/auth/profile`
- `GET /api/metrics` (apenas próprias métricas)
- `POST /api/metrics` (criar própria métrica)
- `GET /api/workouts/my-workouts` (apenas próprios treinos)
- `GET /api/clients/my-trainer` (apenas próprio treinador)

### **Rotas de Trainer:**
- `GET /api/clients` (apenas seus clientes)
- `POST /api/clients` (criar cliente)
- `PUT /api/clients/:id` (atualizar seu cliente)
- `POST /api/workouts` (criar treino para seu cliente)
- `PUT /api/workouts/:id` (atualizar treino de seu cliente)

### **Rotas de Admin:**
- `GET /api/admin/trainers` (todos os treinadores)
- `POST /api/admin/trainers` (criar treinador)
- `PUT /api/admin/trainers/:id` (atualizar treinador)
- `DELETE /api/admin/trainers/:id` (remover treinador)
- `GET /api/admin/clients` (todos os clientes)
- `POST /api/admin/clients/assign` (transferir cliente)

---

## 📱 FRONTEND - COMPONENTES E PÁGINAS

### **Componentes Compartilhados:**
- `TabNavigation`: Navegação baseada no role do usuário
- `LoadingSpinner`: Indicador de carregamento
- `ErrorMessage`: Exibição de erros

### **Páginas por Tipo de Usuário:**

#### **Admin:**
- `AdminPage`: Dashboard administrativo
- `TrainersManagementPage`: Gerenciar treinadores
- `AllClientsPage`: Ver todos os clientes
- `ActivitiesPage`: Log de atividades do sistema

#### **Trainer:**
- `TrainerDashboardPage`: Dashboard do treinador
- `ClientsPage`: Lista de clientes do treinador
- `ClientDetailPage`: Detalhes de um cliente específico
- `WorkoutPlanPage`: Criar/editar planos de treino
- `ActivitiesPage`: Atividades relacionadas aos seus clientes

#### **Cliente (User):**
- `DashboardPage`: Dashboard do cliente
- `MyProgressPage`: Histórico de métricas e progresso
- `MyWorkoutsPage`: Treinos atribuídos
- `MyTrainerPage`: Informações do treinador

### **Contextos:**
- `AuthContext`: Gerencia autenticação e dados do usuário
- `ClientContext`: Dados de clientes (para trainers/admin)
- `WorkoutContext`: Dados de treinos

---

## 🔄 FLUXOS DE DADOS PRINCIPAIS

### **1. Login de Usuário:**
```
LoginPage → AuthContext.login() → /api/auth/login → JWT → Redirect based on role
```

### **2. Cliente visualiza progresso:**
```
MyProgressPage → useEffect → /api/metrics → setState → Render charts
```

### **3. Trainer cria treino:**
```
WorkoutPlanPage → form submit → /api/workouts → Client.workoutPlans updated
```

### **4. Admin gerencia trainers:**
```
TrainersManagementPage → CRUD operations → /api/admin/trainers → Re-fetch list
```

---

## 📊 DEPENDÊNCIAS DE DADOS PARA CADA FUNCIONALIDADE

### **Dashboard do Cliente:**
- `User` (dados pessoais)
- `Metrics` (últimas métricas)
- `Workout` (próximos treinos)
- `Client` (dados do cliente, treinador)

### **Dashboard do Trainer:**
- `User` (dados do trainer)
- `Client` (lista de clientes)
- `Workout` (treinos criados)
- `Metrics` (progresso dos clientes)

### **Dashboard do Admin:**
- `User` (todos os usuários)
- `Client` (todos os clientes)
- Sistema de logs/atividades

### **Página de Progresso:**
- `Metrics` (histórico completo)
- `Client` (dados base)
- `User` (informações pessoais)

### **Página de Treinos:**
- `Workout` (treinos atribuídos)
- `Client` (verificar ownership)
- `User` (dados do cliente)

---

## 🚨 PONTOS CRÍTICOS E VALIDAÇÕES

### **Segurança:**
1. **JWT Validation**: Toda rota protegida valida JWT
2. **Role Verification**: Middlewares verificam permissões por role
3. **Data Ownership**: Usuários só acessam seus próprios dados
4. **Password Hashing**: bcrypt para senhas

### **Integridade de Dados:**
1. **Foreign Key Validation**: ObjectIds válidos
2. **Required Fields**: Campos obrigatórios nos models
3. **Unique Constraints**: Email único por usuário
4. **Cascade Operations**: Remover dependências ao deletar

### **Validações Importantes:**
- Cliente só pode ter 1 treinador
- Treinador só gerencia seus clientes
- Admin tem acesso total
- Métricas só podem ser criadas pelo próprio cliente
- Treinos só podem ser criados pelo treinador do cliente

---

## 🔧 SCRIPTS DE MANUTENÇÃO

### **População do Banco:** `populate-database.js`
- Cria 7 treinadores
- Cria 25 clientes
- Distribui clientes entre treinadores
- Gera métricas históricas
- Cria treinos personalizados

### **Verificação de Dados:** `check-diego-user.js`
- Verifica integridade dos dados
- Lista relações de um usuário específico

### **Criação de Admin:** `create-admin.js`
- Cria usuário administrador

---

## 📋 CHECKLIST DE FUNCIONAMENTO

### **Para que o sistema funcione completamente:**

#### **Backend:**
- [x] Models definidos com relações corretas
- [x] Controllers implementados
- [x] Middlewares de autenticação e autorização
- [x] Rotas configuradas
- [x] Banco populado com dados de teste

#### **Frontend:**
- [x] Páginas criadas para cada tipo de usuário
- [x] Contextos de autenticação configurados
- [x] Navegação baseada em roles
- [x] Componentes responsivos e estilizados

#### **Integrações:**
- [x] Frontend conecta com API backend
- [x] JWT armazenado e enviado nas requisições
- [x] Tratamento de erros implementado
- [x] Loading states configurados

---

Este documento serve como referência completa para manutenção, debugging e evolução do sistema TrainerTrack.

---

## 🔧 CONFIGURAÇÃO E AMBIENTE

### **Variáveis de Ambiente (.env):**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/trainertrack
MONGODB_URI_TEST=mongodb://localhost:27017/trainertrack_test

# JWT Configuration
JWT_SECRET=your_jwt_secret_here_minimum_32_characters
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Configuração de Desenvolvimento:**
```bash
# Setup completo do projeto
git clone <repository-url>
cd trainertrack

# Backend setup
cd server
npm install
cp .env.example .env  # Configure as variáveis
node create-admin.js  # Criar usuário admin
node populate-database.js  # Popular com dados de teste
npm run dev  # Inicia com nodemon

# Frontend setup (novo terminal)
cd ../client
npm install
npm start  # Inicia em http://localhost:3000
```

### **Estrutura de Configuração:**
```
server/config/
├── auth.js          # Configurações JWT e bcrypt
├── db.js           # Configuração MongoDB
└── .env.example    # Template de variáveis
```

---

## 🔧 UTILITÁRIOS E HELPERS

### **Utilitários Implementados (`server/utils/helpers.js`):**
```javascript
// Validação de email
validateEmail(email) → Boolean

// Formatação de data para padrão brasileiro
formatDate(date) → String

// Cálculo de IMC
calculateBMI(weight, height) → Number

// Geração de IDs únicos
generateId() → String
```

### **Configurações de Autenticação (`server/config/auth.js`):**
```javascript
// Configurações JWT
authConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '1d'
}

// Funções disponíveis
generateToken(user) → String
hashPassword(password) → String
comparePassword(password, hash) → Boolean
```

---

## 🧪 TESTES E QUALIDADE

### **Scripts de Teste Disponíveis:**
```bash
# Testes de API completos
node server/test-complete-admin.js    # Testa rotas de admin
node server/test-client-routes.js     # Testa rotas de cliente
node server/test-login-api.js         # Testa autenticação
node server/test-trainer-edit.js      # Testa edição de trainer

# Verificação de dados
node server/debug-db.js               # Debug geral do banco
node server/check-users.js            # Verifica usuários
```

### **Estrutura de Testes Manual:**
```
server/
├── test-admin-routes.js         # Testes de rotas admin
├── test-client-routes.js        # Testes de rotas cliente
├── test-complete-admin.js       # Teste completo admin
├── test-login-api.js           # Teste de autenticação
└── test-trainer-edit.js        # Teste de edição trainer
```

### **Validações Implementadas:**
- **Entrada de dados**: Middleware de validação
- **Autenticação**: JWT token validation
- **Autorização**: Role-based access control
- **Integridade**: Foreign key validation

---

## 📊 PERFORMANCE E OTIMIZAÇÕES

### **Otimizações de Banco de Dados:**
```javascript
// Índices implementados nos models
User: { email: 1, username: 1 }     // Único
Client: { email: 1, trainer: 1 }    // Composto
Metrics: { clientId: 1, date: -1 }  // Ordenação temporal
Workout: { trainerId: 1, clientId: 1, date: -1 }
```

### **Middleware de Performance:**
- **CORS**: Configurado para origins específicos
- **Body Parser**: Limite de tamanho de request
- **Compression**: Gzip automático (se configurado)

### **Queries Otimizadas:**
```javascript
// População seletiva de dados
Client.find({ trainer: trainerId })
  .populate('user', 'username email')
  .populate('workoutPlans')
  .sort({ createdAt: -1 });

// Agregação de métricas
Metrics.find({ clientId })
  .sort({ date: 1 })
  .limit(50);  // Limite para performance
```

---

## 🚨 TRATAMENTO DE ERROS E LOGGING

### **Estratégias de Erro:**
```javascript
// Padrão de resposta de erro
{
  success: false,
  message: "Mensagem amigável",
  error: "Detalhes técnicos (apenas dev)",
  code: "ERROR_CODE"
}

// Códigos de erro padronizados
AUTH_FAILED: 401
ACCESS_DENIED: 403
NOT_FOUND: 404
VALIDATION_ERROR: 400
SERVER_ERROR: 500
```

### **Logging Implementado:**
- **Console logs**: Para desenvolvimento
- **Error tracking**: Try/catch em todos os controllers
- **Request logging**: Middleware de log (se habilitado)

### **Middleware de Tratamento:**
```javascript
// Error handling middleware (global)
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor'
  });
});
```

---

## 🔐 SEGURANÇA E VALIDAÇÕES

### **Implementações de Segurança:**
```javascript
// Hash de senhas (bcrypt)
saltRounds: 10
hashPassword() // Antes de salvar
comparePassword() // No login

// JWT Security
secret: process.env.JWT_SECRET (mínimo 32 chars)
expiresIn: '24h'
Bearer token format

// Validação de entrada
Email format validation
Password strength (mínimo 6 chars)
ObjectId validation
Role validation
```

### **Middleware de Segurança:**
- **authMiddleware**: Validação JWT em rotas protegidas
- **validation.middleware**: Validação de entrada de dados
- **Role checking**: Inline nos controllers

### **Proteções Implementadas:**
- **SQL Injection**: MongoDB nativo (sem SQL)
- **XSS**: Validação de entrada
- **CSRF**: Stateless JWT
- **Rate Limiting**: Configurável via .env

---

## 🔄 BACKUP E RECOVERY

### **Estratégias de Backup:**
```bash
# Backup manual do MongoDB
mongodump --db trainertrack --out ./backups/$(date +%Y-%m-%d)

# Restore do backup
mongorestore --db trainertrack ./backups/2025-01-15/trainertrack

# Script de backup automatizado (criar)
#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M-%S)
mongodump --db trainertrack --out ./backups/$DATE
```

### **Dados Críticos para Backup:**
- **Users**: Contas e autenticação
- **Clients**: Dados dos clientes
- **Metrics**: Histórico de métricas
- **Workouts**: Planos de treino
- **Relationships**: Vínculos trainer-cliente

### **Recovery Procedures:**
1. **Identificar problema**: Logs e debugging
2. **Parar aplicação**: Evitar corrupção de dados
3. **Restaurar backup**: mongorestore
4. **Verificar integridade**: Scripts de check
5. **Reiniciar aplicação**: Testes de funcionamento

---

## 📋 MONITORAMENTO E DEBUGGING

### **Scripts de Debugging:**
```bash
# Verificação geral do sistema
node debug-db.js              # Estado geral do banco
node check-users.js           # Verificar usuários
node check-diego-user.js      # Usuário específico

# População e reset
node populate-database.js     # Popular dados teste
node create-admin.js          # Criar admin
```

### **Logs Importantes:**
- **Conexão MongoDB**: Sucesso/falha na inicialização
- **Autenticação**: Tentativas de login
- **Erros de API**: Requests que falharam
- **Performance**: Queries lentas (se configurado)

### **Health Checks:**
```javascript
// Endpoint de saúde (implementar)
GET /api/health → {
  status: "healthy",
  database: "connected",
  uptime: "2h 30m",
  version: "1.0.0"
}
```

---

## 📝 DOCUMENTAÇÃO DE MUDANÇAS

### **Controle de Versão:**
- **Git workflow**: Feature branches
- **Commit messages**: Conventional commits
- **Versioning**: Semantic versioning (1.0.0)

### **Changelog Principais:**
- **v1.0.0**: Versão inicial completa
- **Metrics fix**: Correção de métricas não aparecendo
- **JWT improvements**: Melhorias na autenticação
- **UI enhancements**: Correções de interface

### **Arquivos de Configuração:**
```
.gitignore           # Ignora node_modules, .env, logs
package.json         # Dependencies e scripts
README.md           # Documentação geral
DOCUMENTACAO_*.md   # Documentação técnica
```
