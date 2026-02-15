# 📚 Índice de Documentación - SupportDesk

Bienvenido a la documentación completa del sistema SupportDesk. Aquí encontrarás toda la información necesaria para instalar, configurar, desarrollar y desplegar la aplicación.

---

## 🚀 Empezar

**Nuevo en el proyecto?** Empieza aquí:

1. [README principal](../README.md) - Visión general y quickstart
2. [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md) - Arquitectura completa
3. [COMO_INSTALAR_PWA.md](COMO_INSTALAR_PWA.md) - Instalar en móvil

---

## 📖 Guías por Rol

### 👨‍💼 Usuario Final
- **[COMO_INSTALAR_PWA.md](COMO_INSTALAR_PWA.md)** - Cómo instalar la app en tu móvil (Android/iOS)
  - Instalación paso a paso
  - Troubleshooting común
  - Ventajas de la PWA

### 👨‍💻 Desarrollador
- **[DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md)** - Documentación técnica completa
  - Arquitectura del sistema
  - Modelos de datos (MongoDB schemas)
  - API endpoints documentados
  - Flujos WebRTC y Socket.io
  - Stack tecnológico
  
- **[GUIA_PWA.md](GUIA_PWA.md)** - Configuración técnica de la PWA
  - vite-plugin-pwa setup
  - Service Workers
  - Manifest.json
  - Caché strategies

### 🚀 DevOps / Deployment
- **[DEPLOY.md](DEPLOY.md)** - Guía de deployment
  - Vercel deployment
  - Netlify deployment
  - Docker setup
  - Variables de entorno
  - MongoDB Atlas

- **[README-DEPLOY.md](README-DEPLOY.md)** - Deployment alternativo
  - PM2 configuration
  - Nginx reverse proxy
  - SSL/HTTPS setup

---

## 🗂️ Documentos por Contenido

### Instalación & Setup
- [README.md](../README.md#-inicio-rápido) - Instalación local
- [README.md](../README.md#-usuarios-de-prueba) - Credenciales de prueba
- [DEPLOY.md](DEPLOY.md#variables-de-entorno) - Variables de entorno

### Arquitectura
- [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md#-arquitectura-del-sistema) - Diagrama general
- [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md#-modelos-de-datos) - Schemas MongoDB
- [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md#-api-rest-endpoints) - API Reference

### Funcionalidades
- [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md#-sistema-de-tickets) - Gestión de tickets
- [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md#-videollamadas-webrtc) - WebRTC setup
- [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md#-chat-en-tiempo-real) - Socket.io chat
- [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md#-gesti%C3%B3n-de-albaranes) - Albaranes/facturas

### PWA & Mobile
- [COMO_INSTALAR_PWA.md](COMO_INSTALAR_PWA.md) - Instalación móvil
- [GUIA_PWA.md](GUIA_PWA.md#-configuraci%C3%B3n-pwa) - Config técnica
- [README.md](../README.md#-instalar-como-pwa-app-m%C3%B3vil) - Quick guide

### Deployment
- [DEPLOY.md](DEPLOY.md) - Deployment completo
- [README-DEPLOY.md](README-DEPLOY.md) - Deploy con PM2
- [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md#-deployment-en-producci%C3%B3n) - Consideraciones

---

## 🔍 Buscar por Tema

### Autenticación & Seguridad
- [JWT Setup](DOCUMENTACION_SISTEMA.md#autenticaci%C3%B3n-jwt)
- [Roles y Permisos](DOCUMENTACION_SISTEMA.md#sistema-de-roles)
- [Middleware de Auth](DOCUMENTACION_SISTEMA.md#middleware)

### Base de Datos
- [MongoDB Connection](DOCUMENTACION_SISTEMA.md#conexi%C3%B3n-mongodb)
- [Schemas](DOCUMENTACION_SISTEMA.md#-modelos-de-datos)
- [Seeding Data](DOCUMENTACION_SISTEMA.md#datos-de-prueba)

### Frontend
- [Vue 3 Setup](DOCUMENTACION_SISTEMA.md#frontend-vue-3)
- [Pinia Store](DOCUMENTACION_SISTEMA.md#state-management)
- [Vue Router](DOCUMENTACION_SISTEMA.md#routing)
- [Componentes](frontend/README.md)

### Backend
- [Express Setup](DOCUMENTACION_SISTEMA.md#backend-express)
- [Rutas API](DOCUMENTACION_SISTEMA.md#-api-rest-endpoints)
- [Socket.io](DOCUMENTACION_SISTEMA.md#-chat-en-tiempo-real)

### Real-time Features
- [WebRTC](DOCUMENTACION_SISTEMA.md#-videollamadas-webrtc)
- [Socket.io Events](DOCUMENTACION_SISTEMA.md#eventos-socketio)
- [Llamadas P2P](DOCUMENTACION_SISTEMA.md#flujo-de-videollamada)

---

## 📊 Resumen de Documentos

| Documento | Páginas | Audiencia | Nivel |
|-----------|---------|-----------|-------|
| [README.md](../README.md) | Corto | Todos | Básico |
| [DOCUMENTACION_SISTEMA.md](DOCUMENTACION_SISTEMA.md) | Largo | Desarrolladores | Avanzado |
| [COMO_INSTALAR_PWA.md](COMO_INSTALAR_PWA.md) | Medio | Usuarios finales | Básico |
| [GUIA_PWA.md](GUIA_PWA.md) | Medio | Desarrolladores | Intermedio |
| [DEPLOY.md](DEPLOY.md) | Medio | DevOps | Avanzado |
| [README-DEPLOY.md](README-DEPLOY.md) | Corto | DevOps | Intermedio |

---

## 🆘 Ayuda Rápida

### "¿Cómo instalo el proyecto?"
→ [README.md - Inicio Rápido](../README.md#-inicio-rápido)

### "¿Cómo instalo en mi móvil?"
→ [COMO_INSTALAR_PWA.md](COMO_INSTALAR_PWA.md)

### "¿Cómo funciona la arquitectura?"
→ [DOCUMENTACION_SISTEMA.md - Arquitectura](DOCUMENTACION_SISTEMA.md#-arquitectura-del-sistema)

### "¿Qué endpoints tiene la API?"
→ [DOCUMENTACION_SISTEMA.md - API](DOCUMENTACION_SISTEMA.md#-api-rest-endpoints)

### "¿Cómo despliego en producción?"
→ [DEPLOY.md](DEPLOY.md)

### "No me funciona X cosa"
→ [README.md - Troubleshooting](../README.md#-solución-de-problemas)

---

## 🔗 Enlaces Rápidos

- **GitHub:** https://github.com/kyru002/Proyecto-Francisco-Aleix
- **Issues:** https://github.com/kyru002/Proyecto-Francisco-Aleix/issues
- **Project Board:** (si existe)

---

## 📝 Contribuir a la Documentación

Si encuentras errores o quieres mejorar la documentación:

1. Edita el archivo .md correspondiente
2. Sigue el formato Markdown existente
3. Actualiza este índice si añades secciones nuevas
4. Envía un Pull Request

---

**Última actualización:** Febrero 2026  
**Versión del proyecto:** 1.0.0
