# Moffin Custom Forms - Hackathon Solution 🏆

Una plataforma completa de formularios dinámicos e inteligentes que implementa todas las ideas propuestas para mejorar los formularios de Moffin, incluyendo un **sistema de administración completo** para crear y gestionar formularios.

## 🚀 Características Implementadas

### ✅ Todas las Ideas Implementadas

1. **Multi-sesión**: Los usuarios pueden guardar su progreso y continuar en cualquier momento
2. **Formularios Configurables**: Los usuarios pueden configurar sus formularios con diferentes opciones
3. **Formularios Dinámicos/Condicionales**: Campos que aparecen según las respuestas del usuario
4. **Rápido e Inteligente**: Autocompletado con API de Moffin, validaciones automáticas, guardado automático
5. **Omnicanal**: Funciona perfectamente en web y móvil
6. **Formularios Editables**: Los usuarios pueden modificar sus respuestas
7. **Eventos y Webhooks**: Sistema de eventos para evaluaciones y validaciones

### 🎯 Formularios de Ejemplo

- **Onboarding Financiero**: Persona Física vs Persona Moral con validaciones condicionales
- **Onboarding de Empleados**: Contratos a prueba vs indefinidos con documentos específicos
- **Onboarding de Proveedores**: Servicios vs productos con validaciones fiscales

## 🛠️ Tecnologías Utilizadas

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Formularios**: React Hook Form, Zod
- **Base de Datos**: MongoDB con Next.js API Routes
- **Autenticación**: NextAuth.js con MongoDB Adapter
- **API Integration**: Moffin Solutions API
- **State Management**: Custom hooks con localStorage
- **Validaciones**: RFC, CURP, Email, Teléfono
- **Notificaciones**: React Hot Toast

## 🚀 Instalación y Configuración

## 🌐 Deploy en Netlify

### Requisitos Previos

- **Node.js**: Versión 18.x o 20.x (Netlify no soporta Node.js 22+)
- **MongoDB**: Cluster de MongoDB Atlas o instancia local

### Variables de Entorno Requeridas

Para hacer deploy en Netlify, necesitas configurar estas variables de entorno en tu dashboard de Netlify:

1. Ve a **Site settings** → **Environment variables**
2. Agrega las siguientes variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon-forms?retryWrites=true&w=majority
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://tu-sitio.netlify.app
```

### Configuración Automática

El proyecto incluye:
- **`.nvmrc`**: Especifica Node.js 20.18.0
- **`netlify.toml`**: Configuración automática para Netlify
- **`package.json`**: Engines especificados para compatibilidad

### Pasos para Deploy

1. Conecta tu repositorio de GitHub a Netlify
2. Configura las variables de entorno
3. Netlify detectará automáticamente la configuración
4. El build se ejecutará con Node.js 20.18.0
5. ¡Tu aplicación estará lista!

## 🚀 Instalación y Configuración Local

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` con las siguientes configuraciones:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hackathon-forms?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Moffin API Configuration (opcional)
MOFFIN_API_URL=https://solutions-api.moffin.mx/api/v1

# Moffin Solutions API Configuration
NEXT_PUBLIC_MOFFIN_CLIENT_ID=your_client_id_here
NEXT_PUBLIC_MOFFIN_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_MOFFIN_BASE_URL=https://solutions-api.moffin.mx/api
```

### 3. Configurar MongoDB

Instala MongoDB localmente o usa MongoDB Atlas:

```bash
# Con MongoDB local
brew install mongodb/brew/mongodb-community
brew services start mongodb/brew/mongodb-community

# O usa MongoDB Atlas (recomendado para producción)
# Actualiza MONGODB_URI con tu connection string
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🎯 Funcionalidades de la Plataforma

### 👥 Panel de Administración

- **Registro y Login**: Sistema completo de autenticación
- **Dashboard**: Vista general de formularios y estadísticas
- **Builder de Formularios**: Constructor visual drag & drop
- **Gestión de Formularios**: Crear, editar, eliminar y publicar
- **Configuraciones Avanzadas**: Temas, permisos, validaciones

### 📝 Constructor de Formularios

- **Campos Dinámicos**: Texto, email, teléfono, archivos, fechas, etc.
- **Secciones Condicionales**: Campos que aparecen según respuestas
- **Validaciones Automáticas**: RFC, CURP, email, teléfono mexicano
- **Autocompletado Inteligente**: Integración con API de Moffin
- **Configuraciones**: Multi-sesión, guardado automático, progreso visual

### 🔒 Sistema de Permisos

