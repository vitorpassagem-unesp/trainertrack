# TrainerTrack - Documentação Técnica

## Sumário
- [Descrição das Funcionalidades](#descrição-das-funcionalidades)
- [Descrição da Base de Dados](#descrição-da-base-de-dados)
- [Linguagem de Programação](#linguagem-de-programação)
- [Framework Back-End](#framework-back-end)
- [Framework Front-End](#framework-front-end)
- [APIs Adotadas](#apis-adotadas)
- [Configuração e Setup](#configuração-e-setup)
- [Deployment e Produção](#deployment-e-produção)
- [Segurança](#segurança)
- [Monitoramento](#monitoramento)

---

## Descrição das Funcionalidades

O **TrainerTrack** é uma aplicação web desenvolvida para atender às necessidades de personal trainers no gerenciamento de seus clientes e planos de treino personalizados. A plataforma oferece uma solução digital completa para substituir métodos tradicionais (papel, planilhas) e aumentar a eficiência e profissionalismo dos treinadores.

### Funcionalidades Principais:

#### 1. **Gestão de Usuários e Autenticação**
- Sistema de registro e login seguro com autenticação JWT
- Três tipos de usuários: Admin, Trainer (Personal Trainer) e Client (Cliente)
- Perfis personalizados com informações específicas para cada tipo de usuário
- Controle de acesso baseado em roles (RBAC)

#### 2. **Dashboard Personalizado**
- **Dashboard do Admin**: Visão geral do sistema, gestão de trainers e clientes
- **Dashboard do Trainer**: Estatísticas dos clientes, acesso rápido a treinos e métricas
- **Dashboard do Cliente**: Acesso aos seus treinos e acompanhamento de progresso

#### 3. **Gestão de Clientes**
- Cadastro completo de clientes com informações pessoais e de contato
- Visualização de lista de clientes com filtros e busca
- Perfil detalhado de cada cliente
- Histórico completo de interações e atividades

#### 4. **Gestão de Planos de Treino**
- Criação de planos de treino personalizados
- Estrutura detalhada de exercícios com séries, repetições e observações
- Sistema de versionamento para manter histórico de planos anteriores
- Atribuição de planos específicos para cada cliente
- Visualização clara e organizada dos treinos

#### 5. **Acompanhamento de Métricas Corporais**
- Registro de métricas físicas: peso, altura, percentual de gordura corporal, percentual de massa muscular
- Histórico temporal das métricas para acompanhamento da evolução
- Visualização gráfica do progresso (funcionalidade planejada)
- Data de cada medição para controle temporal

#### 6. **Sistema de Atividades**
- Log de atividades recentes no sistema
- Rastreamento de criação de treinos, registros de métricas
- Histórico de interações entre trainer e cliente

#### 7. **Interface Responsiva**
- Design moderno e responsivo para desktop e dispositivos móveis
- Navegação intuitiva com abas organizadas
- Interface limpa e profissional

### Funcionalidades Futuras Planejadas:
- Envio automático de planos de treino por email
- Integração com aplicativos de saúde
- Notificações para atualizações de métricas
- Relatórios gráficos de progresso dos clientes
- Sistema de agendamento de sessões

---

## Descrição da Base de Dados

O sistema utiliza **MongoDB** como sistema de gerenciamento de banco de dados NoSQL, proporcionando flexibilidade na estruturação dos dados e escalabilidade.

### Estrutura do Banco de Dados:

#### **Coleção: users**
Armazena informações de todos os usuários do sistema (admins, trainers e clientes).

```javascript
{
  _id: ObjectId,
  username: String (único, obrigatório),
  email: String (único, obrigatório),
  password: String (hash criptografado, obrigatório),
  role: String (enum: ['user', 'trainer', 'admin'], padrão: 'trainer'),
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    specialties: [String], // Para trainers
    experience: String,    // Para trainers
    certification: String // Para trainers
  },
  isActive: Boolean (padrão: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Coleção: clients**
Armazena informações específicas dos clientes vinculados aos trainers.

```javascript
{
  _id: ObjectId,
  name: String (obrigatório),
  email: String (único, obrigatório),
  phone: String (obrigatório),
  user: ObjectId (referência para users, obrigatório),
  trainer: ObjectId (referência para users - trainer, obrigatório),
  metrics: [{
    date: Date (padrão: agora),
    weight: Number (obrigatório),
    height: Number (obrigatório),
    bodyFatPercentage: Number (obrigatório),
    muscleMassPercentage: Number (obrigatório)
  }],
  workoutPlans: [ObjectId] (referências para workouts),
  createdAt: Date
}
```

#### **Coleção: workouts**
Armazena os planos de treino criados pelos trainers.

```javascript
{
  _id: ObjectId,
  name: String (obrigatório),
  description: String,
  trainerId: ObjectId (referência para users - trainer, obrigatório),
  clientId: ObjectId (referência para clients),
  exercises: [{
    name: String (obrigatório),
    sets: Number,
    reps: String,
    weight: Number,
    restTime: String,
    notes: String
  }],
  notes: String,
  isActive: Boolean (padrão: true),
  createdAt: Date,
  updatedAt: Date
}
```

#### **Coleção: metrics**
Coleção separada para métricas corporais (alternativa ao array embarcado).

```javascript
{
  _id: ObjectId,
  clientId: ObjectId (referência para clients, obrigatório),
  date: Date (padrão: agora),
  weight: Number (obrigatório),
  height: Number (obrigatório),
  bodyFatPercentage: Number (obrigatório),
  muscleMassPercentage: Number (obrigatório),
  notes: String
}
```

#### **Coleção: trainers**
Informações específicas dos trainers (se necessário dados adicionais).

```javascript
{
  _id: ObjectId,
  user: ObjectId (referência para users, obrigatório),
  specialties: [String],
  certifications: [String],
  experience: String,
  bio: String,
  clients: [ObjectId] (referências para clients)
}
```

### Relacionamentos:
- **users ↔ clients**: Relação um-para-um (cliente-usuário)
- **users (trainer) ↔ clients**: Relação um-para-muitos (um trainer tem vários clientes)
- **trainers ↔ workouts**: Relação um-para-muitos (um trainer cria vários treinos)
- **clients ↔ workouts**: Relação muitos-para-muitos (clientes podem ter vários planos)
- **clients ↔ metrics**: Relação um-para-muitos (um cliente tem várias métricas)

---

## Linguagem de Programação

### **JavaScript (ES6+)**

O projeto é desenvolvido integralmente em **JavaScript**, utilizando recursos da linguagem:

#### **No Back-End (Node.js):**
- **Node.js v14+** como runtime de JavaScript no servidor
- Uso de recursos ES6+: arrow functions, destructuring, async/await, modules
- Programação assíncrona com Promises e async/await
- Tratamento de erros com try/catch

#### **No Front-End (React):**
- **JavaScript moderno** com JSX para componentes React
- Hooks do React (useState, useEffect, useContext)
- Programação funcional e componentes funcionais
- Gerenciamento de estado local e global

### **Características da Implementação:**
- Código modular e reutilizável
- Padrões de programação assíncrona
- Validação de dados tanto no cliente quanto no servidor
- Tratamento robusto de erros
- Uso de bibliotecas e frameworks do ecossistema JavaScript

---

## Framework Back-End

### **Express.js v4.17.1**

O back-end utiliza **Express.js**, um framework web minimalista e flexível para Node.js.

#### **Características da Implementação:**

##### **1. Arquitetura MVC (Model-View-Controller)**
```
server/
├── controllers/     # Lógica de negócio
├── models/         # Modelos de dados (Mongoose)
├── routes/         # Definição de rotas
├── middleware/     # Middlewares customizados
├── config/         # Configurações
└── utils/          # Utilitários
```

##### **2. Middlewares Utilizados:**
- **cors**: Configuração de CORS para comunicação com o front-end
- **express.json()**: Parsing de requisições JSON
- **Middleware de autenticação JWT customizado**
- **Middleware de tratamento de erros**

##### **3. Roteamento:**
```javascript
// Estrutura de rotas principais
/api/auth/*         // Autenticação e registro
/api/admin/*        // Rotas administrativas
/api/trainer/*      // Rotas específicas do trainer
/api/clients/*      // Gestão de clientes
/api/workouts/*     // Gestão de treinos
/api/metrics/*      // Gestão de métricas
```

##### **4. Segurança:**
- **bcryptjs**: Hash de senhas com salt
- **jsonwebtoken**: Autenticação baseada em JWT
- Validação de entrada de dados
- Controle de acesso baseado em roles

##### **5. Integração com Banco de Dados:**
- **Mongoose v5.10.9**: ODM para MongoDB
- Schemas e validações de dados
- Relacionamentos entre coleções
- Queries otimizadas

#### **Dependências Principais:**
```json
{
  "express": "^4.17.1",
  "mongoose": "^5.10.9",
  "bcryptjs": "^2.4.3",
  "jsonwebtoken": "^8.5.1",
  "cors": "^2.8.5",
  "dotenv": "^8.2.0"
}
```

#### **Scripts de Desenvolvimento:**
- `npm start`: Inicia o servidor em produção
- `npm run dev`: Inicia com nodemon para desenvolvimento
- Scripts de população de dados de teste

---

## Framework Front-End

### **React.js v17.0.2**

O front-end é desenvolvido com **React.js**.

#### **Características da Implementação:**

##### **1. Arquitetura de Componentes:**
```
client/src/
├── components/     # Componentes reutilizáveis
│   ├── shared/     # Componentes compartilhados
│   ├── metrics/    # Componentes de métricas
│   └── workouts/   # Componentes de treinos
├── contexts/       # Context API para estado global
├── pages/          # Páginas principais
├── services/       # Serviços de API
└── styles.css      # Estilos globais
```

##### **2. Gerenciamento de Estado:**
- **React Context API**: Estado global para autenticação e dados compartilhados
- **useState e useEffect**: Gerenciamento de estado local
- **Custom Hooks**: Lógica reutilizável

##### **3. Roteamento:**
- **React Router DOM v5.2.0**: Navegação SPA (Single Page Application)
- Rotas protegidas baseadas em autenticação
- Navegação condicional baseada em roles de usuário

##### **4. Comunicação com API:**
- **Axios v0.21.1**: Cliente HTTP para requisições
- Interceptors para token de autenticação
- Tratamento centralizado de erros
- Serviços organizados por domínio

##### **5. Interface de Usuário:**
- **CSS3 moderno**: Flexbox, Grid, Custom Properties
- **Design responsivo**: Mobile-first approach
- **Componentes modulares**: Reutilizáveis e manuteníveis
- **Icons SVG**: Ícones customizados e otimizados

#### **Estrutura de Páginas:**
```javascript
// Páginas principais
/login              // Autenticação
/register          // Registro
/dashboard         // Dashboard principal
/clients           // Lista de clientes
/clients/:id       // Detalhes do cliente
/my-workouts       // Treinos do cliente
/my-progress       // Progresso do cliente
/activities        // Atividades recentes
```

#### **Dependências Principais:**
```json
{
  "react": "^17.0.2",
  "react-dom": "^17.0.2",
  "react-router-dom": "^5.2.0",
  "axios": "^0.21.1",
  "react-scripts": "4.0.3"
}
```

#### **Features do React Utilizadas:**
- **Functional Components**: Componentes funcionais modernos
- **Hooks**: useState, useEffect, useContext, useParams
- **Context API**: Gerenciamento de estado global
- **Conditional Rendering**: Renderização condicional
- **Event Handling**: Manipulação de eventos
- **Form Handling**: Gerenciamento de formulários

---

## APIs Adotadas

### **1. API RESTful Interna**

#### **Estrutura da API:**
A aplicação possui uma API RESTful própria desenvolvida com Express.js que serve como back-end para o front-end React.

##### **Endpoints Principais:**

**Autenticação:**
```
POST /api/auth/login          # Login de usuário
POST /api/auth/register       # Registro de usuário
GET  /api/auth/verify         # Verificação de token
```

**Gestão de Usuários (Admin):**
```
GET    /api/admin/users       # Listar todos os usuários
POST   /api/admin/users       # Criar usuário
PUT    /api/admin/users/:id   # Atualizar usuário
DELETE /api/admin/users/:id   # Deletar usuário
GET    /api/admin/stats       # Estatísticas do sistema
```

**Gestão de Clientes:**
```
GET    /api/clients           # Listar clientes
POST   /api/clients           # Criar cliente
GET    /api/clients/:id       # Obter cliente específico
PUT    /api/clients/:id       # Atualizar cliente
DELETE /api/clients/:id       # Deletar cliente
```

**Gestão de Treinos:**
```
GET    /api/workouts                    # Listar treinos
POST   /api/workouts                    # Criar treino
GET    /api/workouts/:id                # Obter treino específico
PUT    /api/workouts/:id                # Atualizar treino
DELETE /api/workouts/:id                # Deletar treino
GET    /api/workouts/client/:clientId   # Treinos por cliente
```

**Gestão de Métricas:**
```
GET    /api/metrics                     # Listar métricas
POST   /api/metrics                     # Criar métrica
GET    /api/metrics/:id                 # Obter métrica específica
PUT    /api/metrics/:id                 # Atualizar métrica
DELETE /api/metrics/:id                 # Deletar métrica
GET    /api/metrics/client/:clientId    # Métricas por cliente
```

**Rotas Específicas do Trainer:**
```
GET /api/trainer/dashboard              # Dashboard do trainer
GET /api/trainer/clients                # Clientes do trainer
GET /api/trainer/workouts               # Treinos do trainer
GET /api/trainer/activities             # Atividades do trainer
```

#### **Padrões da API:**

##### **Autenticação:**
- **JWT (JSON Web Tokens)**: Autenticação stateless
- **Bearer Token**: Autorização via header
- **Refresh Token**: Renovação automática de sessão

##### **Formato de Resposta:**
```javascript
// Sucesso
{
  "success": true,
  "data": { ... },
  "message": "Operação realizada com sucesso"
}

// Erro
{
  "success": false,
  "error": "Mensagem de erro",
  "code": "ERROR_CODE"
}
```

##### **Códigos de Status HTTP:**
- `200`: OK - Operação bem-sucedida
- `201`: Created - Recurso criado
- `400`: Bad Request - Dados inválidos
- `401`: Unauthorized - Não autenticado
- `403`: Forbidden - Sem permissão
- `404`: Not Found - Recurso não encontrado
- `500`: Internal Server Error - Erro do servidor


### **3. Bibliotecas e Serviços de Apoio**

#### **Axios (Cliente HTTP)**
```javascript
// Configuração base
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para token de autenticação
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

#### **Mongoose (ODM)**
```javascript
// Configuração de conexão
const dbConfig = {
  url: 'mongodb://localhost:27017/trainertrack',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};
```

---

## Configuração e Setup

### **Pré-requisitos**
- **Node.js** v14 ou superior
- **MongoDB** v4.4 ou superior
- **Git** para controle de versão
- **npm** ou **yarn** como gerenciador de pacotes

### **Variáveis de Ambiente**

Crie um arquivo `.env` na pasta `server/` com as seguintes configurações:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/trainertrack
MONGODB_URI_TEST=mongodb://localhost:27017/trainertrack_test

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters_long
JWT_EXPIRES_IN=24h

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001

# Rate Limiting (opcional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### **Instalação e Configuração**

#### **1. Clone do Repositório**
```bash
git clone <repository-url>
cd trainertrack-project
```

#### **2. Setup do Backend**
```bash
cd trainertrack/server
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o arquivo .env com suas configurações

# Criar usuário administrador
node create-admin.js

# Popular banco com dados de teste (opcional)
node populate-database.js

# Iniciar servidor de desenvolvimento
npm run dev
# Servidor rodará em http://localhost:5000
```

#### **3. Setup do Frontend**
```bash
# Em novo terminal
cd trainertrack/client
npm install

# Iniciar aplicação React
npm start
# Aplicação rodará em http://localhost:3000
```

### **Scripts Disponíveis**

#### **Backend (`server/`):**
```bash
npm start          # Produção
npm run dev        # Desenvolvimento com nodemon
npm test           # Testes (se configurados)

# Scripts de manutenção
node create-admin.js           # Criar usuário admin
node populate-database.js      # Popular com dados teste
node debug-db.js              # Debug do banco
node check-users.js           # Verificar usuários
```

#### **Frontend (`client/`):**
```bash
npm start          # Desenvolvimento
npm run build      # Build para produção
npm test           # Testes
npm run eject      # Ejetar configuração React
```

---

## Deployment e Produção

### **Deployment Backend (Heroku)**

#### **1. Preparação**
```bash
# Login no Heroku
heroku login

# Criar app
heroku create trainertrack-api

# Adicionar MongoDB Atlas
heroku addons:create mongolab:sandbox
# Ou configure sua própria instância MongoDB
```

#### **2. Configuração de Variáveis**
```bash
# Configurar variáveis de produção
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_production_jwt_secret_very_long_and_secure
heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
heroku config:set ALLOWED_ORIGINS=https://your-frontend-domain.com
```

#### **3. Deploy**
```bash
# Deploy do backend
git subtree push --prefix=trainertrack/server heroku main
# Ou usando Git direto na pasta server
```

### **Deployment Frontend (Vercel/Netlify)**

#### **Vercel:**
```bash
# Instalar Vercel CLI
npm i -g vercel

# Na pasta client/
cd trainertrack/client

# Configurar variável de ambiente
echo "REACT_APP_API_URL=https://your-api-domain.herokuapp.com/api" > .env.production

# Build e deploy
npm run build
vercel --prod
```

#### **Netlify:**
```bash
# Build da aplicação
npm run build

# Fazer upload da pasta build/ para Netlify
# Ou conectar repositório Git diretamente
```

### **MongoDB Atlas (Produção)**

#### **Configuração:**
1. Criar conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Criar cluster gratuito
3. Configurar usuário do banco
4. Configurar IP whitelist (0.0.0.0/0 para acesso de qualquer IP)
5. Obter connection string
6. Configurar no Heroku ou arquivo .env de produção

#### **Connection String Exemplo:**
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/trainertrack?retryWrites=true&w=majority
```

### **Configurações de Produção**

#### **Segurança Adicional:**
```javascript
// Adicionar ao server.js para produção
if (process.env.NODE_ENV === 'production') {
  // Helmet para security headers
  app.use(helmet());
  
  // Rate limiting
  app.use(rateLimit({
    windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 100
  }));
  
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, '../client/build')));
}
```

---

## Segurança

### **Implementações de Segurança**

#### **Autenticação e Autorização:**
- **JWT (JSON Web Tokens)**: Autenticação stateless
- **bcrypt**: Hash de senhas com salt (rounds: 10)
- **Role-based access control**: Admin, Trainer, User
- **Token expiration**: 24h por padrão

#### **Validação de Dados:**
```javascript
// Validações implementadas
- Email format validation
- Password strength (mínimo 6 caracteres)
- ObjectId validation para MongoDB
- Sanitização de inputs
- Role validation
```

#### **Proteções contra Ataques:**
- **SQL Injection**: MongoDB nativo (NoSQL)
- **XSS**: Validação e sanitização de entrada
- **CSRF**: Tokens JWT stateless
- **Rate Limiting**: Configurável por ambiente

#### **Headers de Segurança (Produção):**
```javascript
// Usar helmet.js em produção
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"]
    }
  }
}));
```

### **Boas Práticas de Segurança**

#### **Variáveis Sensíveis:**
- JWT_SECRET com mínimo 32 caracteres
- Senhas do banco nunca no código
- Usar HTTPS em produção
- Configurar CORS restritivamente

#### **Monitoramento:**
- Logs de tentativas de login
- Logs de erros de autenticação
- Monitoring de requests suspeitos


## Monitoramento

### **Health Checks**

#### **Endpoint de Saúde (Implementar):**
```javascript
// GET /api/health
{
  "status": "healthy",
  "timestamp": "2025-01-15T10:30:00Z",
  "uptime": "2h 30m 45s",
  "database": {
    "status": "connected",
    "responseTime": "25ms"
  },
  "memory": {
    "used": "156MB",
    "free": "2.1GB"
  },
  "version": "1.0.0"
}
```

### **Métricas Importantes**

#### **Performance:**
- Tempo de resposta da API < 200ms
- Tempo de carregamento do frontend < 3s
- Uptime > 99.5%
- Queries MongoDB < 100ms

#### **Negócio:**
- Número de usuários ativos
- Registros de métricas por dia
- Treinos criados por período
- Taxa de retenção de usuários

### **Logging**

#### **Logs Críticos:**
```javascript
// Estrutura de log recomendada
{
  timestamp: "2025-01-15T10:30:00Z",
  level: "info|warn|error",
  message: "Descrição do evento",
  userId: "user_id",
  action: "login|create_workout|etc",
  ip: "192.168.1.1",
  userAgent: "Mozilla/5.0...",
  responseTime: "120ms"
}
```

#### **Ferramentas Recomendadas:**
- **Desenvolvimento**: Console.log + Winston
- **Produção**: Winston + LogTail/Papertrail
- **Monitoring**: Uptimerobot/Pingdom
- **Analytics**: Google Analytics (frontend)

---

## Conclusão

O **TrainerTrack** representa uma solução moderna e completa para personal trainers, desenvolvida com tecnologias atuais e padrões de desenvolvimento web. A arquitetura modular e escalável permite futuras expansões e integrações, mantendo a qualidade e performance do sistema.

A combinação de **MongoDB**, **Express.js**, **React.js** e **Node.js** (stack MERN) proporciona uma base sólida para o desenvolvimento de uma aplicação web robusta, responsiva e de fácil manutenção.

---

**Versão do Documento:** 1.0  
**Data:** Janeiro 2025  
**Autor:** Vitor Passagem
