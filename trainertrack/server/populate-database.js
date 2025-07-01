// Script para popular o banco de dados completo do TrainerTrack
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { dbConfig } = require('./config/db');

// Import models
const User = require('./models/user.model');
const Client = require('./models/client.model');
const Metrics = require('./models/metrics.model');
const Workout = require('./models/workout.model');

async function populateDatabase() {
    try {
        console.log('🔗 Conectando ao MongoDB...');
        await mongoose.connect(dbConfig.url, dbConfig.options);
        console.log('✅ Conectado ao MongoDB');

        // Limpar todas as coleções (exceto admin)
        console.log('\n🧹 Limpando banco de dados...');
        
        // Buscar admin antes de limpar
        const adminUser = await User.findOne({ role: 'admin' });
        
        // Limpar coleções
        await User.deleteMany({ role: { $ne: 'admin' } });
        await Client.deleteMany({});
        await Metrics.deleteMany({});
        await Workout.deleteMany({});
        
        console.log('✅ Banco limpo (admin preservado)');

        // Criar treinadores
        console.log('\n👨‍💼 Criando treinadores...');
        const trainers = await createTrainers();
        
        // Criar clientes
        console.log('\n🏃‍♂️ Criando clientes...');
        const clients = await createClients(trainers);
        
        // Criar métricas para clientes
        console.log('\n📊 Criando métricas...');
        await createMetrics(clients);
        
        // Criar treinos
        console.log('\n💪 Criando treinos...');
        await createWorkouts(clients, trainers);
        
        console.log('\n🎉 Banco de dados populado com sucesso!');
        console.log('\n📋 CREDENCIAIS CRIADAS:');
        console.log('\n👨‍💼 TREINADORES (7):');
        console.log('  - carlos.silva@trainertrack.com / trainer123 (Musculação e Hipertrofia)');
        console.log('  - ana.costa@trainertrack.com / trainer123 (Emagrecimento e Condicionamento)');
        console.log('  - pedro.santos@trainertrack.com / trainer123 (Crossfit e Funcional)');
        console.log('  - juliana.oliveira@trainertrack.com / trainer123 (Pilates e Flexibilidade)');
        console.log('  - rodrigo.ferreira@trainertrack.com / trainer123 (Powerlifting e Força)');
        console.log('  - camila.martins@trainertrack.com / trainer123 (Yoga e Bem-estar)');
        console.log('  - rafael.almeida@trainertrack.com / trainer123 (Atletismo e Corrida)');
        
        console.log('\n🏃‍♂️ CLIENTES (25) - Principais:');
        console.log('  - diego.barbosa@gmail.com / client123 (Diego Barbosa)');
        console.log('  - maria.oliveira@gmail.com / client123 (Maria Oliveira)');
        console.log('  - joao.fernandes@gmail.com / client123 (João Fernandes)');
        console.log('  - ana.rodrigues@gmail.com / client123 (Ana Rodrigues)');
        console.log('  - lucas.almeida@gmail.com / client123 (Lucas Almeida)');
        console.log('  - carla.mendoza@gmail.com / client123 (Carla Mendoza)');
        console.log('  - bruno.santos@gmail.com / client123 (Bruno Santos)');
        console.log('  - fernanda.lima@gmail.com / client123 (Fernanda Lima)');
        console.log('  - ricardo.costa@gmail.com / client123 (Ricardo Costa)');
        console.log('  - patricia.silva@gmail.com / client123 (Patrícia Silva)');
        console.log('  - marcos.pereira@gmail.com / client123 (Marcos Pereira)');
        console.log('  - isabela.moura@gmail.com / client123 (Isabela Moura)');
        console.log('  - gabriel.ramos@gmail.com / client123 (Gabriel Ramos)');
        console.log('  - juliana.castro@gmail.com / client123 (Juliana Castro)');
        console.log('  - thiago.souza@gmail.com / client123 (Thiago Souza)');
        console.log('  - amanda.freitas@gmail.com / client123 (Amanda Freitas)');
        console.log('  - felipe.barbosa@gmail.com / client123 (Felipe Barbosa)');
        console.log('  - larissa.martins@gmail.com / client123 (Larissa Martins)');
        console.log('  - vinicius.gomes@gmail.com / client123 (Vinícius Gomes)');
        console.log('  - natalia.dias@gmail.com / client123 (Natália Dias)');
        console.log('  - eduardo.rocha@gmail.com / client123 (Eduardo Rocha)');
        console.log('  - carolina.nunes@gmail.com / client123 (Carolina Nunes)');
        console.log('  - andre.machado@gmail.com / client123 (André Machado)');
        console.log('  - priscila.torres@gmail.com / client123 (Priscila Torres)');
        console.log('  - leandro.cardoso@gmail.com / client123 (Leandro Cardoso)');
        console.log('  - bianca.azevedo@gmail.com / client123 (Bianca Azevedo)');
        
        console.log('\n📊 DADOS CRIADOS:');
        console.log(`  - ${clients.length} clientes com histórico completo de métricas`);
        console.log(`  - 3-7 medições por cliente (peso, altura, IMC, gordura, músculo)`);
        console.log(`  - 2-3 treinos personalizados por cliente`);
        console.log(`  - Clientes distribuídos entre os ${trainers.length} treinadores`);
        
        if (adminUser) {
            console.log('\n🔧 ADMIN (preservado):');
            console.log(`  - ${adminUser.email} / (senha existente)`);
        }

    } catch (error) {
        console.error('❌ Erro:', error);
    } finally {
        mongoose.disconnect();
        console.log('\n🔌 Desconectado do MongoDB');
    }
}

