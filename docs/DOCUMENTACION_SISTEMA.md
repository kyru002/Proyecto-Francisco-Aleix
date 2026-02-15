# 📚 Documentación Completa del Sistema - SupportDesk

## 📋 Índice
1. [Introducción](#introducción)
2. [Arquitectura del Sistema](#arquitectura-del-sistema)
3. [Stack Tecnológico](#stack-tecnológico)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Backend - API REST](#backend---api-rest)
6. [Frontend - Vue.js](#frontend---vuejs)
7. [Base de Datos - MongoDB](#base-de-datos---mongodb)
8. [WebRTC y Socket.io](#webrtc-y-socketio)
9. [Sistema de Autenticación](#sistema-de-autenticación)
10. [Flujos de Trabajo](#flujos-de-trabajo)
11. [Guía de Desarrollo](#guía-de-desarrollo)

---

## 🎯 Introducción

**SupportDesk** es un sistema integral de gestión de tickets de soporte técnico con las siguientes características principales:

- ✅ **Gestión de Tickets**: Creación, asignación y seguimiento de tickets de soporte
- 👥 **Gestión de Usuarios**: Administradores, técnicos y clientes con permisos diferenciados
- 📄 **Albaranes**: Generación y seguimiento de albaranes de trabajo
- 📹 **Videollamadas**: Sistema de videoconferencia integrado con WebRTC
- 💬 **Chat en tiempo real**: Mensajería instantánea por ticket
- 🔒 **Control de acceso**: Sistema de roles y permisos basado en JWT

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Browser)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Vue 3 App   │  │  Socket.io   │  │   WebRTC     │  │
│  │  (Vite)      │  │   Client     │  │   Peer       │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
└─────────┼──────────────────┼──────────────────┼─────────┘
          │ HTTP/REST        │ WebSocket        │ P2P
          ▼                  ▼                  ▼
┌─────────────────────────────────────────────────────────┐
│                    SERVIDOR (Node.js)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Express.js  │  │  Socket.io   │  │   JWT Auth   │  │
│  │   REST API   │  │   Server     │  │  Middleware  │  │
│  └──────┬───────┘  └──────────────┘  └──────────────┘  │
│         │                                                │
│         ▼                                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │           Mongoose ORM                           │  │
│  └──────────────────────┬───────────────────────────┘  │
└──────────────────────────┼──────────────────────────────┘
                           ▼
                  ┌────────────────┐
                  │   MongoDB      │
                  │   Database     │
                  └────────────────┘
```

### Comunicación entre componentes:

1. **HTTP/REST**: APIs RESTful para operaciones CRUD
2. **WebSocket**: Socket.io para eventos en tiempo real (chat, notificaciones)
3. **WebRTC**: Comunicación P2P para videollamadas (con señalización via Socket.io)

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js 4.x
- **Base de Datos**: MongoDB + Mongoose
- **WebSockets**: Socket.io 4.x
- **Autenticación**: JWT (jsonwebtoken) + bcrypt
- **Variables de entorno**: dotenv

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite 5.x
- **Estado**: Pinia
- **Routing**: Vue Router 4.x
- **HTTP Client**: Axios
- **UI**: Tailwind CSS
- **Iconos**: Lucide Vue Next
- **WebRTC**: Native Web APIs
- **WebSocket Client**: Socket.io-client

---

## 📁 Estructura del Proyecto

```
Proyecto-Francisco-Aleix/
│
├── backend/                      # Servidor Node.js/Express
│   ├── server.js                # Punto de entrada del servidor
│   ├── database.js              # Configuración de MongoDB
│   ├── .env                     # Variables de entorno
│   ├── package.json             # Dependencias backend
│   │
│   ├── models/                  # Modelos de Mongoose
│   │   ├── Ticket.js           # Schema de tickets
│   │   ├── Cliente.js          # Schema de empresas cliente
│   │   ├── Trabajador.js       # Schema de usuarios (admin/técnico/cliente)
│   │   ├── Albaran.js          # Schema de albaranes
│   │   └── CallLog.js          # Schema de registro de llamadas
│   │
│   ├── routes/                  # Rutas de la API REST
│   │   ├── tickets.js          # CRUD de tickets
│   │   ├── trabajadores.js     # Gestión de usuarios
│   │   ├── clientes.js         # Gestión de empresas
│   │   ├── albaranes.js        # Gestión de albaranes
│   │   └── callLogs.js         # Registro de videollamadas
│   │
│   ├── middleware/              # Middleware personalizado
│   │   ├── auth.js             # Verificación de JWT
│   │   └── checkRole.js        # Verificación de roles
│   │
│   └── utils/                   # Utilidades
│       ├── seeder.js           # Seed de datos iniciales
│       └── create_admin.js     # Script para crear admin
│
├── frontend/                    # Aplicación Vue.js
│   ├── index.html              # HTML principal
│   ├── vite.config.js          # Configuración de Vite
│   ├── package.json            # Dependencias frontend
│   │
│   └── src/
│       ├── main.js             # Punto de entrada Vue
│       ├── App.vue             # Componente raíz
│       │
│       ├── assets/             # Recursos estáticos
│       │   └── main.css        # Estilos globales (Tailwind)
│       │
│       ├── components/         # Componentes reutilizables
│       │   └── Sidebar.vue     # Barra lateral de navegación
│       │
│       ├── views/              # Vistas/Páginas
│       │   ├── Login.vue       # Página de login
│       │   ├── Register.vue    # Registro de empresas
│       │   ├── Dashboard.vue   # Panel principal (admin)
│       │   ├── Tickets.vue     # Listado de tickets
│       │   ├── TicketDetail.vue # Detalle de ticket + videollamadas
│       │   ├── Technicians.vue # Gestión de equipo técnico
│       │   ├── Clients.vue     # Gestión de clientes
│       │   ├── Albaranes.vue   # Gestión de albaranes
│       │   └── Profile.vue     # Perfil de usuario
│       │
│       ├── router/             # Configuración de rutas
│       │   └── index.js        # Definición de rutas + guards
│       │
│       ├── stores/             # Pinia stores
│       │   └── appStore.js     # Store principal de la aplicación
│       │
│       └── services/           # Servicios API
│           └── api.js          # Cliente Axios + servicios
│
├── package.json                 # Scripts npm raíz
└── README.md                   # Documentación básica
```

---

## 🔌 Backend - API REST

### 📡 Endpoints Principales

#### **🔐 Autenticación** (`/api/trabajadores/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | Login de usuario | ❌ |
| POST | `/auth/register-empresa` | Registro de nueva empresa | ❌ |

```javascript
// Ejemplo de login
POST /api/trabajadores/auth/login
Body: { email: "user@example.com", password: "123456" }
Response: { 
  token: "jwt_token_here",
  trabajador: { _id, nombre, email, role, empresa }
}
```

#### **🎫 Tickets** (`/api/tickets`)

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | Listar tickets | ✅ | Todos |
| GET | `/:id` | Obtener ticket | ✅ | Todos |
| POST | `/` | Crear ticket | ✅ | Todos |
| PUT | `/:id` | Actualizar ticket | ✅ | Admin/Técnico |
| DELETE | `/:id` | Eliminar ticket | ✅ | Admin |
| GET | `/:id/messages` | Mensajes del ticket | ✅ | Todos |
| POST | `/:id/messages` | Enviar mensaje | ✅ | Todos |

**Control de acceso:**
- **Clientes**: Solo ven tickets de su empresa
- **Técnicos**: Solo ven tickets de su empresa
- **Admin**: Ve todos los tickets

#### **👥 Trabajadores** (`/api/trabajadores`)

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | Listar trabajadores | ✅ | Admin/Cliente |
| GET | `/equipo` | Listar técnicos | ✅ | Admin/Técnico |
| GET | `/empresa/:id` | Trabajadores de empresa | ✅ | Admin/Cliente |
| GET | `/:id` | Obtener trabajador | ✅ | Todos |
| POST | `/` | Crear trabajador | ✅ | Admin/Cliente |
| PUT | `/:id` | Actualizar trabajador | ✅ | Admin/Propio |
| DELETE | `/:id` | Eliminar trabajador | ✅ | Admin |
| PATCH | `/:id/cambiar-password` | Cambiar contraseña | ✅ | Admin/Propio |

#### **🏢 Clientes/Empresas** (`/api/clientes`)

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | Listar clientes | ✅ | Admin |
| GET | `/:id` | Obtener cliente | ✅ | Admin |
| POST | `/` | Crear cliente | ✅ | Admin |
| PUT | `/:id` | Actualizar cliente | ✅ | Admin |
| DELETE | `/:id` | Eliminar cliente | ✅ | Admin |

#### **📄 Albaranes** (`/api/albaranes`)

| Método | Endpoint | Descripción | Auth | Roles |
|--------|----------|-------------|------|-------|
| GET | `/` | Listar albaranes | ✅ | Admin/Técnico/Cliente |
| GET | `/:id` | Obtener albarán | ✅ | Admin/Técnico/Cliente |
| GET | `/numero/siguiente` | Próximo número | ✅ | Admin/Técnico |
| GET | `/estado/:estado` | Por estado | ✅ | Admin/Técnico/Cliente |
| GET | `/cliente/:id` | Por cliente | ✅ | Admin/Técnico/Cliente |
| POST | `/` | Crear albarán | ✅ | Admin/Técnico |
| PUT | `/:id` | Actualizar albarán | ✅ | Admin/Técnico |
| PATCH | `/:id/estado` | Cambiar estado | ✅ | Admin/Técnico |
| PATCH | `/:id/entregar` | Marcar entregado | ✅ | Admin/Técnico |
| DELETE | `/:id` | Eliminar albarán | ✅ | Admin |

### 🔒 Middleware de Autenticación

**auth.js**: Verifica el token JWT en cada request protegido

```javascript
// Header requerido: Authorization: Bearer <token>
// Añade req.user con: { id, email, role, empresa }
```

**checkRole.js**: Valida que el usuario tenga uno de los roles permitidos

```javascript
// Uso: router.get('/ruta', auth, checkRole(['admin', 'tecnico']), handler)
```

### 🗄️ Modelos de Datos

#### **Ticket**
```javascript
{
  title: String,
  description: String,
  cliente: ObjectId (ref: Cliente),
  tecnico: ObjectId (ref: Trabajador),
  status: ["abierto", "en progreso", "cerrado"],
  priority: ["alta", "media", "baja"],
  startDate: Date,
  endDate: Date,
  messages: [{
    author: String,
    role: ["cliente", "tecnico", "admin"],
    content: String,
    createdAt: Date
  }]
}
```

#### **Trabajador** (Usuario)
```javascript
{
  nombre: String,
  email: String (unique),
  telefono: String,
  puesto: String,
  role: ["admin", "tecnico", "cliente"],
  empresa: ObjectId (ref: Cliente),
  password: String (hashed),
  contraseñaTemporal: Boolean,
  estado: ["activo", "inactivo", "suspendido"]
}
```

#### **Cliente** (Empresa)
```javascript
{
  nombreContacto: String,
  nombreEmpresa: String,
  email: String (unique),
  telefono: String,
  usuarioAsociado: ObjectId (ref: Trabajador),
  horasUsadas: Number
}
```

#### **Albaran**
```javascript
{
  numeroAlbaran: String (unique),
  cliente: ObjectId (ref: Cliente),
  tecnico: ObjectId (ref: Trabajador),
  ticket: ObjectId (ref: Ticket),
  estado: ["pendiente", "entregado", "devuelto", "cancelado"],
  fechaAlbaran: Date,
  fechaEntrega: Date,
  descripcion: String,
  lineas: [{
    concepto: String,
    cantidad: Number,
    precio: Number,
    importe: Number
  }],
  subtotal: Number,
  porcentajeIVA: Number,
  iva: Number,
  total: Number,
  notas: String,
  observaciones: String
}
```

---

## 🎨 Frontend - Vue.js

### 📦 Store (Pinia)

**appStore.js** - Store central de la aplicación:

```javascript
state: {
  tickets: [],
  tecnicos: [],
  clientes: [],
  albaranes: [],
  trabajadores: [],
  loading: false,
  currentUser: null  // Usuario autenticado
}

// Acciones principales
fetchAll()              // Carga todos los datos según rol
createTicket(data)      // Crea nuevo ticket
updateTicket(id, data)  // Actualiza ticket
deleteTicket(id)        // Elimina ticket
sendTicketMessage(id, msg) // Envía mensaje en ticket
login(user)             // Guarda usuario
logout()                // Cierra sesión
```

**Flujo de fetchAll():**
1. Determina el rol del usuario actual
2. Si es **cliente**: filtra datos por su empresa
3. Si es **admin/técnico**: obtiene todos los datos
4. Ejecuta requests en paralelo con `Promise.allSettled()`
5. Actualiza el state con los resultados exitosos

### 🛣️ Rutas y Navegación

**router/index.js**:

| Ruta | Componente | Auth | Roles Permitidos |
|------|-----------|------|------------------|
| `/login` | Login.vue | ❌ | Público |
| `/register` | Register.vue | ❌ | Público |
| `/dashboard` | Dashboard.vue | ✅ | Admin |
| `/tickets` | Tickets.vue | ✅ | Todos |
| `/tickets/:id` | TicketDetail.vue | ✅ | Todos |
| `/technicians` | Technicians.vue | ✅ | Admin |
| `/clients` | Clients.vue | ✅ | Admin |
| `/albaranes` | Albaranes.vue | ✅ | Admin, Técnico |
| `/profile` | Profile.vue | ✅ | Todos |

**Guard de autenticación:**
```javascript
router.beforeEach((to, from, next) => {
  const currentUser = localStorage.getItem('currentUser')
  
  if (to.meta.requiresAuth && !currentUser) {
    return next('/login')
  }
  
  if (to.meta.requiresRole) {
    // Verificar que el usuario tenga el rol requerido
    if (!to.meta.requiresRole.includes(currentUser.role)) {
      return next('/tickets')
    }
  }
  
  next()
})
```

### 🔌 Servicios API

**api.js** - Cliente Axios configurado:

```javascript
// Interceptor de Request: Añade token JWT
api.interceptors.request.use(config => {
  const user = JSON.parse(localStorage.getItem('currentUser'))
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
})

// Interceptor de Response: Maneja 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('currentUser')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

**Servicios disponibles:**
- `ticketsService`: CRUD de tickets + mensajes
- `trabajadoresService`: Gestión de usuarios + auth
- `clientesService`: CRUD de empresas
- `albaranesService`: Gestión de albaranes
- `callLogsService`: Registro de videollamadas

---

## 🗃️ Base de Datos - MongoDB

### Conexión

**database.js**:
```javascript
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/MyApp"
await mongoose.connect(MONGO_URI)
```

### Colecciones

| Colección | Modelo | Índices |
|-----------|--------|---------|
| `tickets` | Ticket | cliente, tecnico, status |
| `trabajadores` | Trabajador | email (unique) |
| `clientes` | Cliente | email (unique) |
| `albaranes` | Albaran | numeroAlbaran (unique), cliente |
| `calllogs` | CallLog | ticket, callerSocketId |

### Relaciones

```
Cliente (Empresa)
  └── 1:N → Trabajador (role: 'cliente')
  └── 1:N → Ticket
  └── 1:N → Albaran

Trabajador
  └── asignado a → N:N → Ticket (como técnico)
  └── crea → 1:N → Albaran

Ticket
  └── 1:N → CallLog (registro de llamadas)
  └── 1:1 → Albaran (opcional)
```

---

## 📹 WebRTC y Socket.io

### Eventos Socket.io

#### **Chat en Tiempo Real**

```javascript
// Cliente emite:
socket.emit('chat-message', { ticketId, message })

// Servidor retransmite:
socket.broadcast.to(`ticket-${ticketId}`).emit('new-chat-message', message)
```

#### **Sala de Ticket**

```javascript
// Unirse a sala:
socket.emit('join-ticket-room', ticketId, { name, role })

// Notificación de usuario:
socket.emit('user-joined', { userId, userName, userRole })
```

#### **Videollamadas**

**Flujo de llamada:**

1. **Iniciador** (`startCall()`):
   ```javascript
   socket.emit('call-started', { 
     callerSocketId, callerName, ticketId, callType 
   })
   socket.emit('incoming-call', { 
     ticketId, offer, callerName, callType 
   })
   ```

2. **Receptor** recibe `incoming-call` y puede:
   - **Aceptar** → `acceptCall()`:
     ```javascript
     socket.emit('call-accepted', { 
       callerSocketId, receiverSocketId, receiverName 
     })
     socket.emit('call-answer', { ticketId, answer, to })
     ```
   - **Rechazar** → `rejectCall()`:
     ```javascript
     socket.emit('reject-call', { to })
     ```

3. **ICE Candidates** (ambos):
   ```javascript
   peerConnection.onicecandidate = (event) => {
     if (event.candidate) {
       socket.emit('ice-candidate', { 
         ticketId, candidate: event.candidate, to 
       })
     }
   }
   ```

4. **Finalizar**:
   ```javascript
   socket.emit('call-ended', { ticketId, duration, screenShared })
   socket.emit('end-call', { ticketId, to })
   ```

#### **Screen Sharing**

```javascript
// Inicio de compartir pantalla:
socket.emit('screen-share-started', { ticketId, from })

// Detener compartir pantalla:
socket.emit('screen-share-stopped', { ticketId, from })
```

### WebRTC Peer Connection

**Configuración STUN:**
```javascript
const configuration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
}
```

**Tracks de Media:**
- **Videollamada**: audio + video
- **Llamada de voz**: solo audio
- **Screen sharing**: DisplayMedia (adicional)

---

## 🔐 Sistema de Autenticación

### Roles y Permisos

| Rol | Acceso | Restricciones |
|-----|--------|---------------|
| **admin** | - Todas las vistas<br>- CRUD completo<br>- Gestión de usuarios<br>- Dashboard | Ninguna |
| **tecnico** | - Tickets (todos)<br>- Albaranes<br>- Llamadas | No puede gestionar clientes/usuarios |
| **cliente** | - Sus tickets<br>- Sus albaranes<br>- Sus trabajadores | Solo datos de su empresa |

### Flujo de Login

1. Usuario envía credenciales a `/api/trabajadores/auth/login`
2. Backend valida con bcrypt
3. Si válido, genera token JWT:
   ```javascript
   jwt.sign({
     id: trabajador._id,
     email: trabajador.email,
     empresa: trabajador.empresa._id,
     role: trabajador.role
   }, JWT_SECRET, { expiresIn: '24h' })
   ```
4. Frontend guarda token + datos en `localStorage`
5. Axios incluye token en todos los requests: `Authorization: Bearer <token>`

### Registro de Empresas

**Flujo `/api/trabajadores/auth/register-empresa`:**
1. Crea documento en colección `clientes`
2. Crea usuario admin de empresa en `trabajadores` con role='cliente'
3. Asocia usuario a empresa
4. Usuario debe hacer login después

---

## 🔄 Flujos de Trabajo

### Flujo 1: Crear y Asignar Ticket

```
1. Cliente crea ticket (Tickets.vue)
   └─→ POST /api/tickets
       └─→ ticket.status = 'abierto'
       └─→ ticket.cliente = <empresa del cliente>
       └─→ ticket.tecnico = null

2. Admin/Técnico ve ticket sin asignar (Dashboard)
   └─→ GET /api/tickets
       └─→ filtro: sin técnico

3. Admin asigna técnico (Tickets.vue)
   └─→ PUT /api/tickets/:id
       └─→ ticket.tecnico = <id del técnico>
       └─→ ticket.status = 'en progreso'

4. Técnico trabaja en ticket (TicketDetail.vue)
   └─→ Envía mensajes (POST /api/tickets/:id/messages)
   └─→ Puede hacer videollamada con cliente
   └─→ Genera albarán si corresponde

5. Técnico cierra ticket
   └─→ PUT /api/tickets/:id
       └─→ ticket.status = 'cerrado'
       └─→ ticket.endDate = Date.now()
```

### Flujo 2: Videollamada en Ticket

```
1. Usuario A abre ticket (TicketDetail.vue)
   └─→ Socket.io se conecta
   └─→ socket.emit('join-ticket-room', ticketId, userData)

2. Usuario B abre mismo ticket
   └─→ Socket.io se conecta
   └─→ socket.emit('join-ticket-room', ticketId, userData)
   └─→ Ambos reciben 'user-joined'

3. Usuario A inicia llamada
   └─→ startCall('video') o startCall('voice')
   └─→ Solicita permisos de cámara/micrófono
   └─→ Crea RTCPeerConnection
   └─→ Genera oferta SDP
   └─→ socket.emit('incoming-call', { offer, ... })

4. Usuario B recibe llamada
   └─→ Evento 'incoming-call'
   └─→ Muestra UI de llamada entrante
   
   A) Si acepta → acceptCall()
      └─→ Solicita permisos
      └─→ Crea RTCPeerConnection
      └─→ Establece oferta remota
      └─→ Crea respuesta SDP
      └─→ socket.emit('call-answer', { answer, ... })
      └─→ Conexión P2P establecida ✅
   
   B) Si rechaza → rejectCall()
      └─→ socket.emit('reject-call', { to })
      └─→ Usuario A recibe 'call-rejected'

5. Durante la llamada:
   - ICE candidates se intercambian automáticamente
   - Ambos pueden compartir pantalla
   - Tracks de audio/video se transmiten P2P
   - Se registra en CallLog

6. Finalizar llamada:
   └─→ endCall()
   └─→ socket.emit('call-ended', { duration, screenShared })
   └─→ Cerrar tracks y peerConnection
   └─→ Actualiza CallLog en BD
```

### Flujo 3: Crear Albarán

```
1. Técnico accede a Albaranes.vue
   └─→ GET /api/albaranes/numero/siguiente
       └─→ Obtiene próximo número (ALB-2026-XXX)

2. Técnico rellena formulario:
   - Cliente (select)
   - Ticket asociado (opcional)
   - Líneas de trabajo (concepto, cantidad, precio)
   - Notas/Observaciones

3. Sistema calcula automáticamente:
   - importe por línea = cantidad × precio
   - subtotal = Σ importes
   - IVA = subtotal × (porcentajeIVA / 100)
   - total = subtotal + IVA

4. Técnico guarda albarán
   └─→ POST /api/albaranes
       └─→ estado = 'pendiente'
       └─→ fechaAlbaran = Date.now()

5. Técnico puede cambiar estado:
   └─→ PATCH /api/albaranes/:id/estado
       └─→ 'pendiente' → 'entregado'
       └─→ Se suman horas a cliente.horasUsadas
```

---

## 🛠️ Guía de Desarrollo

### Requisitos Previos

- **Node.js**: v18 o superior
- **MongoDB**: v6.0 o superior (local o Atlas)
- **npm**: v9 o superior

### Instalación

```bash
# Clonar repositorio
git clone <url-repo>
cd Proyecto-Francisco-Aleix

# Instalar dependencias (backend + frontend)
npm run install:all

# O manualmente:
cd backend && npm install
cd ../frontend && npm install
```

### Configuración

**1. Variables de entorno (backend/.env):**
```env
# Base de datos
MONGO_URI=mongodb://127.0.0.1:27017/MyApp

# JWT Secret
JWT_SECRET=tu_secret_muy_seguro_aqui
```

**2. MongoDB:**
```bash
# Asegurarse que MongoDB está corriendo
# Windows: net start MongoDB
# macOS/Linux: sudo systemctl start mongod

# O usar MongoDB Atlas (cloud)
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/myDatabase
```

### Desarrollo Local

**Opción 1: Dos terminales**
```bash
# Terminal 1 - Backend (puerto 5001)
cd backend
npm run dev

# Terminal 2 - Frontend (puerto 5173)
cd frontend
npm run dev
```

**Opción 2: Script único**
```bash
# Desde raíz del proyecto
npm run dev:backend   # Solo backend
npm run dev:frontend  # Solo frontend
```

**Acceso:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:5001
- WebSocket: ws://localhost:5001

### Usuarios de Prueba

El sistema crea automáticamente (via seeder):

```javascript
// Admin global
email: admin@example.com
password: admin123

// Técnico
email: tecnico@example.com
password: tecnico123

// Cliente (empresa demo)
email: cliente@example.com
password: cliente123
```

### Testing de APIs

**Con cURL:**
```bash
# Login
curl -X POST http://localhost:5001/api/trabajadores/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# Obtener tickets (con token)
curl -X GET http://localhost:5001/api/tickets \
  -H "Authorization: Bearer <tu_token_aqui>"
```

**Con Postman/Insomnia:**
1. Importar colección de endpoints
2. Configurar variable `{{baseURL}}` = `http://localhost:5001`
3. Hacer login y guardar token
4. Añadir token en headers: `Authorization: Bearer {{token}}`

### Debugging

**Backend:**
```bash
# Con logs detallados
NODE_ENV=development npm run dev

# Con inspector de Node.js
node --inspect backend/server.js
```

**Frontend (Vue Devtools):**
1. Instalar extensión Vue Devtools en Chrome/Firefox
2. Abrir aplicación en localhost:5173
3. Abrir DevTools → pestaña Vue
4. Inspeccionar componentes, Pinia store, router

**Socket.io:**
```javascript
// En TicketDetail.vue, descomentar para debug:
socket.value.onAny((event, ...args) => {
  console.log(`Socket event: ${event}`, args)
})
```

### Build de Producción

```bash
# Frontend
cd frontend
npm run build
# Genera dist/ con archivos estáticos

# Backend (ya está listo, solo configurar .env)
# Configurar MONGO_URI de producción
# Configurar JWT_SECRET seguro
```

### Deploy

Ver [DEPLOY.md](./DEPLOY.md) para instrucciones detalladas de despliegue en:
- VPS/Servidor dedicado
- Heroku
- Firebase Hosting (frontend) + Railway (backend)
- Docker

---

## 📝 Notas Importantes

### ⚠️ MongoDB ObjectId

**CRÍTICO**: MongoDB usa `_id` (no `id`):

```javascript
// ✅ Correcto
ticket._id
cliente._id

// ❌ Incorrecto  
ticket.id
cliente.id
```

En todo el código, usar **siempre** `._id` para acceder al ID de documentos MongoDB.

### 🔒 Seguridad

**Recomendaciones para producción:**
1. Cambiar `JWT_SECRET` a valor fuerte y único
2. Configurar CORS restrictivo (no `"*"`)
3. Usar HTTPS para todo (frontend + backend)
4. Configurar rate limiting en Express
5. Sanitizar inputs de usuario
6. Usar MongoDB Atlas con IP whitelist

### 🚀 Performance

**Optimizaciones implementadas:**
- `Promise.allSettled()` en fetchAll (requests paralelos)
- Populación de referencias en queries críticos
- Índices en campos de búsqueda frecuente
- Lazy loading de vistas en Vue Router

### 🐛 Problemas Conocidos

Ver archivo [KNOWN_ISSUES.md](./copilot-instructions.md#known-issues--workarounds) en copilot-instructions.

---

## 🤝 Contribución

1. Crear branch: `git checkout -b feature/nueva-funcionalidad`
2. Commit cambios: `git commit -m "feat: descripción"`
3. Push: `git push origin feature/nueva-funcionalidad`
4. Crear Pull Request

### Convenciones de Código

- **Backend**: ESLint Standard
- **Frontend**: Vue 3 Style Guide (Composition API)
- **Commits**: Conventional Commits (feat, fix, docs, etc.)

---

## 📞 Soporte

Para dudas o problemas:
- Crear issue en GitHub
- Revisar documentación en `/docs`
- Consultar logs del servidor

---

**Última actualización**: Febrero 2026  
**Versión**: 1.0.0
