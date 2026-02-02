# 📝 Cambios Detallados: Línea por Línea

> Este documento lista EXACTAMENTE qué se cambió en cada archivo

---

## 📁 Archivo 1: `frontend/src/views/TicketDetail.vue`

### Cambios en Import
**Línea ~10-40 (Script Setup - Imports)**

✅ Se agregó: Icon `Monitor` para pantalla compartida
```javascript
import { Monitor } from 'lucide-vue-next';
```

**Ubicación en template:** Ya estaba presente, se usó en los botones

---

### Cambios en Variables Ref

**Línea ~80-85 (Declaración de refs)**

❌ ANTES: No existía
```javascript
// No había callType
```

✅ DESPUÉS: 
```javascript
const callType = ref(null); // 'voice' o 'video'
```

---

### Cambios en Función `startCall()`

**Línea ~185-240 (Función completa rediseñada)**

❌ ANTES:
```javascript
const startCall = async () => {
  try {
    inCall.value = true;
    
    const constraints = { 
      video: { width: { min: 640, ideal: 1280, max: 1920 }, height: { min: 480, ideal: 720, max: 1080 } }, 
      audio: true 
    };
    
    localStream.value = await navigator.mediaDevices.getUserMedia(constraints);

    if (localVideoRef.value) {
      localVideoRef.value.srcObject = localStream.value;
      localVideoRef.value.play().catch(e => console.error('Error al reproducir:', e));
    }

    peerConnection.value = new RTCPeerConnection({ iceServers: peerConfig.iceServers });
    
    localStream.value.getTracks().forEach(track => {
      peerConnection.value.addTrack(track, localStream.value);
    });

    socket.value.emit('call-offer', {
      ticketId: route.params.id,
      offer: offer,
      callerName: store.currentUser?.name || 'Usuario',
      // No incluía callType
    });
  } catch (err) {
    inCall.value = false;
    alert('Error al iniciar llamada: ' + err.message);
  }
};
```

✅ DESPUÉS:
```javascript
const startCall = async (type) => {  // ← NUEVO: parámetro type
  try {
    callType.value = type;  // ← NUEVO: almacenar tipo
    inCall.value = true;
    callInProgress.value = true;
    
    await nextTick();
    
    const constraints = type === 'voice'  // ← NUEVO: restricciones dinámicas
      ? { audio: true, video: false }
      : { video: { width: { min: 640, ideal: 1280, max: 1920 }, height: { min: 480, ideal: 720, max: 1080 } }, audio: true };
    
    localStream.value = await navigator.mediaDevices.getUserMedia(constraints);

    if (type === 'video' && localVideoRef.value) {  // ← NUEVO: condicional
      localVideoRef.value.srcObject = localStream.value;
      localVideoRef.value.play().catch(e => console.error('Error al reproducir:', e));
    }

    peerConnection.value = new RTCPeerConnection({ iceServers: peerConfig.iceServers });

    localStream.value.getTracks().forEach(track => {
      peerConnection.value.addTrack(track, localStream.value);
    });

    peerConnection.value.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        remoteStream.value = event.streams[0];
        
        if (callType.value === 'video' && remoteVideoRef.value) {  // ← NUEVO: solo para video
          remoteVideoRef.value.srcObject = remoteStream.value;
          setTimeout(() => {
            remoteVideoRef.value?.play().catch(e => console.error('Error al reproducir video remoto:', e));
          }, 100);
        }
      }
    };

    peerConnection.value.onicecandidate = (event) => {
      if (event.candidate && socket.value) {
        socket.value.emit('ice-candidate', {
          ticketId: route.params.id,
          candidate: event.candidate,
          to: remoteUserId.value
        });
      }
    };

    const offer = await peerConnection.value.createOffer();
    await peerConnection.value.setLocalDescription(offer);

    socket.value.emit('call-offer', {
      ticketId: route.params.id,
      offer: offer,
      callerName: store.currentUser?.name || 'Usuario',
      callType: type  // ← NUEVO: incluir tipo
    });

  } catch (err) {
    inCall.value = false;
    callInProgress.value = false;
    alert('Error al iniciar llamada: ' + err.message);
  }
};
```

---

### Cambios en Función `acceptCall()`

**Línea ~280-350 (Función rediseñada)**

❌ ANTES:
```javascript
const acceptCall = async () => {
  try {
    // ...asumía videollamada...
    const constraints = { 
      video: { width: { min: 640, ideal: 1280, max: 1920 }, height: { min: 480, ideal: 720, max: 1080 } }, 
      audio: true 
    };
  } catch (err) {
    // ...
  }
};
```

