#!/usr/bin/env node

/**
 * 🔧 Script de Configuración para Commit Automático - Metanoia V1.0.2
 *
 * Este script configura el commit automático en el sistema
 * y proporciona opciones de configuración.
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class AutoCommitSetup {
  constructor() {
    this.config = {
      interval: 30, // minutos
      enabled: true,
      pushToGitHub: true,
      logLevel: 'INFO',
      maxLogSize: 1024 * 1024, // 1MB
    }
  }

  /**
   * Verificar si Git está configurado
   */
  checkGitConfig() {
    try {
      execSync('git --version', { stdio: 'pipe' })
      console.log('✅ Git está instalado')
      return true
    } catch (error) {
      console.error('❌ Git no está instalado o no está en el PATH')
      return false
    }
  }

  /**
   * Verificar si hay un repositorio Git
   */
  checkGitRepository() {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'pipe' })
      console.log('✅ Repositorio Git encontrado')
      return true
    } catch (error) {
      console.error('❌ No se encontró un repositorio Git en este directorio')
      return false
    }
  }

  /**
   * Verificar configuración de Git
   */
  checkGitUserConfig() {
    try {
      const name = execSync('git config user.name', { encoding: 'utf8' }).trim()
      const email = execSync('git config user.email', {
        encoding: 'utf8',
      }).trim()

      if (name && email) {
        console.log(`✅ Git configurado: ${name} <${email}>`)
        return true
      } else {
        console.error('❌ Git no está configurado con nombre y email')
        return false
      }
    } catch (error) {
      console.error('❌ Error verificando configuración de Git')
      return false
    }
  }

  /**
   * Verificar conexión con GitHub
   */
  checkGitHubConnection() {
    try {
      const remotes = execSync('git remote -v', { encoding: 'utf8' })
      if (remotes.includes('github.com')) {
        console.log('✅ Conexión con GitHub configurada')
        return true
      } else {
        console.log('⚠️ No se encontró conexión con GitHub')
        return false
      }
    } catch (error) {
      console.error('❌ Error verificando conexión con GitHub')
      return false
    }
  }

  /**
   * Crear archivo de configuración
   */
  createConfigFile() {
    const configPath = 'scripts/auto-commit-config.json'
    const config = {
      ...this.config,
      createdAt: new Date().toISOString(),
      version: '1.0.0',
      description: 'Configuración para commit automático de Metanoia V1.0.2',
    }

    try {
      fs.writeFileSync(configPath, JSON.stringify(config, null, 2))
      console.log(`✅ Archivo de configuración creado: ${configPath}`)
      return true
    } catch (error) {
      console.error(
        `❌ Error creando archivo de configuración: ${error.message}`
      )
      return false
    }
  }

  /**
   * Crear script de inicio
   */
  createStartScript() {
    const startScript = `#!/bin/bash
# 🤖 Script de Inicio para Commit Automático
# Generado automáticamente por setup-auto-commit.js

echo "🚀 Iniciando commit automático para Metanoia V1.0.1..."
echo "📁 Directorio: $(pwd)"
echo "⏰ Intervalo: ${this.config.interval} minutos"
echo ""

# Verificar si Node.js está disponible
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js encontrado, usando script JavaScript..."
    node scripts/auto-commit.js
else
    echo "⚠️ Node.js no encontrado, usando script Bash..."
    bash scripts/auto-commit.sh
fi
`

    try {
      fs.writeFileSync('scripts/start-auto-commit.sh', startScript)
      fs.chmodSync('scripts/start-auto-commit.sh', '755')
      console.log('✅ Script de inicio creado: scripts/start-auto-commit.sh')
      return true
    } catch (error) {
      console.error(`❌ Error creando script de inicio: ${error.message}`)
      return false
    }
  }

  /**
   * Crear script de Windows
   */
  createWindowsScript() {
    const windowsScript = `@echo off
REM 🤖 Script de Inicio para Commit Automático en Windows
REM Generado automáticamente por setup-auto-commit.js

echo 🚀 Iniciando commit automático para Metanoia V1.0.1...
echo 📁 Directorio: %CD%
echo ⏰ Intervalo: ${this.config.interval} minutos
echo.

REM Verificar si Node.js está disponible
where node >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js encontrado, usando script JavaScript...
    node scripts/auto-commit.js
) else (
    echo ⚠️ Node.js no encontrado, usando script Batch...
    call scripts/auto-commit.bat
)
`

    try {
      fs.writeFileSync('scripts/start-auto-commit.bat', windowsScript)
      console.log('✅ Script de Windows creado: scripts/start-auto-commit.bat')
      return true
    } catch (error) {
      console.error(`❌ Error creando script de Windows: ${error.message}`)
      return false
    }
  }

  /**
   * Crear documentación
   */
  createDocumentation() {
    const docs = `# 🤖 Commit Automático - Metanoia V1.0.1

## 📋 Descripción

Este sistema de commit automático mantiene tu código respaldado constantemente haciendo commits cada 30 minutos.

## 🚀 Uso

### Iniciar Commit Automático

#### En Windows:
\`\`\`bash
scripts/start-auto-commit.bat
\`\`\`

#### En Linux/Mac:
\`\`\`bash
bash scripts/start-auto-commit.sh
\`\`\`

#### Con Node.js (recomendado):
\`\`\`bash
node scripts/auto-commit.js
\`\`\`

### Detener Commit Automático

Presiona \`Ctrl+C\` para detener el proceso.

## ⚙️ Configuración

El archivo \`scripts/auto-commit-config.json\` contiene la configuración:

- \`interval\`: Intervalo en minutos (default: 30)
- \`enabled\`: Habilitar/deshabilitar (default: true)
- \`pushToGitHub\`: Hacer push automático (default: true)
- \`logLevel\`: Nivel de logging (default: INFO)

## 📊 Características

- ✅ **Commit automático** cada 30 minutos
- ✅ **Solo commitea si hay cambios**
- ✅ **Mensajes descriptivos** con timestamp
- ✅ **Push automático** a GitHub
- ✅ **Logs detallados** de actividad
- ✅ **Manejo de errores** robusto
- ✅ **Estadísticas** de commits

## 📝 Logs

Los logs se guardan en \`scripts/auto-commit.log\` con información detallada:

- Timestamp de cada operación
- Número de archivos modificados
- Estado de push a GitHub
- Errores y advertencias

## 🔧 Solución de Problemas

### Error: "Git no configurado"
\`\`\`bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
\`\`\`

### Error: "No hay repositorio Git"
\`\`\`bash
git init
git remote add origin https://github.com/tu-usuario/Metanoia.v1.0.1.git
\`\`\`

### Error: "Push falló"
- Verifica tu conexión a internet
- Asegúrate de tener permisos de escritura en el repositorio
- El commit se guarda localmente y se sincronizará en el próximo push exitoso

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en \`scripts/auto-commit.log\`
2. Verifica la configuración de Git
3. Asegúrate de tener conexión a internet
4. Contacta al desarrollador si persisten los problemas

---

**© 2024 Metanoia.click - Sistema ERP Modular SaaS**
`

    try {
      fs.writeFileSync('scripts/README-auto-commit.md', docs)
      console.log('✅ Documentación creada: scripts/README-auto-commit.md')
      return true
    } catch (error) {
      console.error(`❌ Error creando documentación: ${error.message}`)
      return false
    }
  }

  /**
   * Ejecutar configuración completa
   */
  async setup() {
    console.log('🔧 CONFIGURANDO COMMIT AUTOMÁTICO - METANOIA V1.0.2')
    console.log('================================================')
    console.log('')

    // Verificaciones
    console.log('🔍 Verificando requisitos...')

    if (!this.checkGitConfig()) {
      console.error(
        '❌ Git no está instalado. Instala Git y vuelve a intentar.'
      )
      return false
    }

    if (!this.checkGitRepository()) {
      console.error('❌ No hay repositorio Git. Ejecuta "git init" primero.')
      return false
    }

    if (!this.checkGitUserConfig()) {
      console.error('❌ Git no está configurado. Configura tu nombre y email:')
      console.error('   git config --global user.name "Tu Nombre"')
      console.error('   git config --global user.email "tu-email@ejemplo.com"')
      return false
    }

    this.checkGitHubConnection()

    console.log('')
    console.log('📁 Creando archivos de configuración...')

    // Crear archivos
    this.createConfigFile()
    this.createStartScript()
    this.createWindowsScript()
    this.createDocumentation()

    console.log('')
    console.log('✅ CONFIGURACIÓN COMPLETADA')
    console.log('==========================')
    console.log('')
    console.log('🚀 Para iniciar el commit automático:')
    console.log('')
    console.log('   Windows:')
    console.log('   scripts/start-auto-commit.bat')
    console.log('')
    console.log('   Linux/Mac:')
    console.log('   bash scripts/start-auto-commit.sh')
    console.log('')
    console.log('   Con Node.js:')
    console.log('   node scripts/auto-commit.js')
    console.log('')
    console.log('📚 Documentación: scripts/README-auto-commit.md')
    console.log('⚙️ Configuración: scripts/auto-commit-config.json')
    console.log('')

    return true
  }
}

// Ejecutar configuración
const setup = new AutoCommitSetup()
setup.setup().catch(console.error)
