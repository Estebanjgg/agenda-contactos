#!/usr/bin/env node

/**
 * Script de configuración automática para GitHub Pages
 * Ejecutar con: node setup-github-pages.js [tu-usuario-github]
 */

const fs = require('fs');
const path = require('path');

function updatePackageJson(username) {
  const packagePath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  packageJson.homepage = `https://${username}.github.io/agenda-contactos`;
  
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  console.log('✅ package.json actualizado con tu usuario de GitHub');
}

function updateEnvProduction(username) {
  const envPath = path.join(__dirname, '.env.production');
  let envContent = fs.readFileSync(envPath, 'utf8');
  
  envContent = envContent.replace(
    'REACT_APP_API_URL=https://tu-usuario.github.io/agenda-contactos',
    `REACT_APP_API_URL=https://${username}.github.io/agenda-contactos`
  );
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env.production actualizado');
}

function updateDeploymentMd(username) {
  const deploymentPath = path.join(__dirname, 'DEPLOYMENT.md');
  let content = fs.readFileSync(deploymentPath, 'utf8');
  
  content = content.replace(/\[tu-usuario\]/g, username);
  
  fs.writeFileSync(deploymentPath, content);
  console.log('✅ DEPLOYMENT.md actualizado');
}

function showInstructions(username) {
  console.log('\n🚀 Configuración completada!');
  console.log('\n📋 Próximos pasos:');
  console.log('1. Crear repositorio en GitHub llamado "agenda-contactos"');
  console.log('2. Subir el código:');
  console.log('   git init');
  console.log('   git add .');
  console.log('   git commit -m "Initial commit with GitHub Actions setup"');
  console.log('   git branch -M main');
  console.log(`   git remote add origin https://github.com/${username}/agenda-contactos.git`);
  console.log('   git push -u origin main');
  console.log('\n3. Configurar GitHub Pages:');
  console.log('   - Ve a Settings → Pages');
  console.log('   - En "Source", selecciona "GitHub Actions"');
  console.log('\n4. Configurar permisos:');
  console.log('   - Ve a Settings → Actions → General');
  console.log('   - Habilita "Read and write permissions"');
  console.log(`\n🌐 Tu app estará disponible en: https://${username}.github.io/agenda-contactos`);
}

function main() {
  const username = process.argv[2];
  
  if (!username) {
    console.error('❌ Error: Debes proporcionar tu nombre de usuario de GitHub');
    console.log('Uso: node setup-github-pages.js [tu-usuario-github]');
    console.log('Ejemplo: node setup-github-pages.js miusuario');
    process.exit(1);
  }
  
  console.log(`🔧 Configurando GitHub Pages para el usuario: ${username}`);
  
  try {
    updatePackageJson(username);
    updateEnvProduction(username);
    updateDeploymentMd(username);
    showInstructions(username);
  } catch (error) {
    console.error('❌ Error durante la configuración:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { updatePackageJson, updateEnvProduction, updateDeploymentMd };