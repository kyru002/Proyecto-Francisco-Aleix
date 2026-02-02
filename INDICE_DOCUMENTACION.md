# 📚 Índice de Documentación: Sistema de Videollamadas

## 📖 Documentación Disponible

### 🎯 Para Empezar Rápido
1. **[CAMBIOS_FINALES.md](CAMBIOS_FINALES.md)** ← **EMPIEZA AQUÍ**
   - Resumen ejecutivo de todos los cambios
   - Matriz de características
   - Validación de cambios
   - ~5 min de lectura

### 🔍 Documentación Detallada

2. **[RESUMEN_VIDEOLLAMADA_V2.md](RESUMEN_VIDEOLLAMADA_V2.md)**
   - Descripción general de la arquitectura
   - Cambios frontend y backend
   - Flujo de llamadas
   - Características por tipo
   - Testing checklist

3. **[DIAGRAMAS_FLUJO.md](DIAGRAMAS_FLUJO.md)**
   - Flujos visuales ASCII
   - Flujo completo de voz
   - Flujo completo de video
   - Flujo de screen sharing
   - Tablas comparativas

### 🧪 Testing

4. **[GUIA_PRUEBAS_LLAMADAS.md](GUIA_PRUEBAS_LLAMADAS.md)** ← **USA ESTO PARA TESTING**
   - Test 1: Llamada de Voz Básica
   - Test 2: Videollamada Básica
   - Test 3: Compartir Pantalla en Voz
   - Test 4: Rechazar Llamada
   - Test 5: Edge Cases
   - Checklist completo
   - Tips de debugging

### 📝 Documentación Antigua (Referencia)
5. IMPLEMENTACION_VIDEOLLAMADA.md - Versión anterior (solo referencia)
6. VIDEOLLAMADA_SETUP.md - Setup inicial (puede estar desactualizado)
7. README_VIDEOLLAMADA.md - Documentación inicial (puede estar desactualizado)

---

## 🗂️ Estructura de Carpetas

```
Proyecto-Francisco-Aleix/
├── backend/
│   ├── server.js ← MODIFICADO (call-offer con callType)
│   ├── database.js
│   ├── package.json
│   ├── models/
│   └── routes/
│
├── frontend/
│   ├── src/
│   │   ├── main.js
│   │   ├── App.vue
│   │   ├── views/
│   │   │   ├── TicketDetail.vue ← MODIFICADO (arquitectura de llamadas)
│   │   │   ├── Tickets.vue
│   │   │   ├── Technicians.vue
│   │   │   ├── Clients.vue
│   │   │   ├── Albaranes.vue
│   │   │   ├── Dashboard.vue
│   │   │   └── Login.vue
│   │   ├── stores/
│   │   │   └── appStore.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── components/
│   │   │   └── Sidebar.vue
│   │   └── assets/
│   │       └── main.css
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
│
├── DOCUMENTACION/
│   ├── CAMBIOS_FINALES.md ← LEER PRIMERO
│   ├── RESUMEN_VIDEOLLAMADA_V2.md
│   ├── DIAGRAMAS_FLUJO.md
│   ├── GUIA_PRUEBAS_LLAMADAS.md
│   ├── IMPLEMENTACION_ALBARANES.md
│   ├── NUEVA_FUNCIONALIDAD_TICKETS.md
│   └── [otros]
│
├── package.json (root)
├── start-app.sh
└── README.md
```

---

## 🚀 Flujo de Trabajo Recomendado

### Fase 1: Entender los Cambios
```
1. Lee CAMBIOS_FINALES.md (5 min)
2. Revisa DIAGRAMAS_FLUJO.md (10 min)
3. Examina el código en TicketDetail.vue y server.js (15 min)
```

### Fase 2: Preparar para Testing
```
1. Asegúrate que MongoDB está corriendo
2. Instala dependencias (si es necesario)
3. Inicia backend: npm run dev (backend/)
4. Inicia frontend: npm run dev (frontend/)
```

### Fase 3: Testing
```
1. Abre GUIA_PRUEBAS_LLAMADAS.md
2. Ejecuta Test 1: Llamada de Voz
3. Ejecuta Test 2: Videollamada
4. Ejecuta Test 3: Screen Sharing
5. Ejecuta Test 4: Rechazar
6. Ejecuta Test 5: Edge Cases
7. Completa el Checklist
```

### Fase 4: Deploy
```
1. Revisar variables de entorno
2. HTTPS configurado (para getDisplayMedia)
3. CORS restringido a dominio específico
4. Prueba en producción
```

---

## 📊 Resumen Técnico

### Cambios de Código

| Archivo | Cambios | Líneas | Impacto |
|---------|---------|--------|---------|
| `TicketDetail.vue` | Variables, funciones, template | ~100+ | Alto |
| `server.js` | Event handler `call-offer` | ~5 | Medio |
| **Total** | **2 archivos** | **~105** | **Crítico** |