async function createTrainers() {
    const trainersData = [
        {
            username: 'carlos_silva',
            email: 'carlos.silva@trainertrack.com',
            password: 'trainer123',
            firstName: 'Carlos',
            lastName: 'Silva',
            specialty: 'Musculação e Hipertrofia',
            experience: '5 anos'
        },
        {
            username: 'ana_costa',
            email: 'ana.costa@trainertrack.com',
            password: 'trainer123',
            firstName: 'Ana',
            lastName: 'Costa',
            specialty: 'Emagrecimento e Condicionamento',
            experience: '8 anos'
        },
        {
            username: 'pedro_santos',
            email: 'pedro.santos@trainertrack.com',
            password: 'trainer123',
            firstName: 'Pedro',
            lastName: 'Santos',
            specialty: 'Crossfit e Funcional',
            experience: '3 anos'
        },
        {
            username: 'juliana_oliveira',
            email: 'juliana.oliveira@trainertrack.com',
            password: 'trainer123',
            firstName: 'Juliana',
            lastName: 'Oliveira',
            specialty: 'Pilates e Flexibilidade',
            experience: '6 anos'
        },
        {
            username: 'rodrigo_ferreira',
            email: 'rodrigo.ferreira@trainertrack.com',
            password: 'trainer123',
            firstName: 'Rodrigo',
            lastName: 'Ferreira',
            specialty: 'Powerlifting e Força',
            experience: '7 anos'
        },
        {
            username: 'camila_martins',
            email: 'camila.martins@trainertrack.com',
            password: 'trainer123',
            firstName: 'Camila',
            lastName: 'Martins',
            specialty: 'Yoga e Bem-estar',
            experience: '4 anos'
        },
        {
            username: 'rafael_almeida',
            email: 'rafael.almeida@trainertrack.com',
            password: 'trainer123',
            firstName: 'Rafael',
            lastName: 'Almeida',
            specialty: 'Atletismo e Corrida',
            experience: '9 anos'
        }
    ];

    const trainers = [];
    
    for (const trainerData of trainersData) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(trainerData.password, salt);
        
        const trainer = new User({
            username: trainerData.username,
            email: trainerData.email,
            password: hashedPassword,
            role: 'trainer',
            profile: {
                firstName: trainerData.firstName,
                lastName: trainerData.lastName,
                specialty: trainerData.specialty,
                experience: trainerData.experience
            }
        });
        
        await trainer.save();
        trainers.push(trainer);
        console.log(`  ✅ Treinador criado: ${trainerData.firstName} ${trainerData.lastName} (${trainerData.specialty})`);
    }
    
    return trainers;
}

