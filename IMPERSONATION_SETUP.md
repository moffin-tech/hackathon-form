# Sistema de Impersonación de Usuarios

Este sistema permite que los usuarios de Customer Success inicien sesión como otros usuarios (clientes) para crear formularios en su nombre.

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Crear usuarios de ejemplo

```bash
npm run create-users
```

Esto creará:

- **Customer Success User**: `customer.success@moffin.com` / `password123`
- **Cliente User**: `cliente@empresa.com` / `password123`

### 3. Configurar variables de entorno

Asegúrate de tener configurada tu conexión a MongoDB en las variables de entorno.

## Uso

### Login Normal

1. Ve a `/admin/login`
2. Ingresa tu email y contraseña
3. Haz clic en "Iniciar Sesión"

### Login con Impersonación (Customer Success)

1. Ve a `/admin/login`
2. Ingresa las credenciales de Customer Success:
   - Email: `customer.success@moffin.com`
   - Contraseña: `password123`
3. En el campo "Iniciar sesión como", ingresa el email del cliente:
   - Email: `cliente@empresa.com`
4. Haz clic en "Iniciar Sesión"

### Funcionalidades

- **Banner de Impersonación**: Cuando estés impersonando a un usuario, verás un banner amarillo en la parte superior del dashboard
- **Formularios**: Los formularios creados se asociarán al usuario impersonado, no al usuario de Customer Success
- **Salir de Impersonación**: Usa el botón "Salir" en el banner para volver a tu cuenta original

## Roles de Usuario

- **admin**: Acceso completo al sistema
- **user**: Usuario normal, puede crear formularios
- **customer_success**: Puede impersonar a otros usuarios

## Seguridad

- Solo los usuarios con rol `customer_success` pueden usar la funcionalidad de impersonación
- La información de impersonación se almacena en la sesión JWT
- El sistema registra quién está impersonando a quién para auditoría

## Estructura de Archivos

- `src/lib/auth.ts` - Configuración de NextAuth con soporte para impersonación
- `src/types/auth.ts` - Tipos TypeScript para impersonación
- `src/hooks/useImpersonation.ts` - Hook personalizado para manejar impersonación
- `src/components/admin/ImpersonationBanner.tsx` - Componente del banner de impersonación
- `src/app/admin/login/page.tsx` - Página de login con campo de impersonación
- `src/app/api/forms/route.ts` - API que respeta el usuario efectivo (real o impersonado)