✅ DESPUÉS:
```javascript
const acceptCall = async () => {
  try {
    callType.value = incomingCallData.value.callType || 'video';  // ← NUEVO: leer tipo
    // ...rest igual...
    const constraints = callType.value === 'voice'  // ← NUEVO: dinámico
      ? { audio: true, video: false }
      : { video: { width: {...}, height: {...} }, audio: true };
    // ...resto del código...
  } catch (err) {
    inCall.value = false;
    callInProgress.value = false;
    alert('Error al aceptar llamada: ' + err.message);
  }
};
```

---

### Cambios en Función `endCall()`

**Línea ~400-420 (Función mejorada)**

❌ ANTES:
```javascript
const endCall = () => {
  // ... limpiar streams ...
  
  inCall.value = false;
  callInProgress.value = false;
  localStream.value = null;
  remoteStream.value = null;
  peerConnection.value = null;
  remoteUserId.value = null;
};
```

✅ DESPUÉS:
```javascript
const endCall = () => {
  if (remoteUserId.value && socket.value) {
    socket.value.emit('end-call', {
      ticketId: route.params.id,
      to: remoteUserId.value
    });
  }

  if (isSharingScreen.value && screenStream.value) {
    screenStream.value.getTracks().forEach(track => track.stop());
    screenStream.value = null;
    isSharingScreen.value = false;
  }

  if (localStream.value) {
    localStream.value.getTracks().forEach(track => track.stop());
  }

  if (peerConnection.value) {
    peerConnection.value.close();
  }

  inCall.value = false;
  callInProgress.value = false;
  callType.value = null;  // ← NUEVO: resetear tipo
  isSharingScreen.value = false;  // ← NUEVO: resetear pantalla
  localStream.value = null;
  remoteStream.value = null;
  peerConnection.value = null;
  remoteUserId.value = null;
  isMuted.value = false;
  isVideoOff.value = false;
};
```

---

### Cambios en Template: Botones de Llamada

**Línea ~660-680 (Card Header con botones)**

❌ ANTES:
```html
<button 
  @click="startCall()" 
  class="btn btn-primary"
  style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;"
>
  <Video style="width: 18px; height: 18px;" />
  Videollamada
</button>
```

✅ DESPUÉS:
```html
<button 
  v-if="!callInProgress && !inCall" 
  @click="startCall('voice')" 
  class="btn btn-primary"
  style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;"
>
  <Phone style="width: 18px; height: 18px;" />
  Llamada de voz
</button>
<button 
  v-if="!callInProgress && !inCall" 
  @click="startCall('video')" 
  class="btn btn-primary"
  style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 1rem;"
>
  <Video style="width: 18px; height: 18px;" />
  Videollamada
</button>
```

---

### Cambios en Template: Indicador de Estado

**Línea ~690-700 (Dentro del header)**

❌ ANTES:
```html
<span v-if="inCall" style="color: #10b981; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
  <div style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
  En llamada
</span>
```

✅ DESPUÉS:
```html
<span v-if="inCall" style="color: #10b981; font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
  <div style="width: 8px; height: 8px; background-color: #10b981; border-radius: 50%; animation: pulse 2s infinite;"></div>
  {{ callType === 'voice' ? 'Llamada de voz' : 'Videollamada' }} en curso
</span>
```

---

### Cambios en Template: Video Container (MAYOR CAMBIO)

**Línea ~720-850 (Toda la sección de video rediseñada)**

❌ ANTES: Un solo layout que intentaba hacer todo
```html
<div v-if="inCall" class="video-container">
  <!-- intentaba video + screen sharing -->
</div>
```

✅ DESPUÉS: Dos layouts condicionales
```html
<div v-if="inCall" class="video-container">
  <!-- Indicador de screen sharing (solo voz) -->
  <div v-if="callType === 'voice' && isSharingScreen" style="...">
    <Monitor /> Estás compartiendo tu pantalla
  </div>

  <!-- Layout para Videollamada -->
  <div v-if="callType === 'video'" style="...">
    <div style="..."> <!-- Video Local -->
      <video ref="localVideoRef" autoplay playsinline muted></video>
    </div>
    <div style="..."> <!-- Video Remoto -->
      <video ref="remoteVideoRef" autoplay playsinline muted></video>
    </div>
  </div>

  <!-- Layout para Llamada de Voz -->
  <div v-else-if="callType === 'voice'">
    <div v-if="isSharingScreen">
      <video ref="localScreenVideoRef" autoplay playsinline muted></video>
    </div>
    <div v-else>
      <Phone /> Llamada de voz en curso
      <button @click="startScreenShare()">Compartir pantalla</button>
    </div>
  </div>

  <!-- Controles dinámicos -->
  <div style="...">
    <!-- Videollamada: Micrófono, Cámara, End -->
    <button v-if="callType === 'video'" @click="toggleMute()">Micrófono</button>
    <button v-if="callType === 'video'" @click="toggleVideo()">Cámara</button>
    
    <!-- Llamada Voz: Micrófono, Screen, End -->
    <button v-if="callType === 'voice'" @click="toggleMute()">Micrófono</button>
    <button v-if="callType === 'voice'" @click="startScreenShare()">Compartir pantalla</button>
    
    <!-- Ambos: End -->
    <button @click="endCall()">Finalizar</button>
  </div>
</div>
```

