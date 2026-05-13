# 🎓 EventosUni - Gestor de Eventos Universitarios

Una plataforma moderna y completa para la gestión de eventos en tu universidad. Diseñada para estudiantes, organizadores y administradores.

## ✨ Características

### 👥 Roles de Usuario
- **Administrador**: Gestión completa del sistema
- **Organizador**: Crear y gestionar sus propios eventos
- **Estudiante**: Registrarse en eventos y participar

### 📅 Gestión de Eventos
- Crear, editar y eliminar eventos
- Categorizar eventos (Tecnología, Profesional, Desarrollo, Deportes, Cultura)
- Establecer capacidad máxima de asistentes
- Sistema de registros con confirmación
- Historial de eventos

### 🔐 Autenticación
- Registro de nuevos usuarios
- Login seguro
- Persistencia de sesión
- Protección de rutas según rol

### 📊 Dashboards Personalizados
- **Estudiantes**: Ver eventos registrados, historial de asistencia
- **Organizadores**: Estadísticas de sus eventos, gestión de registros
- **Administradores**: Panel de control completo

### 🎨 Interfaz Moderna
- Diseño responsive con Tailwind CSS
- Tema oscuro/claro
- Componentes reutilizables
- Animaciones suaves

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+ 
- npm o yarn
- PostgreSQL (opcional para desarrollo)

### Instalación

```bash
# Clonar el repositorio
git clone <url-repo>
cd web-de-gestion-de-eventos-universitarios

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar base de datos (Prisma)
npx prisma migrate dev

# Iniciar servidor de desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 📑 Estructura del Proyecto

```
app/
├── (auth)/                 # Páginas de autenticación
│   ├── login/
│   └── registro/
├── api/                    # API routes
│   └── auth/
│       ├── login/route.ts
│       └── registro/route.ts
├── components/             # Componentes reutilizables
│   ├── Navbar.tsx
│   ├── EventCard.tsx
│   ├── EventStats.tsx
│   └── Modal.tsx
├── lib/                    # Utilidades
│   ├── auth.ts            # Funciones de autenticación
│   └── utils.ts           # Funciones auxiliares
├── eventos/               # Página de eventos
├── crear-evento/          # Crear evento
├── dashboard/             # Dashboard
└── page.tsx               # Página principal

prisma/
├── schema.prisma          # Schema de base de datos
└── migrations/            # Migraciones
```

## 🔐 Credenciales de Prueba

### Administrador
- **Email**: admin@uni.edu
- **Contraseña**: password123

### Organizador
- **Email**: carlos@uni.edu
- **Contraseña**: password123

O crea tu propia cuenta durante el registro.

## 📱 Rutas Disponibles

### Públicas
- `/` - Página principal
- `/login` - Iniciar sesión
- `/registro` - Crear cuenta
- `/eventos` - Listar todos los eventos

### Protegidas
- `/dashboard` - Dashboard personal
- `/crear-evento` - Crear nuevo evento (solo organizadores)
- `/perfil` - Perfil del usuario

## 🎨 Diseño

- **Color Scheme**: Azules y púrpuras con fondo oscuro (Slate)
- **Tipografía**: Sistema de fuentes Geist
- **Componentes**: Card-based design con hover effects
- **Responsive**: Mobile-first, adaptable a tablets y desktops

## 🔧 Tecnologías Utilizadas

- **Frontend**: React 19, Next.js 16, TypeScript
- **Estilos**: Tailwind CSS 4
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: JWT (JSON Web Tokens)
- **Herramientas**: ESLint, TypeScript

## 📊 Modelo de Datos

### Usuarios
```prisma
- id, nombre, apellido, email, password
- rol (ADMINISTRADOR, ORGANIZADOR, ESTUDIANTE)
- carrera, matricula, tel, fotoPerfil
```

### Eventos
```prisma
- id, titulo, descripcion, slug
- fecha, fechaFin, ubicacion
- capacidad, asistentes, categoria
- organizador, estado (BORRADOR, PUBLICADO, FINALIZADO)
- requiereAprobacion, requiereDocumento, requiereEncuesta
```

### Registros
```prisma
- usuarioId, eventoId
- estado (REGISTRADO, ASISTIO, NO_ASISTIO)
- fechaRegistro, fechaConfirmacion
```

## 🚀 Próximos Pasos / Mejoras

- [ ] Integración con BD PostgreSQL real
- [ ] Sistema de notificaciones por email
- [ ] Exportar reportes (PDF, Excel)
- [ ] Sistema de pagos/entradas
- [ ] Búsqueda avanzada y filtros personalizados
- [ ] Integración con Google Calendar
- [ ] Chat y comentarios en vivo
- [ ] Sistema de certificados
- [ ] Análisis de datos y gráficos avanzados

## 📄 Licencia

Proyecto educativo. Todos los derechos reservados © 2026

---

**Última actualización**: Mayo 2026
**Versión**: 0.1.0
**Estado**: En desarrollo
