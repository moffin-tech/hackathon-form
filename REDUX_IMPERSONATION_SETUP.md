# Sistema de Impersonación con Redux

Este sistema permite que los usuarios de Customer Success inicien sesión como otros usuarios (clientes) para crear formularios en su nombre, utilizando Redux para el manejo del estado.

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Asegúrate de tener configurada tu conexión a la API de Moffin en las variables de entorno.

## Uso

### Login con Impersonación (Customer Success)

1. Ve a `/admin/login`
2. Ingresa las credenciales de Customer Success:
   - Email: `tu-email@moffin.com`
   - Contraseña: `tu-password`
3. En el campo "Iniciar sesión como", ingresa el email del cliente:
   - Email: `cliente@empresa.com`
4. Haz clic en "Iniciar Sesión"

### Funcionalidades

- **Redux State Management**: El estado de autenticación se maneja con Redux
- **API Integration**: Se conecta con la API de Moffin para la autenticación
- **Impersonation Support**: Los usuarios de Customer Success pueden impersonar clientes
- **Token Management**: Los tokens se almacenan en localStorage
- **Error Handling**: Manejo robusto de errores de autenticación

## Estructura de Archivos

- `src/redux/store.ts` - Configuración del store de Redux
- `src/redux/hooks.ts` - Hooks tipados para Redux
- `src/redux/features/authenticationSlice.ts` - Slice de autenticación con Redux Toolkit
- `src/components/providers/ReduxProvider.tsx` - Provider de Redux
- `src/app/admin/login/page.tsx` - Página de login con Redux
- `src/hooks/useImpersonation.ts` - Hook personalizado para impersonación
- `src/app/admin/dashboard/page.tsx` - Dashboard con Redux

## API Endpoints

El sistema se conecta con la API de Moffin:

- `POST /v1/auth` - Login normal
- `POST /v1/auth/other` - Login con impersonación
- `GET /v1/user/info` - Obtener información del usuario
- `POST /v1/auth/logout` - Cerrar sesión

## Flujo de Impersonación

1. **Login Inicial**: El usuario de Customer Success se autentica normalmente
2. **Impersonación**: Se envía una petición a `/v1/auth/other` con:
   - `email`: Email del usuario a impersonar
   - `password`: Contraseña del usuario a impersonar
   - `user`: Email del usuario de Customer Success
3. **Token Storage**: El token se almacena en localStorage
4. **State Update**: Redux actualiza el estado con la información del usuario impersonado
5. **Dashboard**: El dashboard muestra los formularios del usuario impersonado

## Seguridad

- Los tokens se almacenan de forma segura en localStorage
- La API valida las credenciales antes de permitir la impersonación
- Solo usuarios autorizados pueden usar la funcionalidad de impersonación
- El estado de autenticación se mantiene sincronizado con Redux

## Desarrollo

### Agregar nuevas acciones de Redux

1. Agrega la acción en `authenticationSlice.ts`
2. Actualiza los reducers correspondientes
3. Usa la acción en tus componentes con `useAppDispatch`

### Manejar errores

Los errores se manejan automáticamente en los reducers de Redux. Puedes acceder al estado de error con:

```tsx
const { error } = useAppSelector((store) => store.authentication);
```

### Persistir estado

El estado se persiste automáticamente a través de localStorage para el token de autenticación.
