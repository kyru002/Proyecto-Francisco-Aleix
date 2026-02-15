# 🎫 SupportDesk - Sistema de Gestión de Tickets

Sistema profesional de gestión de tickets de soporte técnico con videollamadas WebRTC integradas, chat en tiempo real, seguimiento de albaranes y **Progressive Web App (PWA)** instalable en móvil.

## 📋 Características

- ✅ **Gestión completa de tickets** (crear, asignar, cerrar)
- 📹 **Videollamadas integradas** (WebRTC peer-to-peer)
- 💬 **Chat en tiempo real** (Socket.io)
- 📄 **Gestión de albaranes** (invoices/facturas)
- 👥 **Roles y permisos** (Admin, Técnico, Cliente)
- 📱 **PWA instalable** (funciona como app nativa en móvil)
- 🎨 **Interfaz responsive** (mobile-first design)
- 🔒 **Autenticación JWT** (sesiones seguras)

---

## 🚀 Inicio Rápido

### Requisitos Previos

- Node.js v18+ 
- MongoDB local corriendo en `localhost:27017`
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone https://github.com/kyru002/Proyecto-Francisco-Aleix.git
cd Proyecto-Francisco-Aleix

# Instalar todas las dependencias
npm run install:all

# Configurar variables de entorno (opcional)
cp .env.example backend/.env
```

### Ejecutar en Desarrollo

**Opción 1: Script único (recomendado)**
```bash
npm run dev
```

**Opción 2: Terminales separadas**

Terminal 1 - Backend:
```bash
npm run dev:backend
# Servidor corriendo en http://localhost:5001
```

Terminal 2 - Frontend:
```bash
npm run dev:frontend
# Aplicación corriendo en http://localhost:5173
```

**Opción 3: Bash script (Linux/Mac)**
```bash
chmod +x start-app.sh
./start-app.sh
```

---

## 👤 Usuarios de Prueba

### Admin
- **Email:** `admin@support.com`
- **Password:** `admin123`
- **Permisos:** Acceso completo al sistema

### Técnico
- **Email:** `marti@soporte.com`
- **Password:** `marti123`
- **Permisos:** Ver/gestionar tickets asignados, crear albaranes

### Cliente
- **Email:** `pablo@nike.com`
- **Password:** `pablo123`
- **Permisos:** Ver solo sus propios tickets, crear nuevos tickets

---

## 📱 Instalar como PWA (App Móvil)

### Android (Chrome)
1. Abre http://192.168.1.X:5173/ en Chrome móvil
2. Espera 2 segundos → Aparece banner azul
3. Toca **"Instalar"** → ¡Listo! 🎉

### iPhone (Safari)
1. Abre http://192.168.1.X:5173/ en Safari
2. Toca el botón **Compartir** ⬆️
3. Selecciona **"Añadir a pantalla de inicio"**

### Desktop (Chrome/Edge)
1. Haz clic en el icono **➕** en la barra de direcciones
2. Confirma instalación → Se abre como app independiente

**📖 Guía completa:** [docs/COMO_INSTALAR_PWA.md](docs/COMO_INSTALAR_PWA.md)

---

## 🏗️ Estructura del Proyecto

```
Proyecto-Francisco-Aleix/
├── backend/               # API REST + Socket.io + MongoDB
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Endpoints API
│   ├── middleware/        # Auth & role checking
│   └── server.js          # Entry point
├── frontend/              # Vue 3 + Vite + Pinia
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── views/         # Páginas/vistas
│   │   ├── stores/        # Pinia state management
│   │   ├── router/        # Vue Router
│   │   └── services/      # API client (axios)
│   └── public/            # Assets estáticos + iconos PWA
└── docs/                  # Documentación completa
    ├── DOCUMENTACION_SISTEMA.md  # Arquitectura detallada
    ├── COMO_INSTALAR_PWA.md      # Guía instalación PWA
    ├── GUIA_PWA.md               # Configuración PWA técnica
    └── DEPLOY.md                 # Guía de deployment