---

### Cambios en Modal de Llamada Entrante

**Línea ~970-980 (Modal title)**

❌ ANTES:
```html
<h3 style="margin-top: 0; margin-bottom: 0.5rem;">Videollamada entrante</h3>
```

✅ DESPUÉS:
```html
<h3 style="margin-top: 0; margin-bottom: 0.5rem;">{{ incomingCallData?.callType === 'voice' ? 'Llamada de voz entrante' : 'Videollamada entrante' }}</h3>
```

---

## 📁 Archivo 2: `backend/server.js`

### Cambios en Evento `call-offer`

**Línea ~55-90 (Event handler completo)**

❌ ANTES:
```javascript
socket.on("call-offer", (data) => {
  const { ticketId, offer, callerName } = data;  // ← Sin callType
  const room = `ticket-${ticketId}`;
  console.log(`\n📞 CALL-OFFER RECIBIDO`);
  console.log(`   Caller: ${callerName}`);
  // ... sin información de Type ...
  
  console.log(`   📤 Emitiendo 'incoming-call' a otros...`);
  socket.broadcast.to(room).emit("incoming-call", {
    from: socket.id,
    callerName: callerName,
    offer: offer
    // ← Sin callType
  });
});
```

✅ DESPUÉS:
```javascript
socket.on("call-offer", (data) => {
  const { ticketId, offer, callerName, callType } = data;  // ← NUEVO: callType
  const room = `ticket-${ticketId}`;
  console.log(`\n📞 CALL-OFFER RECIBIDO`);
  console.log(`   Caller: ${callerName}`);
  console.log(`   Type: ${callType}`);  // ← NUEVO: log de tipo
  console.log(`   Room: ${room}`);
  console.log(`   Socket ID: ${socket.id}`);
  
  // ... resto igual ...
  
  console.log(`   📤 Emitiendo 'incoming-call' a otros...`);
  socket.broadcast.to(room).emit("incoming-call", {
    from: socket.id,
    callerName: callerName,
    callType: callType,  // ← NUEVO: retransmitir tipo
    offer: offer
  });
  
  console.log(`   ✅ Evento emitido\n`);
});
```

---

## 📊 Resumen de Cambios

### Adiciones
| Tipo | Cantidad |
|------|----------|
| Variables nuevas | 1 |
| Funciones modificadas | 3 |
| Template sections nuevas | 2 |
| Condicionales dinámicas | ~10 |
| Backend changes | 1 evento |

### Líneas Modificadas
- `TicketDetail.vue`: ~100+ líneas
- `server.js`: ~5 líneas

### Impacto
- ✅ Arquitectura completamente rediseñada
- ✅ Sin breaking changes en otros archivos
- ✅ Backward compatible con socket events

---

## 🔍 Validación de Cambios

### Variables Nuevas
```javascript
const callType = ref(null)  // ✅ Definida
```

### Usos de callType
```javascript
callType.value = type          // ✅ Asignado en startCall()
callType.value = incomingCallData.value.callType  // ✅ Leído en acceptCall()
if (callType.value === 'video')  // ✅ Usado en condicionales
callType.value = null          // ✅ Resetado en endCall()
{{ callType === 'voice' ? ... }} // ✅ Usado en template
```

### Socket Events
```javascript
socket.value.emit('call-offer', { ..., callType: type })  // ✅ Enviado
socket.broadcast.to(room).emit("incoming-call", { ..., callType })  // ✅ Retransmitido
incomingCallData.value = data  // ✅ Recibido y almacenado
```

---

## ✅ Checklist de Validación

- [x] callType variable declarada
- [x] startCall() tiene parámetro type
- [x] acceptCall() lee callType
- [x] endCall() resetea callType
- [x] getUserMedia dinámico según tipo
- [x] Template tiene dos layouts
- [x] Botones muestran ambos tipos
- [x] Modal muestra tipo dinámicamente
- [x] Backend retransmite callType
- [x] Controles son dinámicos
- [x] Sin errores de sintaxis

---

