# Guía de Configuración - Videollamadas en Tickets

## ✅ Configuración Completada

Se ha implementado funcionalidad completa de videollamadas WebRTC con signaling vía WebSocket en los tickets de soporte.

### Componentes Instalados

1. **Backend WebSocket (Socket.io)**
   - Ubicación: `/backend/server.js`
   - Dependencia: `socket.io@4.8.3`
   - Puerto: `5001`

2. **Frontend WebSocket Client (Socket.io-client)**
   - Ubicación: `/frontend/src/views/TicketDetail.vue`
   - Dependencia: `socket.io-client@4.8.3`
   - Componente: `TicketDetail.vue`

### Características Implementadas

✅ **Videollamada en Tiempo Real**
- Iniciar videollamada desde panel de detalles del ticket
- Aceptar/Rechazar llamadas entrantes
- Mostrar videos locales y remotos lado a lado
- Control de micrófono (mutar/desmutar)
- Control de cámara (activar/desactivar)
- Finalizar llamada

✅ **WebRTC Peer Connection**
- RTCPeerConnection con STUN servers de Google
- Exchange de SDP (oferta/respuesta)
- ICE candidate exchange vía WebSocket
- Auto-conexión al abrir ticket

✅ **Interfaz de Usuario**
- Botón "Videollamada" en header de conversación
- Vista dual de videos (local + remoto)
- Modal de llamada entrante
- Controles de mute/video en tiempo real
- Indicador visual de estado de llamada
- Animaciones y estilos responsivos

### Eventos WebSocket Implementados

**Cliente → Servidor:**
- `join-ticket-room` - Unirse a sala de ticket
- `call-offer` - Iniciar llamada
- `call-answer` - Aceptar llamada
- `ice-candidate` - Enviar candidato ICE
- `reject-call` - Rechazar llamada
- `end-call` - Terminar llamada

**Servidor → Cliente:**
- `user-joined` - Usuario se unió a sala
- `incoming-call` - Llamada entrante
- `call-answered` - Llamada aceptada
- `ice-candidate` - Candidato ICE recibido
- `call-rejected` - Llamada rechazada
- `call-ended` - Llamada terminada
- `user-disconnected` - Usuario desconectado

## 🚀 Cómo Usar

### Requisitos
- Node.js instalado
- npm dependencias instaladas
- Navegador con soporte WebRTC (Chrome, Firefox, Edge, Safari)
- Cámara y micrófono disponibles
- Permisos de acceso a cámara/micrófono

### Pasos para Probar

1. **Instalar dependencias (si aún no lo hizo):**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. **Iniciar servidor backend:**
   ```bash
   cd backend
   npm run dev
   # o
   npm start
   ```
   Debería ver: `Servidor ejecutándose en http://localhost:5001`

3. **Iniciar frontend (en otra terminal):**
   ```bash
   cd frontend
   npm run dev
   ```
   Debería ver: `Local: http://localhost:5173/`

4. **Abrir dos navegadores/pestañas:**
   - Pestaña 1: Técnico accediendo a ticket
   - Pestaña 2: Cliente accediendo a mismo ticket
   - O dos máquinas diferentes conectadas a localhost:5173

5. **Iniciar videollamada:**
   - Usuario 1: Click en botón "Videollamada" en header
   - Usuario 2: Verá modal "Videollamada entrante"
   - Usuario 2: Click en "Aceptar"
   - Ambos: Verán videos locales y remotos

6. **Controles durante la llamada:**
   - 🔇 Mutar/desmutar micrófono
   - 📹 Activar/desactivar cámara
   - 📞 Finalizar llamada

### Pruebas Sugeridas

- [ ] Iniciar llamada desde técnico, aceptar desde cliente
- [ ] Iniciar llamada desde cliente, aceptar desde técnico
- [ ] Rechazar una llamada entrante
- [ ] Mutar micrófono y verificar que se refleja
- [ ] Desactivar cámara y verificar que se refleja
- [ ] Finalizar llamada desde ambos lados
- [ ] Probar en diferentes navegadores
- [ ] Probar reconexión (cerrar navegador y reabrir)

## 🔧 Estructura de Archivos

```
backend/
├── server.js          [MODIFICADO] - WebSocket + Socket.io
└── package.json       [ACTUALIZADO] - socket.io@4.8.3

frontend/
├── src/
│   └── views/
│       └── TicketDetail.vue   [MODIFICADO] - Video UI + WebRTC logic
└── package.json       [ACTUALIZADO] - socket.io-client@4.8.3
```

## 🐛 Troubleshooting

### Problema: "Conectando..." pero no se establece conexión
**Solución:**
- Verificar que backend está ejecutándose en puerto 5001
- Verificar CORS en server.js está permitido
- Comprobar que no hay firewall bloqueando puerto 5001
- Revisar console del navegador (F12) para errores

