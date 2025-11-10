#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 Verificando entorno de desarrollo...\n');

// Verificar Node.js
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
  console.log('✅ Node.js:', nodeVersion);
} catch (error) {
  console.log('❌ Node.js: No instalado');
}

// Verificar npm
try {
  const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
  console.log('✅ npm:', npmVersion);
} catch (error) {
  console.log('❌ npm: No instalado');
}

// Verificar Java
try {
  const javaVersion = execSync('java -version 2>&1', { encoding: 'utf-8' }).split('\n')[0];
  console.log('✅ Java:', javaVersion);
} catch (error) {
  console.log('❌ Java: No instalado - Necesario para compilar Android');
}

// Verificar carpeta www
if (fs.existsSync('./www')) {
  console.log('✅ Build (www): Existe');
} else {
  console.log('⚠️  Build (www): No existe - Ejecuta: npm run build');
}

// Verificar carpeta android
if (fs.existsSync('./android')) {
  console.log('✅ Android: Configurado');
} else {
  console.log('⚠️  Android: No configurado - Ejecuta: npx cap add android');
}

console.log('\n📋 Pasos siguientes:');
console.log('1. npm run build          - Compilar el juego');
console.log('2. npx cap sync android   - Sincronizar con Android');
console.log('3. npx cap open android   - Abrir Android Studio');
console.log('4. En Android Studio: Build > Generate Signed Bundle / APK\n');

