# 📞 Resumen de Cambios: Llamadas de Voz vs Videollamadas

## Descripción General
Se ha rediseñado la arquitectura de videollamadas para separar completamente dos tipos de llamadas:
- **Llamada de Voz**: Solo audio, con opción de compartir pantalla
- **Videollamada**: Video + audio, sin compartir pantalla

## Cambios Realizados

### 🎯 Frontend (TicketDetail.vue)

#### 1. Nueva Variable de Estado
```javascript
const callType = ref(null); // 'voice' o 'video'
```

#### 2. Botones de Llamada
**Antes:**
- Un solo botón "Videollamada"

**Después:**
- Dos botones distintos:
  - "☎️ Llamada de voz" - Inicia llamada de solo audio
  - "📹 Videollamada" - Inicia llamada con video

#### 3. Función `startCall(type)`
**Cambios:**
```javascript
startCall(type) // type: 'voice' o 'video'
```

- **Para 'voice':** `{ audio: true, video: false }`
- **Para 'video':** `{ video: { width, height }, audio: true }`

- Emite `callType` en el socket: `socket.emit('call-offer', { ..., callType: type })`

#### 4. Función `acceptCall()`
**Cambios:**
- Lee `callType` desde `incomingCallData.value.callType`
- Usa ese tipo para solicitar media correctamente
- Aplica las mismas restricciones que en `startCall()`

#### 5. Función `endCall()`
**Cambios:**
- Ahora resetea `callType` y `isSharingScreen`
```javascript
callType.value = null;
isSharingScreen.value = false;
```

#### 6. Template - Dos Layouts Distintos

**Layout para Videollamada (`callType === 'video'`):**
```vue
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; height: 300px;">
  <!-- Video Local -->
  <video ref="localVideoRef" autoplay playsinline muted></video>
  
  <!-- Video Remoto -->
  <video ref="remoteVideoRef" autoplay playsinline muted></video>
</div>

<!-- Controles: Micrófono, Cámara, Finalizar -->
```

**Layout para Llamada de Voz (`callType === 'voice'`):**
```vue
<!-- Si está compartiendo pantalla -->
<video ref="localScreenVideoRef" autoplay playsinline muted></video>

<!-- Si NO está compartiendo -->
<div style="icono de llamada de voz">
  <p>Llamada de voz en curso</p>
  <p>Presiona "Compartir pantalla" para comenzar</p>
</div>

<!-- Controles: Micrófono, Compartir Pantalla, Finalizar -->
```

#### 7. Modal de Llamada Entrante
**Antes:**
```
"Videollamada entrante"
```

**Después:**
```vue
{{ incomingCallData?.callType === 'voice' ? 'Llamada de voz entrante' : 'Videollamada entrante' }}
```

#### 8. Indicador de Estado en Header
```vue
{{ callType === 'voice' ? 'Llamada de voz' : 'Videollamada' }} en curso
```

#### 9. Handlers WebRTC Simplificados

**`peerConnection.ontrack` (ambos startCall y acceptCall):**
```javascript
peerConnection.value.ontrack = (event) => {
  if (event.streams && event.streams[0]) {
    remoteStream.value = event.streams[0];
    
    // SOLO para videollamadas
    if (callType.value === 'video' && remoteVideoRef.value) {
      remoteVideoRef.value.srcObject = remoteStream.value;
      remoteVideoRef.value.play();
    }
  }
};
```

### 🔧 Backend (server.js)

#### Actualización: Evento `call-offer`

**Antes:**
```javascript
const { ticketId, offer, callerName } = data;

socket.broadcast.to(room).emit("incoming-call", {
  from: socket.id,
  callerName: callerName,
  offer: offer
});
```

**Después:**
```javascript
const { ticketId, offer, callerName, callType } = data;

console.log(`   Type: ${callType}`);

socket.broadcast.to(room).emit("incoming-call", {
  from: socket.id,
  callerName: callerName,
  callType: callType,
  offer: offer
});
```

## Flujo de Llamadas

### 1️⃣ Iniciar Llamada de Voz
```
Usuario A → Click "Llamada de voz"
  ↓
startCall('voice')
  ↓
getUserMedia({ audio: true, video: false })
  ↓
Emite: call-offer { ..., callType: 'voice' }
  ↓
Usuario B recibe: incoming-call { callType: 'voice' }
```

### 2️⃣ Iniciar Videollamada
```
Usuario A → Click "Videollamada"
  ↓
startCall('video')
  ↓
getUserMedia({ video: {...}, audio: true })
  ↓
Emite: call-offer { ..., callType: 'video' }
  ↓
Usuario B recibe: incoming-call { callType: 'video' }
```

### 3️⃣ Aceptar Llamada (Cualquier tipo)
```
Usuario B recibe incoming-call
  ↓
acceptCall()
  ↓
Lee callType de incomingCallData
  ↓
getUserMedia con restricciones según type
  ↓
Crea respuesta y conecta peer
```

## Características por Tipo de Llamada

| Característica | Llamada de Voz | Videollamada |
|---|---|---|
| **Audio** | ✅ Sí | ✅ Sí |
| **Video** | ❌ No | ✅ Sí |
| **Compartir Pantalla** | ✅ Sí | ❌ No |
| **Control de Cámara** | ❌ No | ✅ Sí |
| **Layout UI** | Icono de llamada | Dos videos (lado a lado) |

## Ventajas de este Diseño

1. **Simplicidad**: Cada tipo de llamada tiene su propio flujo claro
2. **Sin Conflictos de Refs**: No hay confusión entre elementos de video
3. **Mejor UX**: Usuario sabe qué esperar según tipo elegido
4. **Pantalla Compartida Dedicada**: Solo en llamadas de voz sin complejidad de video
5. **Mejores Restricciones**: Cada tipo solicita solo los permisos necesarios

## Testing Checklist

- [ ] Llamada de voz: Usuario A inicia, Usuario B acepta
- [ ] Videollamada: Usuario A inicia, Usuario B acepta
- [ ] Llamada de voz: Compartir pantalla funciona
- [ ] Llamada de voz: Detener compartir pantalla funciona
- [ ] Videollamada: Micrófono on/off funciona
- [ ] Videollamada: Cámara on/off funciona
- [ ] Modal muestra "Llamada de voz entrante" para voz
- [ ] Modal muestra "Videollamada entrante" para video
- [ ] Rechazar llamada funciona en ambos tipos
- [ ] Finalizar llamada funciona en ambos tipos

## Archivos Modificados

1. **`frontend/src/views/TicketDetail.vue`**
   - Variables ref
   - Función startCall(type)
   - Función acceptCall()
   - Función endCall()
   - Función startScreenShare()
   - Función stopScreenShare()
   - Handlers WebRTC (ontrack)
   - Template (botones, layouts, modal)

2. **`backend/server.js`**
   - Evento `call-offer`: Desestructurar y emitir callType
   - Logs mejorados para mostrar callType

## Notas Importantes

- El `callType` nunca debe ser `null` durante una llamada activa
- El socket.io debe retransmitir correctamente el `callType` a otros usuarios
- Los refs de video son condicionales en el DOM según el tipo de llamada
- `startScreenShare()` solo debe usarse cuando `callType === 'voice'`
- `toggleVideo()` solo es relevante para `callType === 'video'`