### Problema: Permisos de cámara/micrófono denegados
**Solución:**
- Aceptar permisos cuando el navegador lo pida
- Verificar permisos del sistema operativo
- En algunos navegadores: Recargar página para reconectar

### Problema: Video local se ve pero no el remoto
**Solución:**
- Esperar más tiempo (puede tomar 5-10 segundos)
- Verificar que ambos usuarios están en mismo ticket
- Revisar eventos WebSocket en console (F12)
- Comprobar conectividad de red

### Problema: Audio pero no video
**Solución:**
- Verificar resolución de cámara (1280x720 ideal)
- Revisar constraints en startCall/acceptCall
- Probar con otro navegador

### Problema: ICE candidate error
**Solución:**
- Configuración STUN está en server.js
- Si está en red cerrada, puede necesitar TURN servers
- TURN servers públicos: coturn, metered.ca, etc.

## 📋 Configuración de TURN (Opcional)

Si necesita soporte para redes con NAT/firewall cerrado:

1. Editar configuración de STUN/TURN en `TicketDetail.vue`:
```javascript
const peerConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    {
      urls: 'turn:your-turn-server.com:3478',
      username: 'user',
      credential: 'password'
    }
  ]
};
```

2. Servicios TURN disponibles:
   - Metered.ca (free tier: 100MB/mes)
   - OpenRelayProject
   - Coturn (auto-hospedado)

## 📊 Estado de Implementación

| Componente | Estado | Notas |
|-----------|--------|-------|
| Socket.io Backend | ✅ Completado | 7 event handlers |
| WebRTC Script | ✅ Completado | RTCPeerConnection full |
| Video UI Template | ✅ Completado | Dual video layout |
| CSS Styling | ✅ Completado | Responsive, animations |
| Error Handling | ✅ Completado | Try-catch, user alerts |
| Cleanup/Teardown | ✅ Completado | onUnmounted hooks |
| Browser Compat | ✅ Parcial | Chrome/Firefox OK, Safari untested |
| Mobile Responsive | ✅ Completado | Media queries added |
| Production Ready | ⚠️ Revisión | Recomendado TURN para redes cerradas |

## 🔐 Consideraciones de Seguridad

- WebSocket CORS permitido a "*" (⚠️ Cambiar en producción)
- Sin autenticación de Socket.io (⚠️ Implementar en producción)
- Sin cifrado de signaling (⚠️ Usar WSS en producción)
- WebRTC data es P2P y cifrado automáticamente (✅)

## 📝 Cambios Realizados

### Backend (server.js)
```javascript
// Agregado: HTTP server + Socket.io
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Agregado: 7 Socket.io event handlers para videollamadas
io.on("connection", (socket) => {
  socket.on("join-ticket-room", ...);
  socket.on("call-offer", ...);
  socket.on("call-answer", ...);
  socket.on("ice-candidate", ...);
  socket.on("reject-call", ...);
  socket.on("end-call", ...);
  socket.on("disconnect", ...);
});

server.listen(5001);  // Antes: app.listen(5001)
```

### Frontend (TicketDetail.vue)
```vue
<!-- Agregado: Imports de Socket.io y Lucide icons -->
import { io } from 'socket.io-client';
import { Video, Phone, X, Mic, MicOff, VideoOff } from 'lucide-vue-next';

<!-- Agregado: 18+ ref variables para state de videollamada -->
const socket = ref(null);
const localStream = ref(null);
const remoteStream = ref(null);
const peerConnection = ref(null);
const inCall = ref(false);
// ... más variables

<!-- Agregado: 7 funciones principales -->
const initializeSocket = (ticketId) => { ... };
const startCall = async () => { ... };
const acceptCall = async () => { ... };
const handleAnswerReceived = async (answer) => { ... };
const rejectCall = () => { ... };
const toggleMute = () => { ... };
const toggleVideo = () => { ... };
const endCall = () => { ... };

<!-- Agregado: HTML para video interface, botones, modal -->
<div v-if="inCall" class="video-container">
  <video ref="localVideoRef" autoplay playsinline muted></video>
  <video ref="remoteVideoRef" autoplay playsinline></video>
  <!-- Botones de control -->
</div>

<div v-if="showIncomingCall" class="incoming-call-modal">
  <!-- Modal de llamada entrante -->
</div>

<!-- Agregado: CSS para video layout, animaciones -->
.video-container { ... }
.incoming-call-modal { ... }
@keyframes ring { ... }
```

## 📞 Support

Si encuentra problemas, revisar:
1. Console del navegador (F12 → Console tab)
2. Network tab (F12 → Network tab) para WebSocket
3. Backend logs en terminal
4. Firewall/antivirus bloqueando puerto 5001

¡La videollamada está lista para usar! 🎉
