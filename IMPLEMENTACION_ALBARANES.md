# Resumen de Implementación de Albaranes

## Fecha: 1 de Febrero de 2026

### Cambios Realizados

## Backend - Node.js/Express

### 1. Nuevo Modelo: `backend/models/Albarani.js`
- ✅ Schema completo con todas las propiedades necesarias
- ✅ Líneas de detalle (artículos/servicios)
- ✅ Cálculos automáticos (subtotal, IVA, total)
- ✅ Firma de entrega con datos del receptor
- ✅ Anexos para documentos adicionales
- ✅ Middleware pre-save para calcular totales automáticamente
- ✅ Timestamps automáticos (createdAt, updatedAt)

### 2. Nueva Ruta: `backend/routes/albaranes.js`
**Endpoints implementados:**
- ✅ `GET /api/albaranes` - Obtener todos
- ✅ `GET /api/albaranes/:id` - Obtener por ID
- ✅ `GET /api/albaranes/cliente/:clienteId` - Por cliente
- ✅ `GET /api/albaranes/estado/:estado` - Por estado
- ✅ `GET /api/albaranes/numero/siguiente` - Próximo número automático
- ✅ `POST /api/albaranes` - Crear nuevo
- ✅ `PUT /api/albaranes/:id` - Actualizar
- ✅ `PATCH /api/albaranes/:id/estado` - Cambiar estado
- ✅ `PATCH /api/albaranes/:id/entregar` - Marcar como entregado
- ✅ `DELETE /api/albaranes/:id` - Eliminar

### 3. Actualización: `backend/server.js`
- ✅ Agregada ruta `/api/albaranes`

---

## Frontend - Vue 3 + Vite

### 4. Servicio API: `frontend/src/services/api.js`
**Nuevo servicio `albaranesService` con métodos:**
- ✅ `getAll()` - Obtener todos
- ✅ `getById(id)` - Por ID
- ✅ `getByCliente(clienteId)` - Por cliente
- ✅ `getByEstado(estado)` - Por estado
- ✅ `create(data)` - Crear
- ✅ `update(id, data)` - Actualizar
- ✅ `delete(id)` - Eliminar
- ✅ `cambiarEstado(id, estado)` - Cambiar estado
- ✅ `entregar(id, firmante)` - Marcar entregado
- ✅ `obtenerProximoNumero()` - Próximo número

### 5. Store Pinia: `frontend/src/stores/appStore.js`
**Actualizaciones:**
- ✅ Agregada propiedad `albaranes` al estado
- ✅ Actualizado `fetchAll()` para incluir albaranes
- ✅ Acción `createAlbarani(data)`
- ✅ Acción `updateAlbarani(id, data)`
- ✅ Acción `deleteAlbarani(id)`
- ✅ Acción `cambiarEstadoAlbarani(id, estado)`
- ✅ Acción `entregarAlbarani(id, firmante)`

### 6. Nueva Vista: `frontend/src/views/Albaranes.vue`
**Componente completo con:**
- ✅ Listado de albaranes con detalles expandidos
- ✅ Tabla de líneas para cada albarán
- ✅ Búsqueda por número o cliente
- ✅ Filtrado por estado
- ✅ Resumen de totales (subtotal, IVA, total)
- ✅ Modal de creación con:
  - Agregar líneas dinámicamente
  - Cálculo automático de importes
  - Gestión de descuentos
  - Configuración de IVA
- ✅ Modal de edición
- ✅ Menú de acciones (Editar, Entregar, Eliminar)
- ✅ Registro de firma de entrega
- ✅ Indicadores visuales de estado

### 7. Router: `frontend/src/router/index.js`
- ✅ Importado componente Albaranes
- ✅ Agregada ruta `/albaranes` con autenticación requerida

### 8. Sidebar: `frontend/src/components/Sidebar.vue`
- ✅ Importado icono FileText de lucide-vue-next
- ✅ Agregado enlace "Albaranes" con icono
- ✅ Posicionado entre Tickets y Equipo

---

## Características Principales

### Estados de Albarán
1. **Pendiente** - Creado, esperando entrega
2. **Entregado** - Entregado con firma
3. **Devuelto** - Artículos devueltos
4. **Cancelado** - Cancelado

### Cálculos Automáticos
- Importe de cada línea: `cantidad × precioUnitario - descuento`
- Subtotal: suma de importes
- IVA: `subtotal × (porcentajeIVA / 100)`
- Total: `subtotal + IVA`

### Validaciones
- ✅ Número de albarán único
- ✅ Cliente obligatorio
- ✅ Al menos una línea requerida
- ✅ Cantidades y precios positivos
- ✅ Descuento 0-100%
- ✅ IVA 0-100%

### Integración
- ✅ Vinculable a cliente
- ✅ Vinculable a técnico (opcional)
- ✅ Vinculable a ticket (opcional)
- ✅ Firma de entrega opcional

---

## Archivos Nuevos
```
backend/models/Albarani.js
backend/routes/albaranes.js
frontend/src/views/Albaranes.vue
ALBARANES.md (documentación)
```

## Archivos Modificados
```
backend/server.js
frontend/src/services/api.js
frontend/src/stores/appStore.js
frontend/src/router/index.js
frontend/src/components/Sidebar.vue
```

---

## Próximos Pasos Opcionales

1. **Generación de PDF**
   - Usar librería como `pdfkit` o `puppeteer`
   - Exportar albaranes a PDF

2. **Impresión**
   - Template de impresión optimizado
   - CSS para impresora

3. **Historial**
   - Registrar cambios de estado
   - Auditoría de modificaciones

4. **Códigos de barras**
   - Generar código QR para cada albarán
   - Código de barras del número

5. **Notificaciones**
   - Email cuando se entrega
   - SMS a cliente

6. **Reportes**
   - Reporte de entregas por técnico
   - Reporte de devoluciones
   - Reporte de ingresos

---

## Testing

La API ha sido diseñada para ser utilizada con:
- ✅ Postman/Insomnia
- ✅ cURL
- ✅ Axios desde el frontend

---

## Documentación

Completa documentación disponible en:
- `ALBARANES.md` - Guía técnica detallada
- Comentarios en código
- Ejemplos de uso