- **Formularios Públicos**: Accesibles sin autenticación
- **Formularios Privados**: Solo para usuarios autorizados
- **Gestión de Accesos**: Control granular de permisos

## 📱 Características Principales

### Multi-sesión

- Guardado automático del progreso
- Continuación desde donde se quedó
- Múltiples sesiones por usuario/organización

### Formularios Dinámicos

- Campos condicionales basados en respuestas anteriores
- Secciones que aparecen/desaparecen dinámicamente
- Validaciones en tiempo real

### Autocompletado Inteligente

- Integración con API de Moffin para RFC/CURP
- Validación automática de datos fiscales
- Sugerencias en tiempo real

### Validaciones Completas

- RFC mexicano
- CURP
- Email
- Teléfono mexicano
- Archivos (PDF, imágenes)
- Números y fechas

### Mobile-First Design

- Diseño completamente responsive
- Optimizado para dispositivos móviles
- Experiencia táctil nativa

## 🎨 Interfaz de Usuario

### Página Principal

- Selección de formularios disponibles
- Indicadores de características implementadas
- Estado de conexión con API de Moffin

### Formulario Dinámico

- Barra de progreso visual
- Navegación entre secciones
- Indicadores de campos obligatorios
- Validaciones en tiempo real

### Resultados

- Confirmación de envío
- ID de seguimiento
- Opción de completar otro formulario

## 🔧 API de Moffin

La aplicación se integra con los siguientes endpoints de la API de Moffin:

### Consultas de Datos

- `/oauth/token` - Autenticación
- `/query/rfc-data` - Datos de RFC
- `/query/curp-data` - Datos de CURP
- `/query/rfc-calculator` - Calculadora de RFC
- `/query/sat/profile` - Perfil SAT
- `/query/sat/csf` - Constancia de Situación Fiscal

### Gestión de Formularios

- `/formconfigs` - Crear configuraciones de formularios
- **Endpoint**: `POST https://staging.moffin.mx/api/v1/formconfigs`
- **Funcionalidad**: Crear formularios directamente en la plataforma de Moffin
- **Configuración**: Por organización con credenciales específicas

### Gestión de Organizaciones

- **Configuración por organización**: Cada organización tiene sus propias credenciales de API
- **Selector de organización**: Los administradores pueden cambiar entre organizaciones
- **Credenciales seguras**: Almacenamiento seguro de API keys en MongoDB

## 📊 Estructura del Proyecto

```
src/
├── app/                 # Páginas de Next.js
├── components/          # Componentes React
│   ├── forms/          # Componentes de formularios
│   └── ui/             # Componentes de UI base
├── data/               # Datos y configuraciones
├── hooks/              # Hooks personalizados
├── lib/                # Utilidades
├── services/           # Servicios de API
└── types/              # Tipos TypeScript
```

## 🎯 Casos de Uso Implementados

### Onboarding Financiero

1. **Selección de tipo de cliente** (Persona Física/Moral)
2. **Campos específicos** según el tipo seleccionado
3. **Validación de servicio** (Consulta vs Crédito)
4. **Campos adicionales** para solicitudes de crédito
5. **Consentimiento y canales** de contacto

### Onboarding de Empleados

1. **Datos personales** básicos
2. **Tipo de contrato** (A prueba/Indefinido)
3. **Documentos específicos** según el tipo
4. **Selección de beneficios**

### Onboarding de Proveedores

1. **Datos fiscales** básicos
2. **Tipo de servicio** (Recurrente/Productos)
3. **Documentos específicos** según el tipo
4. **Validaciones de cumplimiento**

## 🔄 Flujo de Datos

1. **Inicialización**: Carga de configuración del formulario
2. **Sesión**: Creación o recuperación de sesión
3. **Progreso**: Guardado automático de datos
4. **Validación**: Validación en tiempo real
5. **Autocompletado**: Consulta a API de Moffin
6. **Envío**: Finalización y almacenamiento

## 🚀 Próximos Pasos

Para una implementación completa en producción, se recomienda:

1. **Backend**: Implementar API REST para persistencia
2. **Base de Datos**: PostgreSQL o MongoDB para almacenamiento
3. **Autenticación**: Sistema de usuarios y permisos
4. **Webhooks**: Sistema de notificaciones
5. **Analytics**: Métricas de uso y conversión
6. **Testing**: Suite de pruebas automatizadas

## 📄 Licencia

Este proyecto fue desarrollado para el Hackathon Moffin Custom Forms 2025.

---

**Desarrollado por**: Alan Cardozo y Medin Barreira
**Fecha**: Septiembre 2025
