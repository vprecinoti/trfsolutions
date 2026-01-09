const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createTestData() {
  console.log('🧪 Criando dados de teste para notificações...');

  try {
    // Criar alguns usuários de teste
    const testUsers = [
      {
        email: 'usuario1@teste.com',
        name: 'João Silva',
        passwordHash: await bcrypt.hash('123456', 10),
      },
      {
        email: 'usuario2@teste.com',
        name: 'Maria Santos',
        passwordHash: await bcrypt.hash('123456', 10),
      },
    ];

    for (const userData of testUsers) {
      await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: {
          ...userData,
          role: 'BASIC',
          active: true,
          tokenVersion: 0,
          failedLoginAttempts: 0,
        },
      });
    }

    // Criar alguns leads de teste
    const testLeads = [
      {
        nome: 'Cliente Teste 1',
        email: 'cliente1@teste.com',
        telefone: '11999999999',
        empresa: 'Empresa Teste 1',
        cargo: 'Gerente',
        score: 85,
        status: 'NOVO',
      },
      {
        nome: 'Cliente Teste 2',
        email: 'cliente2@teste.com',
        telefone: '11888888888',
        empresa: 'Empresa Teste 2',
        cargo: 'Diretor',
        score: 92,
        status: 'QUALIFICADO',
      },
    ];

    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@thiagoplatform.com' },
    });

    if (adminUser) {
      for (const leadData of testLeads) {
        await prisma.lead.create({
          data: {
            ...leadData,
            userId: adminUser.id,
          },
        });
      }
    }

    // Criar alguns logs de login (sucessos e falhas)
    const loginLogs = [
      {
        email: 'admin@thiagoplatform.com',
        success: true,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0...',
        userId: adminUser?.id,
      },
      {
        email: 'usuario1@teste.com',
        success: false,
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0...',
        failReason: 'invalid_password',
      },
      {
        email: 'hacker@malicious.com',
        success: false,
        ipAddress: '10.0.0.1',
        userAgent: 'curl/7.68.0',
        failReason: 'user_not_found',
      },
    ];

    for (const logData of loginLogs) {
      await prisma.loginLog.create({
        data: logData,
      });
    }

    console.log('✅ Dados de teste criados com sucesso!');
    console.log('📊 Agora você pode testar o painel Super Admin');
    console.log('🔗 Acesse: /dashboard/super-admin');

  } catch (error) {
    console.error('❌ Erro ao criar dados de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestData();