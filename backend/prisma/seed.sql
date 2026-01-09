-- Seed para criar usuário admin padrão
-- Senha: admin123 (hash bcrypt)

-- Verificar se já existe
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@thiagoplatform.com') THEN
    INSERT INTO users (id, email, password_hash, name, role, active, created_at, updated_at)
    VALUES (
      gen_random_uuid(),
      'admin@thiagoplatform.com',
      '$2a$10$rOzJqZqZqZqZqZqZqZqZqOqZqZqZqZqZqZqZqZqZqZqZqZqZqZqZq', -- admin123
      'Administrador',
      'ADMIN',
      true,
      NOW(),
      NOW()
    );
  END IF;
END $$;