```

---

## 🛠️ Stack Tecnológico

### Backend
- **Runtime:** Node.js v24+
- **Framework:** Express.js 4.x
- **Database:** MongoDB + Mongoose ODM
- **Real-time:** Socket.io 4.8.3 (WebSocket)
- **Auth:** JWT + bcryptjs
- **WebRTC:** Simple-peer (videollamadas)

### Frontend
- **Framework:** Vue 3 (Composition API)
- **Build Tool:** Vite 5.4
- **State:** Pinia
- **Routing:** Vue Router 4
- **HTTP Client:** Axios
- **UI:** Tailwind CSS
- **Icons:** Lucide Vue
- **PWA:** vite-plugin-pwa + Workbox

---

## 📚 Documentación Completa

Toda la documentación está organizada en la carpeta [`docs/`](docs/):

| Documento | Descripción |
|-----------|-------------|
| [DOCUMENTACION_SISTEMA.md](docs/DOCUMENTACION_SISTEMA.md) | Arquitectura completa, modelos de datos, flujos WebRTC |
| [COMO_INSTALAR_PWA.md](docs/COMO_INSTALAR_PWA.md) | Guía paso a paso para instalar en móvil |
| [GUIA_PWA.md](docs/GUIA_PWA.md) | Configuración técnica de la PWA |
| [DEPLOY.md](docs/DEPLOY.md) | Deployment en producción (Vercel, Netlify, Docker) |

---

## 🧪 Testing & Development

### Variables de Entorno

Crea un archivo `backend/.env`:

```env
# Base de datos
MONGO_URI=mongodb://127.0.0.1:27017/MyApp

# JWT Secret (cambiar en producción)
JWT_SECRET=tu-clave-secreta-muy-segura-cambiar-en-produccion

# Puerto del servidor
PORT=5001
```

### Conectar desde Móvil en Red Local

1. **Obtén tu IP local:**
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. **Busca tu IPv4 Address** (ej: 192.168.1.130)

3. **Abre en móvil:** http://192.168.1.130:5173/

4. **Asegúrate de que:**
   - ✅ Móvil y PC en la misma red WiFi
   - ✅ Firewall permite conexiones entrantes (puerto 5173)

---

## 🎯 Características Principales

### 🎫 Sistema de Tickets
- Estado: Abierto → En Progreso → Cerrado
- Prioridades: Alta, Media, Baja
- Asignación automática y manual
- Historial de cambios
- Chat integrado por ticket

### 📹 Videollamadas
- WebRTC peer-to-peer
- Sin necesidad de servidor externo
- Llamadas desde el detalle del ticket
- Registro de llamadas (duración, participantes)

### 📄 Albaranes
- Creación y gestión de facturas
- Firma del cliente (canvas)
- Estados: Pendiente, Firmado, Facturado
- Asociación a tickets

### 👥 Gestión de Usuarios
- Roles: Admin, Técnico, Cliente
- Permisos granulares por rol
- Perfil editable
- Sistema de empresas/organizaciones

---

## 🚀 Deployment

### Producción Rápida (Vercel + MongoDB Atlas)

```bash
# Frontend en Vercel
cd frontend
npm run build
vercel --prod

# Backend en Vercel/Railway
cd backend
vercel --prod  # o railway up
```

**Guía completa:** [docs/DEPLOY.md](docs/DEPLOY.md)

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/nueva-caracteristica`
3. Commit cambios: `git commit -m 'Add: nueva característica'`
4. Push: `git push origin feature/nueva-caracteristica`
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es parte de un trabajo académico.

---

## 👨‍💻 Autor

**Francisco & Aleix**
- GitHub: [@kyru002](https://github.com/kyru002)
- Proyecto: Gestión de Tickets con PWA

---

## 🐛 Solución de Problemas

### Backend no conecta con MongoDB
```bash
# Verificar que MongoDB está corriendo
mongosh --eval "db.version()"

# Iniciar MongoDB (Windows)
net start MongoDB

# Iniciar MongoDB (Mac/Linux)
sudo systemctl start mongod
```

### Puerto 5173 ya en uso
```bash
# Windows
netstat -ano | findstr :5173
taskkill /PID <numero> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### PWA no se puede instalar
- ✅ Verifica que existe `frontend/public/manifest.json`
- ✅ Iconos PNG existen: `icon-192.png`, `icon-512.png`
- ✅ Estás en HTTPS o localhost
- ✅ Service Worker registrado (F12 → Application → Service Workers)

---

## 📊 Características Técnicas

- ✅ **MongoDB** local persistence
- ✅ **Socket.io** real-time bidireccional
- ✅ **WebRTC** sin STUN/TURN servers externos
- ✅ **JWT** authentication con refresh tokens
- ✅ **PWA** offline-first con service workers
- ✅ **Responsive** mobile-first design
- ✅ **Role-based** access control (RBAC)
- ✅ **Tailwind CSS** utility-first styling

---

¿Preguntas? Revisa la [documentación completa](docs/) o abre un issue. 🚀