### Variables Nuevas
- `callType` - ref que almacena 'voice' o 'video'

### Variables Modificadas
- `localVideoRef`, `remoteVideoRef` - Ahora condicionales
- `localScreenVideoRef` - Ahora solo para voz

### Funciones Modificadas
- `startCall(type)` - Nuevo parámetro `type`
- `acceptCall()` - Lee `callType` de `incomingCallData`
- `endCall()` - Resetea `callType`
- `ontrack` handlers - Condicionales según tipo

### Socket Events
- `call-offer` - Ahora incluye `callType`
- `incoming-call` - Ahora incluye `callType`
- Todos los demás: sin cambios

---

## ✅ Checklist Pre-Testing

### Backend
- [ ] MongoDB corriendo en localhost:27017
- [ ] Backend compilado sin errores
- [ ] server.js cargado correctamente
- [ ] Socket.io inicializado

### Frontend
- [ ] npm install completado (si es necesario)
- [ ] Frontend compilado sin errores
- [ ] Vite dev server corriendo en :5173
- [ ] Sin errores en DevTools

### Permisos
- [ ] Micrófono disponible en tu sistema
- [ ] Cámara disponible en tu sistema
- [ ] Screen sharing disponible (si es posible)

### Navegadores
- [ ] Chrome/Chromium instalado
- [ ] Firefox instalado (opcional pero recomendado)
- [ ] Dos navegadores/pestañas listas

### Red
- [ ] Dos usuarios en la misma red o localhost
- [ ] Firewall no bloquea WebSocket

---

## 🐛 Si Algo No Funciona

### Paso 1: Verificar Logs
```bash
# Terminal backend
# Busca: "📞 CALL-OFFER RECIBIDO"
# Busca: "Type: voice" o "Type: video"
```

### Paso 2: DevTools (F12)
```javascript
// Console
// Verifica socket.io conectado
// Busca errores en rojo
// Busca logs de videollamada
```

### Paso 3: Consulta Documentación
- GUIA_PRUEBAS_LLAMADAS.md → Debugging Tips
- DIAGRAMAS_FLUJO.md → Comprende el flujo

### Paso 4: Reinicia Todo
```bash
Ctrl+C en ambas terminales
npm run dev (backend)
npm run dev (frontend)
Recarga navegadores
```

---

## 📞 Matriz de Decisión Rápida

### "¿Debo leer documento X?"

| Quiero... | Lee | Duración |
|-----------|-----|----------|
| Entender qué cambió | CAMBIOS_FINALES.md | 5 min |
| Ver diagramas de flujo | DIAGRAMAS_FLUJO.md | 10 min |
| Probar la funcionalidad | GUIA_PRUEBAS_LLAMADAS.md | Variable |
| Implementar más features | RESUMEN_VIDEOLLAMADA_V2.md | 15 min |
| Debug un problema | GUIA_PRUEBAS_LLAMADAS.md (Debugging Tips) | Variable |

---

## 🎯 Objetivos Alcanzados

✅ Arquitectura simplificada (voz vs video)
✅ Sin conflictos de refs
✅ Mejor UX (usuario sabe qué esperar)
✅ Screen sharing solo en llamadas de voz
✅ Backend informa tipo de llamada
✅ Modal muestra tipo correcto
✅ Código validado sin errores
✅ Documentación completa

---

## 🔮 Próximas Mejoras (Futuro)

- [ ] Picture-in-Picture para video calls
- [ ] Indicador de latencia/conexión
- [ ] Grabar llamadas (si necesario)
- [ ] Estadísticas de llamadas
- [ ] Notificaciones desktop
- [ ] Integración con email
- [ ] Historial de llamadas

---

## 📞 Soporte

Si necesitas ayuda:

1. **Revisa GUIA_PRUEBAS_LLAMADAS.md** - 80% de los problemas se resuelven aquí
2. **Consulta DIAGRAMAS_FLUJO.md** - Entiende el flujo esperado
3. **Verifica logs** - Tanto backend como frontend
4. **Reinicia todo** - A veces es lo único necesario

---

## 📅 Historial de Documentos

| Documento | Creado | Estado | Propósito |
|-----------|--------|--------|----------|
| CAMBIOS_FINALES.md | 2024 | ✅ Actual | Resumen ejecutivo |
| RESUMEN_VIDEOLLAMADA_V2.md | 2024 | ✅ Actual | Documentación detallada |
| DIAGRAMAS_FLUJO.md | 2024 | ✅ Actual | Visualización |
| GUIA_PRUEBAS_LLAMADAS.md | 2024 | ✅ Actual | Testing |
| IMPLEMENTACION_VIDEOLLAMADA.md | Anterior | 📝 Referencia | Versión anterior |
| VIDEOLLAMADA_SETUP.md | Anterior | 📝 Referencia | Setup inicial |

---

**Última actualización:** 2024
**Status:** ✅ LISTO PARA TESTING
**Versión:** 2.0 - Arquitectura simplificada