async function createClients(trainers) {
    const clientsData = [
        // Clientes principais
        {
            username: 'diego_barbosa',
            email: 'diego.barbosa@gmail.com',
            password: 'client123',
            firstName: 'Diego',
            lastName: 'Barbosa',
            name: 'Diego Barbosa',
            phone: '(11) 99999-1234',
            currentWeight: 78.5,
            currentHeight: 178
        },
        {
            username: 'maria_oliveira',
            email: 'maria.oliveira@gmail.com',
            password: 'client123',
            firstName: 'Maria',
            lastName: 'Oliveira',
            name: 'Maria Oliveira',
            phone: '(11) 99999-5678',
            currentWeight: 65.0,
            currentHeight: 165
        },
        {
            username: 'joao_fernandes',
            email: 'joao.fernandes@gmail.com',
            password: 'client123',
            firstName: 'João',
            lastName: 'Fernandes',
            name: 'João Fernandes',
            phone: '(11) 99999-9012',
            currentWeight: 82.3,
            currentHeight: 175
        },
        {
            username: 'ana_rodrigues',
            email: 'ana.rodrigues@gmail.com',
            password: 'client123',
            firstName: 'Ana',
            lastName: 'Rodrigues',
            name: 'Ana Rodrigues',
            phone: '(11) 99999-3456',
            currentWeight: 58.7,
            currentHeight: 162
        },
        {
            username: 'lucas_almeida',
            email: 'lucas.almeida@gmail.com',
            password: 'client123',
            firstName: 'Lucas',
            lastName: 'Almeida',
            name: 'Lucas Almeida',
            phone: '(11) 99999-7890',
            currentWeight: 70.2,
            currentHeight: 172
        },
        {
            username: 'carla_mendoza',
            email: 'carla.mendoza@gmail.com',
            password: 'client123',
            firstName: 'Carla',
            lastName: 'Mendoza',
            name: 'Carla Mendoza',
            phone: '(11) 99999-2468',
            currentWeight: 72.8,
            currentHeight: 168
        },
        // Novos clientes (19 adicionais)
        {
            username: 'bruno_santos',
            email: 'bruno.santos@gmail.com',
            password: 'client123',
            firstName: 'Bruno',
            lastName: 'Santos',
            name: 'Bruno Santos',
            phone: '(11) 99988-1111',
            currentWeight: 85.4,
            currentHeight: 180
        },
        {
            username: 'fernanda_lima',
            email: 'fernanda.lima@gmail.com',
            password: 'client123',
            firstName: 'Fernanda',
            lastName: 'Lima',
            name: 'Fernanda Lima',
            phone: '(11) 99988-2222',
            currentWeight: 60.2,
            currentHeight: 167
        },
        {
            username: 'ricardo_costa',
            email: 'ricardo.costa@gmail.com',
            password: 'client123',
            firstName: 'Ricardo',
            lastName: 'Costa',
            name: 'Ricardo Costa',
            phone: '(11) 99988-3333',
            currentWeight: 90.1,
            currentHeight: 183
        },
        {
            username: 'patricia_silva',
            email: 'patricia.silva@gmail.com',
            password: 'client123',
            firstName: 'Patrícia',
            lastName: 'Silva',
            name: 'Patrícia Silva',
            phone: '(11) 99988-4444',
            currentWeight: 55.8,
            currentHeight: 160
        },
        {
            username: 'marcos_pereira',
            email: 'marcos.pereira@gmail.com',
            password: 'client123',
            firstName: 'Marcos',
            lastName: 'Pereira',
            name: 'Marcos Pereira',
            phone: '(11) 99988-5555',
            currentWeight: 77.6,
            currentHeight: 174
        },
        {
            username: 'isabela_moura',
            email: 'isabela.moura@gmail.com',
            password: 'client123',
            firstName: 'Isabela',
            lastName: 'Moura',
            name: 'Isabela Moura',
            phone: '(11) 99988-6666',
            currentWeight: 63.4,
            currentHeight: 169
        },
        {
            username: 'gabriel_ramos',
            email: 'gabriel.ramos@gmail.com',
            password: 'client123',
            firstName: 'Gabriel',
            lastName: 'Ramos',
            name: 'Gabriel Ramos',
            phone: '(11) 99988-7777',
            currentWeight: 73.2,
            currentHeight: 176
        },
        {
            username: 'juliana_castro',
            email: 'juliana.castro@gmail.com',
            password: 'client123',
            firstName: 'Juliana',
            lastName: 'Castro',
            name: 'Juliana Castro',
            phone: '(11) 99988-8888',
            currentWeight: 68.9,
            currentHeight: 164
        },
        {
            username: 'thiago_souza',
            email: 'thiago.souza@gmail.com',
            password: 'client123',
            firstName: 'Thiago',
            lastName: 'Souza',
            name: 'Thiago Souza',
            phone: '(11) 99988-9999',
            currentWeight: 81.7,
            currentHeight: 179
        },
        {
            username: 'amanda_freitas',
            email: 'amanda.freitas@gmail.com',
            password: 'client123',
            firstName: 'Amanda',
            lastName: 'Freitas',
            name: 'Amanda Freitas',
            phone: '(11) 99987-1111',
            currentWeight: 57.3,
            currentHeight: 161
        },
        {
            username: 'felipe_barbosa',
            email: 'felipe.barbosa@gmail.com',
            password: 'client123',
            firstName: 'Felipe',
            lastName: 'Barbosa',
            name: 'Felipe Barbosa',
            phone: '(11) 99987-2222',
            currentWeight: 88.5,
            currentHeight: 182
        },
        {
            username: 'larissa_martins',
            email: 'larissa.martins@gmail.com',
            password: 'client123',
            firstName: 'Larissa',
            lastName: 'Martins',
            name: 'Larissa Martins',
            phone: '(11) 99987-3333',
            currentWeight: 62.1,
            currentHeight: 166
        },
        {
            username: 'vinicius_gomes',
            email: 'vinicius.gomes@gmail.com',
            password: 'client123',
            firstName: 'Vinícius',
            lastName: 'Gomes',
            name: 'Vinícius Gomes',
            phone: '(11) 99987-4444',
            currentWeight: 75.8,
            currentHeight: 173
        },
        {
            username: 'natalia_dias',
            email: 'natalia.dias@gmail.com',
            password: 'client123',
            firstName: 'Natália',
            lastName: 'Dias',
            name: 'Natália Dias',
            phone: '(11) 99987-5555',
            currentWeight: 59.6,
            currentHeight: 163
        },
        {
            username: 'eduardo_rocha',
            email: 'eduardo.rocha@gmail.com',
            password: 'client123',
            firstName: 'Eduardo',
            lastName: 'Rocha',
            name: 'Eduardo Rocha',
            phone: '(11) 99987-6666',
            currentWeight: 84.2,
            currentHeight: 177
        },
        {
            username: 'carolina_nunes',
            email: 'carolina.nunes@gmail.com',
            password: 'client123',
            firstName: 'Carolina',
            lastName: 'Nunes',
            name: 'Carolina Nunes',
            phone: '(11) 99987-7777',
            currentWeight: 66.4,
            currentHeight: 170
        },
        {
            username: 'andre_machado',
            email: 'andre.machado@gmail.com',
            password: 'client123',
            firstName: 'André',
            lastName: 'Machado',
            name: 'André Machado',
            phone: '(11) 99987-8888',
            currentWeight: 79.3,
            currentHeight: 175
        },
        {
            username: 'priscila_torres',
            email: 'priscila.torres@gmail.com',
            password: 'client123',
            firstName: 'Priscila',
            lastName: 'Torres',
            name: 'Priscila Torres',
            phone: '(11) 99987-9999',
            currentWeight: 61.8,
            currentHeight: 165
        },
        {
            username: 'leandro_cardoso',
            email: 'leandro.cardoso@gmail.com',
            password: 'client123',
            firstName: 'Leandro',
            lastName: 'Cardoso',
            name: 'Leandro Cardoso',
            phone: '(11) 99986-1111',
            currentWeight: 86.7,
            currentHeight: 181
        },
        {
            username: 'bianca_azevedo',
            email: 'bianca.azevedo@gmail.com',
            password: 'client123',
            firstName: 'Bianca',
            lastName: 'Azevedo',
            name: 'Bianca Azevedo',
            phone: '(11) 99986-2222',
            currentWeight: 64.5,
            currentHeight: 168
        }
    ];

    const clients = [];
    
    for (let i = 0; i < clientsData.length; i++) {
        const clientData = clientsData[i];
        const assignedTrainer = trainers[i % trainers.length]; // Distribuir clientes entre treinadores
        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(clientData.password, salt);
        
        // Criar usuário
        const user = new User({
            username: clientData.username,
            email: clientData.email,
            password: hashedPassword,
            role: 'user',
            profile: {
                firstName: clientData.firstName,
                lastName: clientData.lastName
            }
        });
        
        await user.save();
        
        // Criar dados de cliente conforme o modelo
        const client = new Client({
            name: clientData.name,
            email: clientData.email,
            phone: clientData.phone,
            user: user._id, // Referência ao usuário
            trainer: assignedTrainer._id, // Referência ao treinador
            metrics: [], // Será populado pela função createMetrics
            workoutPlans: [], // Será populado pela função createWorkouts
            createdAt: new Date()
        });
        
        await client.save();
        
        clients.push({
            user: user,
            client: client,
            trainer: assignedTrainer,
            currentWeight: clientData.currentWeight,
            currentHeight: clientData.currentHeight
        });
        
        console.log(`  ✅ Cliente ${i + 1}/25: ${clientData.firstName} ${clientData.lastName} (Treinador: ${assignedTrainer.profile.firstName})`);
    }
    
    return clients;
}

