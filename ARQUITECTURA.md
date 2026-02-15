# 🏗️ Arquitectura del Despliegue

## Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTE WEB (Browser)                    │
│                  http://tu-servidor.com                     │
└────────────────────────────┬────────────────────────────────┘
                             │
                    Solicitud HTTP (80)
                             │
┌────────────────────────────▼────────────────────────────────┐
│                      DOCKER NETWORK                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │               NGINX (REVERSE PROXY)                  │  │
│  │         Puerto 80 → Interno :80                      │  │
│  │  ├─ GET / → Sirve frontend Vue (dist/)              │  │
│  │  ├─ /api/* → Proxy a Backend:5001                   │  │
│  │  └─ /socket.io/* → Proxy WebSocket a Backend:5001   │  │
│  └──────────────────────────┬───────────────────────────┘  │
│                             │                               │
│              ┌──────────────┼──────────────┐               │
│              │              │              │               │
│              ▼              ▼              ▼               │
│  ┌─────────────────┐ ┌──────────────┐ ┌──────────────┐  │
│  │  NODE.JS BACKEND│ │   MONGODB    │ │   Volumes    │  │
│  │   (Express.js)  │ │   Database   │ │              │  │
│  │  Puerto 5001    │ │  Puerto 27017│ │ • mongo-data │  │
│  │                 │ │              │ │ • frontend   │  │
│  │ • API REST      │ │ • Collections│ │   -dist      │  │
│  │ • Socket.io     │ │ • Indexes    │ │              │  │
│  │ • Autenticación │ │ • Backups    │ │              │  │
│  │ • Lógica        │ │              │ │              │  │
│  └─────────────────┘ └──────────────┘ └──────────────┘  │
│                                                            │
└────────────────────────────────────────────────────────────┘
                             △
                    Docker Compose
                   Gestiona todo esto
```

---

## 📦 Componentes del Despliegue

### 1. **NGINX (Reverse Proxy)**
- **Rol**: Distribuidor de tráfico
- **Puerto externo**: 80 (HTTP)
- **Responsabilidades**:
  - Servir frontend Vue compilado (archivos estáticos)
  - Hacer proxy de `/api` al backend
  - Hacer proxy de `/socket.io` para WebRTC
  - Compresión Gzip
  - Cache de assets estáticos

### 2. **Node.js Backend**
- **Rol**: Servidor de aplicación
- **Puerto interno**: 5001
- **Stack**: Express.js + Socket.io
- **Responsabilidades**:
  - API REST (/api/...)
  - WebSocket (socket.io)
  - Autenticación JWT
  - Lógica de negocio

### 3. **MongoDB**
- **Rol**: Base de datos
- **Puerto interno**: 27017 (no expuesto)
- **Responsabilidades**:
  - Almacenar tickets
  - Almacenar clientes
  - Almacenar técnicos
  - Almacenar albaranes
  - Persistencia de datos

### 4. **Volúmenes Docker**
- **mongo-data**: Datos persistentes de MongoDB
- **frontend-dist**: Archivos compilados del frontend

---

## 🔄 Flujo de Solicitud Típico

### 1. Acceso a la página principal

```
Cliente → http://servidor (Puerto 80)
    ↓
Nginx recibe en puerto 80
    ↓
Nginx busca / en /usr/share/nginx/html
    ↓
Devuelve index.html + CSS/JS compiled
    ↓
Cliente recibe la aplicación Vue compilada
```

### 2. Solicitud de API (Ejemplo: GET /api/tickets)

```
Frontend hace Ajax: GET http://servidor/api/tickets
    ↓
Nginx recibe en puerto 80
    ↓
Nginx detecta /api en la URL
    ↓
Nginx hace proxy a http://app:5001/api/tickets
    ↓
Backend (Node.js) procesa la solicitud
    ↓
Backend consulta MongoDB
    ↓
Backend devuelve JSON
    ↓
Nginx devuelve respuesta al Cliente
```

### 3. WebSocket (Socket.io)

```
Frontend conecta: ws://servidor/socket.io
    ↓
Nginx recibe upgrade a WebSocket
    ↓
Nginx hace proxy a ws://app:5001/socket.io
    ↓
Conecta bidireccional con Backend
    ↓
Mensajes en tiempo real entre Cliente ↔ Backend
```

---

## 🐳 Estructura de Docker Compose

```yaml
Services:
├── MongoDB
│   └── Container: proyecto-mongodb
│       └── Volumen: mongo-data
├── Backend (Node.js)
│   └── Container: proyecto-app
│       └── Puerto: 5001
└── Nginx
    └── Container: proyecto-nginx
        ├── Puerto: 80 (expuesto)
        └── Volumen: frontend-dist (mount read-only)

Network:
└── app-network (bridge)
    └── Conecta los 3 containers

Volumes:
├── mongo-data (persistencia BD)
└── frontend-dist (archivos compilados)
```

---

## 📊 Flujo de Despliegue

### Build (Construcción)

```
Proyecto Local
    ↓
docker-compose build
    ↓
1. Build Frontend (Node > dist/)
   ├─ npm install
   ├─ npm run build
   └─ dist/ → volumen frontend-dist
    ↓
2. Build Backend (Node)
   ├─ npm install
   └─ Código listo en /app/backend
    ↓
3. Build Nginx
   └─ Configuración lista en /etc/nginx
    ↓
Imágenes creadas y listas
```

### Start (Inicio)

```
docker-compose up -d
    ↓
1. Inicia MongoDB
   └─ Carga volumen mongo-data
    ↓
2. Inicia Backend
   ├─ Conecta a MongoDB
   ├─ Inicia servidor en :5001
   └─ Carga en app-network
    ↓
3. Inicia Nginx
   ├─ Monta frontend-dist en /usr/share/nginx/html
   ├─ Copia configuración
   ├─ Inicia servidor en :80
   └─ Conecta a app-network
    ↓
Aplicación lista para servir ✓
```

---

## 🔐 Seguridad de Red

### Puertos Expuestos
- **Puerto 80**: Nginx (internet pública) ✓
- **Otros puertos**: NO expuestos (solo red interna)

### Acceso Interno
- Backend ↔ MongoDB: Red interna app-network ✓
- Frontend → Backend: Através de Nginx en localhost ✓
- Cliente → Backend: Solo mediante Nginx ✓

### Protecciones
- JWT Token para autenticación
- CORS configurado en Backend
- WebSocket seguro mediante Nginx

---

## 📈 Escalabilidad (Futuro)

Para manejar más usuarios:

```
1. Replicación de Backend
   └─ Múltiples instancias de Node.js
      └─ Load balancing con Nginx

2. Replicación de MongoDB
   └─ Replica Set de MongoDB

3. Cache
   └─ Redis para sesiones/caché

4. CDN
   └─ Servir assets estáticos desde CDN
```

---

## 🔄 Restauración de Datos

### Backup de MongoDB

```bash
# Dentro del container
docker-compose exec mongodb mongodump --out /backup

# O desde host
docker cp proyecto-mongodb:/backup ./backup
```

### Restaurar Backup

```bash
# Copiar al container
docker cp backup proyecto-mongodb:/backup

# Restaurar
docker-compose exec mongodb mongorestore /backup
```

---

## 📝 Variables de Entorno

```env
# Development
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/proyecto-db

# Production
NODE_ENV=production
MONGO_URI=mongodb://mongodb:27017/proyecto-db
JWT_SECRET=clave-super-segura-generada
VITE_API_URL=http://tu-dominio.com/api
VITE_SOCKET_URL=http://tu-dominio.com
BASE_URL=http://tu-dominio.com
```

---

## 🎯 Checklist de Producción

- [ ] JWT_SECRET es une clave aleatoria larga
- [ ] NODE_ENV = production
- [ ] BASE_URL apunta a tu dominio
- [ ] Nginx tiene gzip habilitado
- [ ] Caché de assets configurado
- [ ] Logs centralizados
- [ ] Backups automáticos de BD
- [ ] Monitoreo configurado
- [ ] SSL/TLS configurado (opcional)

---

**¡Sistema completamente containerizado y listo para producción! 🚀**
