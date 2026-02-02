# 🚀 Guía Rápida: Inicio en 5 Minutos

> ⏱️ Esta guía te lleva de 0 a 100 en 5 minutos

---

## 📋 TL;DR - Lo Más Importante

**Se hicieron cambios importantes en el sistema de videollamadas:**

- ✅ Ahora hay DOS tipos de llamadas: **Voz** ☎️ y **Video** 📹
- ✅ Llamada de voz: Solo audio + puedes compartir pantalla
- ✅ Videollamada: Video + audio, sin compartir pantalla
- ✅ El backend ahora comunica el tipo de llamada
- ✅ El modal muestra qué tipo de llamada es

**Archivos modificados:** 2
- `frontend/src/views/TicketDetail.vue`
- `backend/server.js`

---

## 🏃 Paso 1: Iniciar (1 min)

### Terminal 1: Backend
```bash
cd backend
npm run dev
```
Deberías ver:
```
Servidor ejecutándose en http://localhost:5001
WebSocket disponible en ws://localhost:5001
```

### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```
Deberías ver:
```
Local: http://localhost:5173
```

---

## 🌐 Paso 2: Abrir Navegadores (1 min)

1. Abre `http://localhost:5173/login` en dos navegadores/pestañas
2. **Usuario A:** Inicia sesión
3. **Usuario B:** Inicia sesión (en otra pestaña/navegador)

---

## 🧪 Paso 3: Probar (3 min)

### Test 1: Llamada de Voz (1 min)
```
Usuario A:
  1. Navega a un ticket
  2. Hace click en "☎️ Llamada de voz"
  3. Permite acceso a micrófono
  4. Ve: Icono de teléfono + botón "Compartir pantalla"

Usuario B:
  5. Recibe modal: "Llamada de voz entrante"
  6. Hace click "Aceptar"
  7. Permite acceso a micrófono
  8. Pueden hablar ✅
```

### Test 2: Videollamada (1 min)
```
Usuario A:
  1. Navega a un ticket diferente
  2. Hace click en "📹 Videollamada"
  3. Permite acceso a cámara + micrófono
  4. Ve: 2 videos lado a lado

Usuario B:
  5. Recibe modal: "Videollamada entrante"
  6. Hace click "Aceptar"
  7. Permite acceso a cámara + micrófono
  8. Ambos se ven y pueden hablar ✅
```

### Test 3: Screen Sharing en Voz (1 min)
```
En la llamada de voz (del Test 1):

Usuario A:
  1. Hace click "Compartir pantalla"
  2. Selecciona una ventana en el selector
  3. Ve: Video de su pantalla
  4. Botón cambia a "Dejar de compartir"

Usuario B:
  5. Ve la pantalla de Usuario A ✅
```

---

## ✅ Si Todo Funciona

🎉 ¡Excelente! Tu sistema está 100% operativo.

### Próximos Pasos:
1. Leer [CAMBIOS_FINALES.md](CAMBIOS_FINALES.md) (5 min) - Comprende los cambios
2. Leer [GUIA_PRUEBAS_LLAMADAS.md](GUIA_PRUEBAS_LLAMADAS.md) (15 min) - Tests más completos
3. Hacer deploy a producción

---

## ❌ Si Algo No Funciona

### Problema 1: "No me deja hacer click en botones de llamada"
```
✓ Verifica: ¿Estás dentro de un ticket? 
  (debes estar en /tickets/:id)
✓ Abre DevTools (F12) → Console
✓ Busca errores en rojo
```

### Problema 2: "Veo modal pero sin video"
```
✓ Verifica permisos: 🔒 → Sitio → Cámara/Micrófono
✓ Asegúrate que otro navegador está en el mismo ticket
✓ Busca "CALL-OFFER RECIBIDO" en logs del servidor
```

### Problema 3: "Backend no inicia"
```bash
# Verifica MongoDB
mongod --version  # Debe mostrar versión

# Verifica puerto 5001 no está en uso
lsof -i :5001  # Si muestra algo, ciérralo

# Limpia e intenta de nuevo
npm install
npm run dev
```

### Problema 4: "Frontend no carga"
```bash
# Verifica puerto 5173 no está en uso
lsof -i :5173

# Limpia e intenta
npm install
npm run dev
```

