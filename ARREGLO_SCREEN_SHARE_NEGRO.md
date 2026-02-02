# Arreglo: Pantalla Compartida Aparece Negra en el Receptor

## Problema
Cuando un usuario comparte su pantalla en una llamada de voz, la otra persona solo ve una pantalla negra en lugar del contenido compartido.

## Causa Raíz
El problema tenía múltiples causas:

1. **Track de pantalla no se agregaba correctamente**: Se estaba usando `peerConnection.value.addTrack(screenTrack, localStream.value)` lo cual es incorrecto. El track de pantalla debe agregarse a su **propio MediaStream separado**, no al stream local de la cámara/micrófono.

2. **Falta de renegociación WebRTC**: Cuando se agregaba un nuevo track a la conexión peer, los cambios no se comunicaban al receptor porque no se estaba haciendo una renegociación (crear una nueva oferta y establecer una nueva descripción).

3. **Diferenciación incorrecta entre eventos**: El servidor estaba tratando todas las ofertas igual, cuando debería haber dos tipos:
   - `incoming-call`: Para INICIAR una nueva llamada
   - `call-offer`: Para RENEGOCIAR una llamada existente (ej: agregar screen share)

4. **Timing del DOM**: El elemento video remoto (`remoteScreenVideoRef`) podría no estar renderizado cuando se intentaba asignar el srcObject, causando que el ref fuera null.

## Cambios Realizados

### 1. **TicketDetail.vue - Función `startScreenShare()`**
```javascript
// ANTES (incorrecto):
peerConnection.value.addTrack(screenTrack, localStream.value);

// DESPUÉS (correcto):
const screenMediaStream = new MediaStream();
screenMediaStream.addTrack(screenTrack);
peerConnection.value.addTrack(screenTrack, screenMediaStream);

// Y luego hacer renegociación:
const newOffer = await peerConnection.value.createOffer();
await peerConnection.value.setLocalDescription(newOffer);
socket.value.emit('call-offer', {
  ticketId: route.params.id,
  offer: newOffer,
  callerName: store.currentUser?.name || 'Usuario',
  callType: callType.value
});
```

**Motivo**: El track de pantalla debe estar en su propio MediaStream para que sea enviado como un stream separado. La renegociación permite que el receptor procese el nuevo track.

### 2. **TicketDetail.vue - Socket Listeners**

#### Nuevo: `incoming-call`
Para nuevas llamadas (antes era `call-offer`):
```javascript
socket.value.on('incoming-call', async (data) => {
  // Solo mostrar modal si no hay una llamada en curso
  if (!inCall.value) {
    incomingCallData.value = data;
    showIncomingCall.value = true;
  }
});
```

#### Nuevo: `call-offer` en listener
Para renegociaciones (cuando ya hay una llamada en curso):
```javascript
socket.value.on('call-offer', async (data) => {
  if (inCall.value && peerConnection.value) {
    // Procesar como renegotiación
    await peerConnection.value.setRemoteDescription(new RTCSessionDescription(data.offer));
    const answer = await peerConnection.value.createAnswer();
    await peerConnection.value.setLocalDescription(answer);
    socket.value.emit('call-answer', {
      ticketId: route.params.id,
      answer: answer,
      to: data.from || remoteUserId.value
    });
  }
});
```

### 3. **TicketDetail.vue - Función `startCall()`**
```javascript
// ANTES: socket.value.emit('call-offer', {...})
// DESPUÉS: socket.value.emit('incoming-call', {...})

// Ahora `incoming-call` es para iniciar nuevas llamadas
// Y `call-offer` es para renegociaciones (screen share, cambios de tracks, etc)
```

### 4. **server.js - Manejo de eventos**
Ahora hay DOS eventos separados:

```javascript
// Nueva llamada
socket.on("incoming-call", (data) => {
  socket.broadcast.to(room).emit("incoming-call", {
    from: socket.id,
    offer: offer,
    // ...
  });
});

// Renegociación
socket.on("call-offer", (data) => {
  socket.broadcast.to(room).emit("call-offer", {
    from: socket.id,
    offer: offer,
    // ...
  });
});
```

**Motivo**: El servidor debe diferenciar entre iniciar una llamada y renegociar una existente para que los receptores procesen correctamente.

### 5. **TicketDetail.vue - Asignación de srcObject**
```javascript
// ANTES: nextTick(() => { ... })
// DESPUÉS: setTimeout(() => { ... }, 0)

// Razón: setTimeout es más fiable para asegurar que el DOM esté completamente actualizado
```

Cambio en dos lugares (startCall y acceptCall) donde se reciben tracks de pantalla remota.

## Flujo Correcto Ahora

### Iniciar una llamada:
1. Usuario A llama a Usuario B
2. A emite `incoming-call` con oferta
3. B recibe `incoming-call` y muestra modal
4. B acepta y emite `call-answer`
5. ✅ Llamada establecida

### Compartir pantalla:
1. Usuario A está en llamada con B
2. A presiona "Compartir pantalla"
3. A crea nuevo MediaStream con el track de pantalla
4. A emite `call-offer` con nueva oferta (renegociación)
5. B recibe `call-offer` (NO muestra modal porque ya está en llamada)
6. B procesa la renegociación automáticamente
7. B recibe el track de pantalla en `ontrack`
8. ✅ Pantalla compartida visible en B

## Testing
Para verificar que funciona:
1. Inicia dos sesiones en navegadores diferentes
2. Establece una llamada de voz
3. Presiona "Compartir pantalla" en una de las sesiones
4. En la otra sesión, debería ver la pantalla compartida (NO negra)

## Archivos Modificados
- `/backend/server.js`
- `/frontend/src/views/TicketDetail.vue`