async function createMetrics(clients) {
    for (const clientInfo of clients) {
        const baseDate = new Date();
        const metricsCount = Math.floor(Math.random() * 5) + 3; // 3-7 medições por cliente
        
        for (let i = 0; i < metricsCount; i++) {
            const daysAgo = (metricsCount - i - 1) * 30; // Uma medição por mês
            const date = new Date(baseDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
            
            // Simular progressão realista
            const progressFactor = i / (metricsCount - 1);
            const weightChange = clientInfo.user.profile.firstName === 'Maria' || clientInfo.user.profile.firstName === 'Carla' ? -2 : 1;
            const weight = clientInfo.currentWeight + (weightChange * progressFactor);
            
            const bodyFat = clientInfo.user.profile.firstName.includes('a') ? 
                25 - (progressFactor * 3) : 18 - (progressFactor * 2);
            const muscleMass = 35 + (progressFactor * 4);
            
            // Criar métrica na tabela Metrics separada
            const metric = new Metrics({
                clientId: clientInfo.user._id, // Usar o ID do usuário
                date: date,
                weight: Math.round(weight * 10) / 10,
                height: clientInfo.currentHeight,
                bodyFatPercentage: Math.round(bodyFat * 10) / 10,
                muscleMassPercentage: Math.round(muscleMass * 10) / 10,
                notes: i === 0 ? 'Avaliação inicial' : 
                       i === metricsCount - 1 ? 'Última avaliação' : 
                       'Acompanhamento mensal'
            });
            
            await metric.save();
        }
        
        console.log(`  ✅ ${metricsCount} métricas criadas para ${clientInfo.user.profile.firstName}`);
    }
}

async function createWorkouts(clients, trainers) {
    const workoutTemplates = [
        {
            exercises: [
                { name: 'Supino reto', sets: 4, reps: 10, weight: 70 },
                { name: 'Supino inclinado', sets: 3, reps: 12, weight: 60 },
                { name: 'Crucifixo', sets: 3, reps: 15, weight: 15 },
                { name: 'Paralelas', sets: 3, reps: 10, weight: 0 },
                { name: 'Tríceps pulley', sets: 3, reps: 15, weight: 40 }
            ],
            notes: 'Treino A - Peito e Tríceps'
        },
        {
            exercises: [
                { name: 'Puxada frontal', sets: 4, reps: 10, weight: 60 },
                { name: 'Remada curvada', sets: 3, reps: 12, weight: 50 },
                { name: 'Remada sentada', sets: 3, reps: 15, weight: 45 },
                { name: 'Rosca direta', sets: 3, reps: 12, weight: 20 },
                { name: 'Rosca martelo', sets: 3, reps: 15, weight: 15 }
            ],
            notes: 'Treino B - Costas e Bíceps'
        },
        {
            exercises: [
                { name: 'Agachamento', sets: 4, reps: 10, weight: 80 },
                { name: 'Leg press', sets: 3, reps: 15, weight: 120 },
                { name: 'Extensora', sets: 3, reps: 20, weight: 40 },
                { name: 'Flexora', sets: 3, reps: 15, weight: 35 },
                { name: 'Panturrilha em pé', sets: 4, reps: 20, weight: 60 }
            ],
            notes: 'Treino C - Pernas'
        },
        {
            exercises: [
                { name: 'Desenvolvimento militar', sets: 4, reps: 10, weight: 40 },
                { name: 'Elevação lateral', sets: 3, reps: 15, weight: 10 },
                { name: 'Elevação frontal', sets: 3, reps: 12, weight: 8 },
                { name: 'Elevação posterior', sets: 3, reps: 15, weight: 6 },
                { name: 'Encolhimento', sets: 3, reps: 12, weight: 30 }
            ],
            notes: 'Treino D - Ombros e Trapézio'
        },
        {
            exercises: [
                { name: 'Burpees', sets: 3, reps: 10, weight: 0 },
                { name: 'Mountain climbers', sets: 3, reps: 20, weight: 0 },
                { name: 'Jumping jacks', sets: 3, reps: 30, weight: 0 },
                { name: 'Prancha', sets: 3, reps: 45, weight: 0 },
                { name: 'Agachamento jump', sets: 3, reps: 15, weight: 0 }
            ],
            notes: 'Treino E - Cardio e Funcional'
        },
        {
            exercises: [
                { name: 'Abdominal supra', sets: 4, reps: 20, weight: 0 },
                { name: 'Abdominal oblíquo', sets: 3, reps: 15, weight: 0 },
                { name: 'Prancha lateral', sets: 3, reps: 30, weight: 0 },
                { name: 'Russian twist', sets: 3, reps: 20, weight: 10 },
                { name: 'Bicicleta', sets: 3, reps: 25, weight: 0 }
            ],
            notes: 'Treino F - Core e Abdomen'
        },
        {
            exercises: [
                { name: 'Deadlift', sets: 4, reps: 8, weight: 100 },
                { name: 'Agachamento búlgaro', sets: 3, reps: 12, weight: 20 },
                { name: 'Hip thrust', sets: 3, reps: 15, weight: 60 },
                { name: 'Stiff', sets: 3, reps: 12, weight: 50 },
                { name: 'Afundo', sets: 3, reps: 10, weight: 15 }
            ],
            notes: 'Treino G - Posterior e Glúteos'
        },
        {
            exercises: [
                { name: 'Kettlebell swing', sets: 4, reps: 15, weight: 16 },
                { name: 'Turkish get-up', sets: 3, reps: 5, weight: 12 },
                { name: 'Farmer walk', sets: 3, reps: 30, weight: 20 },
                { name: 'Clean and press', sets: 3, reps: 8, weight: 16 },
                { name: 'Goblet squat', sets: 3, reps: 12, weight: 16 }
            ],
            notes: 'Treino H - Funcional com Kettlebell'
        }
    ];

    for (const clientInfo of clients) {
        const assignedWorkouts = Math.floor(Math.random() * 3) + 2; // 2-4 treinos por cliente
        const workoutIds = [];
        
        for (let i = 0; i < assignedWorkouts; i++) {
            const template = workoutTemplates[i % workoutTemplates.length];
            
            const workout = new Workout({
                name: `Treino ${String.fromCharCode(65 + (i % workoutTemplates.length))} - ${clientInfo.user.profile.firstName}`,
                clientId: clientInfo.client._id,
                trainerId: clientInfo.trainer._id,
                description: `Plano personalizado para ${clientInfo.user.profile.firstName}`,
                exercises: template.exercises.map(ex => ({
                    ...ex,
                    restTime: 60 + Math.floor(Math.random() * 60) // 60-120 segundos
                })),
                date: new Date(),
                notes: template.notes,
                isActive: true
            });
            
            await workout.save();
            workoutIds.push(workout._id);
        }
        
        // Atualizar o cliente com os IDs dos treinos
        await Client.findByIdAndUpdate(clientInfo.client._id, {
            workoutPlans: workoutIds
        });
        
        console.log(`  ✅ ${assignedWorkouts} treinos criados para ${clientInfo.user.profile.firstName}`);
    }
}

// Executar script
populateDatabase();