---

## 📊 Referencia Rápida

### Nuevas Variables en TicketDetail.vue
```javascript
const callType = ref(null)  // 'voice' o 'video'
```

### Nuevos Parámetros en Funciones
```javascript
startCall('voice')   // Llamada de voz
startCall('video')   // Videollamada
```

### Nuevas Restricciones
```javascript
// Voz
{ audio: true, video: false }

// Video
{ video: { width: {...}, height: {...} }, audio: true }
```

---

## 🎯 Checklist Rápido

- [ ] Backend corriendo en :5001
- [ ] Frontend corriendo en :5173
- [ ] Dos navegadores con sesión iniciada
- [ ] Test 1: Llamada de voz funciona
- [ ] Test 2: Videollamada funciona
- [ ] Test 3: Screen sharing funciona
- [ ] Modal muestra tipo correcto
- [ ] Botón finalizar cierra llamada

---

## 📚 Documentación Completa

| Quiero... | Leo | Tiempo |
|-----------|-----|--------|
| Entender los cambios | [CAMBIOS_FINALES.md](CAMBIOS_FINALES.md) | 5 min |
| Ver diagramas | [DIAGRAMAS_FLUJO.md](DIAGRAMAS_FLUJO.md) | 10 min |
| Tests completos | [GUIA_PRUEBAS_LLAMADAS.md](GUIA_PRUEBAS_LLAMADAS.md) | 30 min |
| Índice completo | [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md) | 5 min |

---

## 🔧 Comandos Útiles

```bash
# Backend
cd backend
npm run dev                    # Inicia dev server
npm run dev > logs.txt         # Guarda logs en archivo

# Frontend  
cd frontend
npm run dev                    # Inicia dev server
npm run build                  # Build producción

# Debugging
# Chrome DevTools
F12  # Abre DevTools
Ctrl+Shift+J  # Abre Console
Ctrl+Shift+K  # Abre Network

# Logs del servidor
tail -f logs.txt  # Si guardaste con >

# Verificar puertos
lsof -i :5001    # Backend
lsof -i :5173    # Frontend
```

---

## 🎮 Atajos Útiles Durante Testing

| Acción | Atajo |
|--------|-------|
| Abrir DevTools | F12 |
| Console | F12 → Console |
| Network | F12 → Network |
| Local Storage | F12 → Application → Local Storage |
| Recargar página | F5 o Ctrl+R |
| Hard reload | Ctrl+Shift+R |
| Cerrar DevTools | F12 |

---

## 💡 Tips Importantes

1. **No uses la misma pestaña/ventana para dos usuarios**
   - Siempre abre una pestaña NUEVA o diferente navegador
   
2. **Los usuarios deben estar en el MISMO ticket**
   - Ambos en /tickets/:mismo-id
   
3. **Los tickets deben tener un ID válido**
   - Crea tickets primero, luego prueba llamadas
   
4. **Permisos son locales**
   - Si denías micrófono/cámara, se te pedirá de nuevo
   - Browser settings → Privacy → Sitio → Reset permissions
   
5. **Screen sharing solo en Linux/Mac con HTTPS**
   - En localhost (HTTP) puede funcionar en algunos navegadores
   - Chrome está siendo cada vez más restrictivo

---

## 🚀 Si Todo Está Bien, Siguiente Paso

Hacer deploy en producción:

1. Configura HTTPS (para getDisplayMedia)
2. Cambia CORS en server.js de `"*"` a tu dominio
3. Configura base URLs en api.js
4. Deploy backend
5. Deploy frontend (build)
6. Prueba en producción

---

## 📞 Contacto/Soporte

Si necesitas más ayuda:
1. Consulta [GUIA_PRUEBAS_LLAMADAS.md](GUIA_PRUEBAS_LLAMADAS.md) → Debugging Tips
2. Abre DevTools (F12) y busca errores
3. Revisa logs del servidor
4. Intenta hard reload: Ctrl+Shift+R

---

**¡Eso es todo!** 🎉

En 5 minutos deberías tener el sistema funcionando completamente.

Si no, la mayoría de problemas se resuelven con:
1. Reiniciar backend/frontend
2. Hard reload del navegador
3. Buscar errores en DevTools y logs

¡Buena suerte! 🚀
