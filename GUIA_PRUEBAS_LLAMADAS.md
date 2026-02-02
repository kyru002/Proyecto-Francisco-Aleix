# 🧪 Guía de Pruebas: Llamadas de Voz vs Videollamadas

## Prerequisitos

1. **MongoDB** corriendo en `localhost:27017`
2. **Backend** corriendo en `localhost:5001`
3. **Frontend** corriendo en `localhost:5173`
4. **Dos navegadores/pestañas** o dos usuarios distintos (Usuario A y Usuario B)

## Pasos para Inicializar

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Abre dos navegadores:
# - Usuario A: http://localhost:5173/login
# - Usuario B: http://localhost:5173/login
```

---

## 🧪 Test 1: Llamada de Voz Básica

### Pasos

1. **Usuario A** navega a un ticket
2. **Usuario A** hace click en botón **"☎️ Llamada de voz"**
   - Debería ver: `Llamada de voz en curso` (con punto verde pulsante)
   - Debería pedir: Acceso a micrófono
   - Debería mostrar: Icono de teléfono + controles de micrófono y pantalla

3. **Usuario B** debería recibir modal:
   - Título: **"Llamada de voz entrante"**
   - Botones: "Aceptar" (verde) y "Rechazar" (rojo)

4. **Usuario B** hace click en **"Aceptar"**
   - Debería pedir: Acceso a micrófono
   - Debería conectar automáticamente

5. **Validar conexión:**
   - En consola del navegador (F12):
     - Usuario A: debería ver logs de `incoming-call` recibido
     - Usuario B: debería ver logs de `call-answered` recibido
   - Ambos pueden hablar por micrófono

6. **Usuario A** hace click en **"Finalizar llamada"**
   - Debería cerrar micrófono
   - Modal de Usuario B debería desaparecer

### ✅ Criterios de Éxito
- [x] Modal muestra "Llamada de voz entrante"
- [x] Solo se solicita micrófono (no cámara)
- [x] Ambos usuarios pueden comunicarse
- [x] Botón "Finalizar llamada" detiene todo

---

## 🧪 Test 2: Videollamada Básica

### Pasos

1. **Usuario A** navega a un ticket
2. **Usuario A** hace click en botón **"📹 Videollamada"**
   - Debería ver: `Videollamada en curso`
   - Debería pedir: Acceso a cámara Y micrófono
   - Debería mostrar: **Dos videos lado a lado** (local a la izquierda, remoto a la derecha)
   - Debería mostrar: Controles de micrófono, cámara y finalizar

3. **Usuario B** debería recibir modal:
   - Título: **"Videollamada entrante"**
   - Botones: "Aceptar" (verde) y "Rechazar" (rojo)

4. **Usuario B** hace click en **"Aceptar"**
   - Debería pedir: Acceso a cámara Y micrófono
   - Debería mostrar: **Dos videos**
   - El video remoto debería mostrar a Usuario A en tiempo real

5. **Validar conexión:**
   - Ambos videos deberían estar activos
   - Ambos pueden hablar
   - Ambos pueden verse

6. **Prueba de Controles:**
   - Usuario A hace click en **"Micrófono apagado"** → debería silenciarse
   - Usuario A hace click en **"Cámara apagada"** → debería mostrar video en negro
   - Usuario A hace click en **"Micrófono encendido"** → debería volver a activarse

7. **Usuario B** hace click en **"Finalizar llamada"**
   - Videos desaparecen
   - Modal se cierra automáticamente

### ✅ Criterios de Éxito
- [x] Modal muestra "Videollamada entrante"
- [x] Se solicita cámara Y micrófono (NO solo audio)
- [x] Dos videos visibles lado a lado
- [x] Ambos pueden verse en tiempo real
- [x] Controles de audio/video funcionan
- [x] Botón "Finalizar llamada" detiene todo

---

## 🧪 Test 3: Compartir Pantalla en Llamada de Voz

### Pasos

1. Ejecutar **Test 1** (Llamada de Voz Básica) hasta paso 5
2. **Usuario A** hace click en **"Compartir pantalla"**
   - Debería aparecer selector del SO para elegir qué compartir
   - Selecciona una ventana o toda la pantalla
   - Debería ver: Video con la pantalla compartida (reemplaza el icono de teléfono)
   - Debería ver: "Tu pantalla compartida" en esquina inferior izquierda
   - Botón cambia a **"Dejar de compartir"**

3. **Usuario B** debería ver:
   - La pantalla de Usuario A en tiempo real

4. **Usuario A** hace click en **"Dejar de compartir"**
   - Video de pantalla desaparece
   - Vuelve a mostrar: Icono de teléfono
   - Botón cambia de nuevo a **"Compartir pantalla"**

5. **Usuario A** hace click nuevamente en **"Compartir pantalla"**
   - Comparte una ventana DIFERENTE
   - Debería funcionar correctamente

6. Finalizar llamada

### ✅ Criterios de Éxito
- [x] Selector de pantalla aparece al hacer click
- [x] Pantalla compartida visible para ambos
- [x] Botón cambia entre "Compartir" y "Dejar de compartir"
- [x] Se puede compartir/dejar de compartir múltiples veces
- [x] Micrófono sigue funcionando durante compartición

### ⚠️ Notas Importantes
- **Compartir pantalla SOLO funciona en llamadas de voz**
- Si intentas hacerlo en videollamada, no debería aparecer el botón
- Compartir pantalla requiere HTTPS en producción (en desarrollo funciona con HTTP)

---

## 🧪 Test 4: Rechazar Llamada

### Pasos

1. **Usuario A** hace click en **"☎️ Llamada de voz"**
2. **Usuario B** recibe modal "Llamada de voz entrante"
3. **Usuario B** hace click en **"Rechazar"**
   - Modal desaparece
   - No debería pedir permisos de micrófono

4. **Usuario A** debería recibir algún tipo de notificación (verificar en consola)

### ✅ Criterios de Éxito
- [x] Rechazar cierra el modal
- [x] No se solicitan permisos al rechazar
- [x] Usuario A ve que fue rechazado

---

## 🧪 Test 5: Errores y Edge Cases

### Test 5a: Denegar Permisos

1. **Usuario A** hace click en **"📹 Videollamada"**
2. Navegador solicita permisos
3. **Usuario A** hace click en **"Bloquear"** (deny)
   - Debería mostrar alerta: "Error al iniciar llamada: Permission denied"
   - `inCall` debería ser `false`
   - Debería volver a permitir intentar

### Test 5b: Desconexión Durante Llamada

1. Establece una llamada (Test 1 o Test 2)
2. Usuario B cierra el navegador
   - Usuario A debería ver que la llamada se termina
   - Icono/videos deberían desaparecer
   - Debería verse log: "Usuario desconectado"

### Test 5c: Llamada Simultánea en Múltiples Tickets

1. **Usuario A** abre dos tickets en diferentes pestañas
2. En pestana 1: Hace click en "Llamada de voz"
3. Debería estar en llamada SOLO en esa pestaña
4. En pestaña 2: Debería permitir iniciar una NUEVA llamada (diferente room)

### ✅ Criterios de Éxito para Edge Cases
- [x] Errores de permisos muestran alerta clara
- [x] Desconexiones se manejan gracefully
- [x] Múltiples llamadas simultáneas funcionan (diferentes tickets)

---

## 📊 Checklist Completo

### Llamada de Voz
- [ ] Botón "Llamada de voz" visible cuando no hay llamada
- [ ] Solo solicita micrófono
- [ ] Modal entrante dice "Llamada de voz entrante"
- [ ] Puede compartir pantalla
- [ ] Pantalla se ve en ambos lados
- [ ] Micrófono on/off funciona
- [ ] Botón "Finalizar" detiene todo
- [ ] Rechazar funciona
- [ ] Desconexión maneja gracefully

### Videollamada
- [ ] Botón "Videollamada" visible cuando no hay llamada
- [ ] Solicita cámara Y micrófono
- [ ] Modal entrante dice "Videollamada entrante"
- [ ] Dos videos visibles lado a lado
- [ ] Video local muestra usuario A
- [ ] Video remoto muestra usuario B en tiempo real
- [ ] Micrófono on/off funciona
- [ ] Cámara on/off funciona
- [ ] NO hay botón de compartir pantalla
- [ ] Botón "Finalizar" detiene todo
- [ ] Rechazar funciona
- [ ] Desconexión maneja gracefully

### Sistema General
- [ ] Logs en consola son claros y útiles
- [ ] No hay errores en DevTools (F12)
- [ ] Responsive design funciona en móvil
- [ ] Múltiples llamadas simultáneas funcionan
- [ ] Socket.io se conecta correctamente

---

## 🐛 Debugging Tips

### Si algo no funciona:

1. **Abre la Consola del Navegador (F12)**
   - Mira los logs de Socket.io
   - Busca errores en rojo

2. **Verifica Server Logs (Terminal)**
   - Debería mostrar: `📞 CALL-OFFER RECIBIDO`
   - Debería mostrar: `Type: voice` o `Type: video`

3. **Prueba Permisos**
   - Chrome: 🔒 (candado) → Sitio → Micrófono/Cámara
   - Firefox: Similar en barra de direcciones

4. **Reinicia Todo**
   ```bash
   # Kill todos los procesos
   Ctrl+C en ambas terminales
   
   # Limpia cache
   npm run dev
   ```

5. **Revisa Network en DevTools**
   - Tab "Network" → Filter "websocket"
   - Debería ver conexión activa a `localhost:5001`

---

## 📋 Template de Reporte de Bug

Si algo no funciona, copia esto:

```markdown
## Bug: [Nombre corto]

**Tipo de Llamada:** [ ] Voz [ ] Video

**Pasos para Reproducir:**
1. 
2. 
3. 

**Comportamiento Esperado:**

**Comportamiento Real:**

**Console Logs:**
```
[pega aquí logs de F12]
```

**Server Logs:**
```
[pega aquí logs de terminal]
```

**Sistema:**
- OS: macOS / Windows / Linux
- Navegador: Chrome / Firefox / Safari
```

---

## 🎉 Si Todo Funciona

¡Excelente! Tu sistema de videollamadas está completamente operativo.

Puedes proceder a:
1. Hacer deploy en producción
2. Crear más features (grabación de llamadas, etc.)
3. Optimizar UX/UI
4. Agregar analíticas
