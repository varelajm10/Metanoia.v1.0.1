# Metanoia v1.0.1 - Guía para Windows

## 🚀 Inicio Rápido en Windows

### Opción 1: Usando cross-env (Recomendado)
```bash
npm run dev
```

### Opción 2: Usando scripts específicos de Windows
```bash
npm run dev:windows
```

### Opción 3: Usando el script batch
```bash
npm run dev:win
```

## 🔧 Solución de Problemas

### Error: "NODE_OPTIONS no se reconoce como un comando"

Este error ocurre porque Windows PowerShell no reconoce la sintaxis de variables de entorno de Unix.

**Soluciones:**

1. **Usar cross-env (Ya instalado):**
   ```bash
   npm run dev
   ```

2. **Usar scripts específicos de Windows:**
   ```bash
   npm run dev:windows
   ```

3. **Configurar manualmente en PowerShell:**
   ```powershell
   $env:NODE_OPTIONS="--max-old-space-size=4096"
   npm run dev
   ```

4. **Usar Command Prompt (cmd) en lugar de PowerShell:**
   ```cmd
   set NODE_OPTIONS=--max-old-space-size=4096
   npm run dev
   ```

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia el servidor de desarrollo (cross-env) |
| `npm run dev:windows` | Inicia el servidor de desarrollo (Windows) |
| `npm run dev:win` | Inicia usando script batch |
| `npm run build` | Construye la aplicación para producción |
| `npm run build:windows` | Construye para producción (Windows) |
| `npm run start` | Inicia el servidor de producción |
| `npm run start:windows` | Inicia producción (Windows) |

## 🌐 Acceso a la Aplicación

Una vez iniciado el servidor, la aplicación estará disponible en:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api

## 🔐 Credenciales de Prueba

### Super Administrador Metanoia
- **Email**: admin@metanoia.click
- **Contraseña**: metanoia123

### Administrador Cliente (Ariel)
- **Email**: admin@ariel.com
- **Contraseña**: ariel123

### Usuario Cliente (Ariel)
- **Email**: usuario@ariel.com
- **Contraseña**: usuario123

## 🎯 Funcionalidad Implementada

### ✅ Crear Nuevo Cliente (Tenant)
1. Accede como Super-Admin a `/dashboard/admin/tenants`
2. Haz clic en "Agregar Nuevo Cliente"
3. Completa el formulario:
   - Nombre de la empresa
   - Nombre del administrador
   - Apellido del administrador
   - Email del administrador
4. El sistema creará automáticamente:
   - El tenant (empresa cliente)
   - El usuario administrador
   - Una contraseña temporal (se muestra en la consola)

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, Prisma ORM
- **Base de Datos**: PostgreSQL
- **Autenticación**: JWT, Bcrypt
- **Validación**: Zod, React Hook Form
- **UI**: shadcn/ui, Radix UI

## 📞 Soporte

Si encuentras problemas con la configuración en Windows, puedes:

1. Usar el script batch: `npm run dev:win`
2. Usar Command Prompt en lugar de PowerShell
3. Verificar que Node.js esté en el PATH del sistema
4. Reinstalar las dependencias: `npm install`

---

**Metanoia v1.0.1** - Sistema ERP SaaS Modular

