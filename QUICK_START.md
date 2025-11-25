# 🚀 Guía Rápida - IronFit Frontend

## ✅ Lo que se ha implementado

Se ha creado un frontend completo con **3 roles diferentes**:

### 👨‍💼 ADMINISTRADOR (AUDITOR)

- Dashboard con estadísticas
- Gestión de clientes (listar, crear, editar, desactivar)
- Reportes de asistencia con filtros

### 🏋️ ENTRENADOR (TRAINER)

- Dashboard del entrenador
- Lista de clientes asignados
- Planes de entrenamiento
- Rutinas creadas

### 👤 CLIENTE (CLIENT)

- Dashboard personal
- Perfil (editar email y teléfono)
- Ver plan de entrenamiento activo
- Ver rutinas asignadas
- Historial de evaluaciones físicas

## 🎯 Cómo ejecutar

### 1. Asegúrate de que el backend esté corriendo

```bash
# El backend debe estar en http://localhost:8080
```

### 2. Instalar dependencias (si no lo has hecho)

```bash
npm install
```

### 3. Ejecutar la aplicación

```bash
npm start
```

La aplicación estará disponible en: **http://localhost:4200**

## 🔐 Flujo de Uso

### Login

1. Abre http://localhost:4200
2. Te redirige automáticamente a `/login`
3. Ingresa credenciales del backend
4. Según tu rol, serás redirigido a:
   - AUDITOR → `/admin/dashboard`
   - TRAINER → `/trainer/dashboard`
   - CLIENT → `/client/dashboard`

### Navegación

- **Menú lateral**: Opciones específicas de tu rol
- **Header**: Muestra tu usuario y botón de "Cerrar Sesión"
- Todas las rutas están protegidas por autenticación y rol

## 📁 Estructura de Archivos Creados

```
src/app/
├── shared/
│   ├── interfaces/         # ✅ Tipos TypeScript completos
│   │   ├── api-response.interface.ts
│   │   ├── user.interface.ts
│   │   ├── training.interface.ts
│   │   ├── evaluation.interface.ts
│   │   ├── attendance.interface.ts
│   │   └── report.interface.ts
│   └── services/           # ✅ Servicios HTTP
│       ├── api.service.ts
│       ├── user.service.ts
│       ├── training.service.ts
│       ├── evaluation.service.ts
│       ├── attendance.service.ts
│       └── report.service.ts
├── features/
│   ├── admin/              # ✅ Componentes Admin
│   │   ├── admin-dashboard/
│   │   ├── user-management/
│   │   └── reports/
│   ├── trainers/           # ✅ Componentes Trainer
│   │   ├── trainer-dashboard/
│   │   ├── trainer-clients/
│   │   ├── trainer-trainment-plans/
│   │   └── trainer-routines/
│   └── clients/            # ✅ Componentes Client
│       ├── client-dashboard/
│       ├── client-profile/
│       ├── client-trainment-plan/
│       ├── client-routines/
│       └── client-progress/
└── environments/           # ✅ Configuración
    └── environment.ts
```

## 🛠️ Archivos Modificados

- ✅ `app.routes.ts` - Rutas completas con guards
- ✅ `login/login.ts` - Login con redirección por rol
- ✅ `sidebar.ts` - Menú dinámico según rol
- ✅ `header.ts` - Header con logout
- ✅ `session-handler.service.ts` - Gestión de sesión mejorada
- ✅ `login-user.service.ts` - Tipado correcto
- ✅ `logout-user.service.ts` - Tipado correcto

## 🎨 Características UI

- ✅ Diseño responsivo con Tailwind CSS
- ✅ Sidebar colapsable
- ✅ Estados de carga (spinners)
- ✅ Mensajes de error y éxito
- ✅ Formularios con validación
- ✅ Tablas con datos dinámicos

## 🔄 API Integration

Todos los servicios están configurados para:

- Usar `withCredentials: true` (cookies HttpOnly)
- URL base: `http://localhost:8080`
- Manejo de errores
- Tipado completo de respuestas

## 📝 Próximos Pasos

Si necesitas añadir más funcionalidades:

### Para Admin:

- Gestión de entrenadores
- Catálogos (ejercicios, categorías)
- Más reportes

### Para Trainer:

- Crear/editar planes
- Crear/editar rutinas
- Registrar evaluaciones

### Para Client:

- Registrar asistencia
- Marcar ejercicios completados

## ❓ Troubleshooting

### Error de compilación

```bash
# Limpiar y reinstalar
rm -rf node_modules
npm install
```

### Backend no conecta

- Verifica que el backend esté en `http://localhost:8080`
- Revisa `src/environments/environment.ts` si usas otra URL

### Login no funciona

- Verifica credenciales en el backend
- Abre DevTools → Network para ver la respuesta del API

## 📚 Documentación

- `IMPLEMENTACION.md` - Documentación técnica completa
- `.github/API_DOCUMENTATION.md` - Documentación de la API
- `.github/copilot-instructions.md` - Guías de Angular

---

**¡Listo para usar! 🎉**
