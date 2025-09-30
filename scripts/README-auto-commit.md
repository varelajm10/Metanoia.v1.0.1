# 🤖 Commit Automático - Metanoia V1.0.2

## 📋 Descripción

Este sistema de commit automático mantiene tu código respaldado constantemente haciendo commits cada 30 minutos.

## 🚀 Uso

### Iniciar Commit Automático

#### En Windows:

```bash
scripts/start-auto-commit.bat
```

#### En Linux/Mac:

```bash
bash scripts/start-auto-commit.sh
```

#### Con Node.js (recomendado):

```bash
node scripts/auto-commit.js
```

### Detener Commit Automático

Presiona `Ctrl+C` para detener el proceso.

## ⚙️ Configuración

El archivo `scripts/auto-commit-config.json` contiene la configuración:

- `interval`: Intervalo en minutos (default: 30)
- `enabled`: Habilitar/deshabilitar (default: true)
- `pushToGitHub`: Hacer push automático (default: true)
- `logLevel`: Nivel de logging (default: INFO)

## 📊 Características

- ✅ **Commit automático** cada 30 minutos
- ✅ **Solo commitea si hay cambios**
- ✅ **Mensajes descriptivos** con timestamp
- ✅ **Push automático** a GitHub
- ✅ **Logs detallados** de actividad
- ✅ **Manejo de errores** robusto
- ✅ **Estadísticas** de commits

## 📝 Logs

Los logs se guardan en `scripts/auto-commit.log` con información detallada:

- Timestamp de cada operación
- Número de archivos modificados
- Estado de push a GitHub
- Errores y advertencias

## 🔧 Solución de Problemas

### Error: "Git no configurado"

```bash
git config --global user.name "Tu Nombre"
git config --global user.email "tu-email@ejemplo.com"
```

### Error: "No hay repositorio Git"

```bash
git init
git remote add origin https://github.com/tu-usuario/Metanoia.v1.0.1.git
```

### Error: "Push falló"

- Verifica tu conexión a internet
- Asegúrate de tener permisos de escritura en el repositorio
- El commit se guarda localmente y se sincronizará en el próximo push exitoso

## 📞 Soporte

Si encuentras problemas:

1. Revisa los logs en `scripts/auto-commit.log`
2. Verifica la configuración de Git
3. Asegúrate de tener conexión a internet
4. Contacta al desarrollador si persisten los problemas

---

**© 2024 Metanoia.click - Sistema ERP Modular SaaS**
