import { Client } from 'pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('✅ Conectado ao banco de dados');

    // Verificar se usuário admin já existe
    const checkResult = await client.query(
      'SELECT id FROM users WHERE email = $1',
      ['admin@thiagoplatform.com']
    );

    if (checkResult.rows.length > 0) {
      console.log('✅ Usuário admin já existe');
      return;
    }

    // Criar hash da senha (senha forte: mínimo 8 chars, maiúscula, minúscula, número)
    const hashedPassword = await bcrypt.hash('Admin123', 10);

    // Inserir usuário admin
    await client.query(
      `INSERT INTO users (id, email, password_hash, name, role, active, token_version, failed_login_attempts, created_at, updated_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      ['admin@thiagoplatform.com', hashedPassword, 'Administrador', 'ADMIN', true, 0, 0]
    );

    console.log('✅ Usuário admin criado com sucesso!');
    console.log('📧 Email: admin@thiagoplatform.com');
    console.log('🔑 Senha: Admin123');
    console.log('⚠️  IMPORTANTE: Troque a senha após o primeiro login!');
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    throw error;
  } finally {
    await client.end();
  }
}

main()
  .catch((e) => {
    console.error('❌ Erro:', e);
    process.exit(1);
  });

