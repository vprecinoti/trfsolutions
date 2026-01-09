#!/usr/bin/env node

/**
 * Script para gerar JWT_SECRET seguro
 * Uso: node scripts/generate-jwt-secret.js
 */

const crypto = require('crypto');

console.log('\n🔐 Gerando JWT_SECRET seguro...\n');

const secret = crypto.randomBytes(64).toString('hex');

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('JWT_SECRET gerado com sucesso!');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('Cole este valor na variável JWT_SECRET do Railway:\n');
console.log(`JWT_SECRET=${secret}\n`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
console.log('⚠️  IMPORTANTE: Guarde este valor em local seguro!');
console.log('⚠️  Não compartilhe este valor publicamente!\n');
