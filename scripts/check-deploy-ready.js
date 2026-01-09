#!/usr/bin/env node

/**
 * Script para verificar se o projeto está pronto para deploy
 * Uso: node scripts/check-deploy-ready.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verificando se o projeto está pronto para deploy...\n');

const checks = [];
let allPassed = true;

// Função auxiliar para verificar arquivo
function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  checks.push({
    description,
    passed: exists,
    message: exists ? '✅ OK' : '❌ Não encontrado'
  });
  if (!exists) allPassed = false;
  return exists;
}

// Função auxiliar para verificar conteúdo
function checkContent(filePath, searchString, description) {
  if (!fs.existsSync(filePath)) {
    checks.push({
      description,
      passed: false,
      message: '❌ Arquivo não encontrado'
    });
    allPassed = false;
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const hasContent = content.includes(searchString);
  checks.push({
    description,
    passed: hasContent,
    message: hasContent ? '✅ OK' : '⚠️  Não configurado'
  });
  if (!hasContent) allPassed = false;
  return hasContent;
}

// Verificações
console.log('📁 Estrutura de arquivos:\n');

checkFile('backend/package.json', 'Backend package.json');
checkFile('frontend/package.json', 'Frontend package.json');
checkFile('backend/prisma/schema.prisma', 'Prisma schema');
checkFile('backend/Procfile', 'Procfile (Railway)');
checkFile('frontend/vercel.json', 'vercel.json');
checkFile('backend/railway.json', 'railway.json');

console.log('\n🔧 Configurações:\n');

checkFile('backend/.env.example', '.env.example (backend)');
checkFile('frontend/.env.example', '.env.example (frontend)');
checkContent('backend/.gitignore', '.env', '.gitignore protege .env (backend)');
checkContent('frontend/.gitignore', '.env', '.gitignore protege .env (frontend)');

console.log('\n📦 Scripts de build:\n');

checkContent('backend/package.json', '"build":', 'Script de build (backend)');
checkContent('backend/package.json', '"start:prod":', 'Script start:prod (backend)');
checkContent('frontend/package.json', '"build":', 'Script de build (frontend)');
checkContent('frontend/package.json', '"start":', 'Script start (frontend)');

// Exibir resultados
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('RESULTADOS:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

checks.forEach(check => {
  console.log(`${check.message} ${check.description}`);
});

console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (allPassed) {
  console.log('✅ Projeto pronto para deploy!\n');
  console.log('Próximos passos:');
  console.log('1. Criar repositório no GitHub');
  console.log('2. Push do código: git push origin main');
  console.log('3. Seguir o guia em DEPLOY.md\n');
} else {
  console.log('⚠️  Alguns itens precisam de atenção antes do deploy.\n');
  console.log('Verifique os itens marcados com ❌ acima.\n');
}

process.exit(allPassed ? 0 : 1);
