# Estructura de Albaranes

## Descripción General
Los albaranes son documentos de entrega que registran los artículos/servicios entregados a un cliente. El sistema incluye:

- Creación, edición y eliminación de albaranes
- Gestión de líneas de detalle (artículos/servicios)
- Cálculo automático de subtotal, IVA y total
- Control de estados (pendiente, entregado, devuelto, cancelado)
- Firma digital de entrega
- Filtrado y búsqueda

## Modelo de Datos - Albarani

### Estructura Principal
```javascript
{
  numeroAlbaran: String (unique),        // Ej: ALB-2026-001
  cliente: ObjectId (ref: Cliente),       // Cliente receptor
  tecnico: ObjectId (ref: Tecnico),       // Técnico que entrega (opcional)
  ticket: ObjectId (ref: Ticket),         // Ticket asociado (opcional)
  estado: String,                         // pendiente | entregado | devuelto | cancelado
  fechaAlbaran: Date,                     // Fecha de creación
  fechaEntrega: Date,                     // Fecha de entrega (cuando se marca como entregado)
  descripcion: String,                    // Descripción general
  notas: String,                          // Notas adicionales
  observaciones: String,                  // Observaciones
}
```

### Líneas de Albarán (Array)
Cada línea contiene:
```javascript
{
  concepto: String,                       // Descripción del artículo/servicio
  cantidad: Number,                       // Cantidad
  unidad: String,                         // Unidad de medida (unidad, kg, m, etc.)
  precioUnitario: Number,                 // Precio por unidad
  porcentajeDescuento: Number,            // Descuento (0-100)
  importe: Number                         // Cantidad × Precio - Descuento
}
```

### Cálculos Automáticos
```javascript
{
  subtotal: Number,                       // Suma de importes de líneas
  porcentajeIVA: Number,                  // % IVA (default: 21%)
  iva: Number,                            // Subtotal × (IVA / 100)
  total: Number                           // Subtotal + IVA
}
```

### Firma de Entrega (Opcional)
```javascript
{
  firmante: {
    nombre: String,
    apellidos: String,
    dni: String,
    fecha: Date
  }
}
```

### Anexos (Opcional)
```javascript
{
  anexos: [
    {
      nombre: String,
      url: String,
      fecha: Date
    }
  ]
}
```

## Rutas API

### GET /api/albaranes
Obtiene todos los albaranes con sus relaciones pobladas.

**Respuesta:**
```json
[
  {
    "_id": "...",
    "numeroAlbaran": "ALB-2026-001",
    "cliente": { ...ClienteData },
    "estado": "pendiente",
    "subtotal": 1000,
    "iva": 210,
    "total": 1210,
    ...
  }
]
```

### GET /api/albaranes/:id
Obtiene un albarán específico.

### GET /api/albaranes/cliente/:clienteId
Obtiene todos los albaranes de un cliente específico.

### GET /api/albaranes/estado/:estado
Obtiene albaranes por estado (pendiente, entregado, devuelto, cancelado).

### GET /api/albaranes/numero/siguiente
Obtiene el próximo número de albarán disponible (ej: ALB-2026-005).

### POST /api/albaranes
Crea un nuevo albarán.

**Body:**
```json
{
  "numeroAlbaran": "ALB-2026-001",
  "cliente": "ObjectId",
  "tecnico": "ObjectId (optional)",
  "ticket": "ObjectId (optional)",
  "descripcion": "Descripción",
  "lineas": [
    {
      "concepto": "Servicio de soporte",
      "cantidad": 2,
      "unidad": "horas",
      "precioUnitario": 50,
      "porcentajeDescuento": 0,
      "importe": 100
    }
  ],
  "porcentajeIVA": 21,
  "notas": "Notas",
  "observaciones": "Observaciones"
}
```

### PUT /api/albaranes/:id
Actualiza un albarán.

**Parámetros actualizables:**
- numeroAlbaran
- cliente
- tecnico
- estado
- descripcion
- lineas
- porcentajeIVA
- notas
- observaciones
- fechaEntrega
- firmante

### PATCH /api/albaranes/:id/estado
Cambia el estado del albarán.

**Body:**
```json
{
  "estado": "entregado"
}
```

### PATCH /api/albaranes/:id/entregar
Marca como entregado y registra la firma.

**Body:**
```json
{
  "firmante": {
    "nombre": "Juan",
    "apellidos": "Pérez García",
    "dni": "12345678X"
  }
}
```

### DELETE /api/albaranes/:id
Elimina un albarán (solo si está pendiente).

## Acciones del Store (Pinia)

### store.fetchAll()
Obtiene todos los datos (tickets, técnicos, clientes, albaranes).

### store.createAlbarani(data)
Crea un nuevo albarán y lo agrega al estado.

### store.updateAlbarani(id, data)
Actualiza un albarán existente.

### store.deleteAlbarani(id)
Elimina un albarán.

### store.cambiarEstadoAlbarani(id, estado)
Cambia el estado de un albarán.

### store.entregarAlbarani(id, firmante)
Marca como entregado y registra la firma.

## Vista Frontend - Albaranes.vue

### Funcionalidades Principales

1. **Listar Albaranes**
   - Muestra todos los albaranes con detalles resumidos
   - Búsqueda por número o cliente
   - Filtrado por estado
   - Indicador visual del estado

2. **Crear Albarán**
   - Modal con formulario completo
   - Agregar líneas dinámicamente
   - Cálculo automático de importes
   - Gestión de descuentos y IVA

3. **Editar Albarán**
   - Actualizar datos generales
   - Cambiar estado
   - Modificar notas y observaciones

4. **Entregar Albarán**
   - Registrar firma del receptor
   - Cambiar estado automáticamente a "entregado"
   - Registrar fecha de entrega

5. **Eliminar Albarán**
   - Confirmación antes de eliminar
   - Solo albaranes pendientes

## Integración con Otros Módulos

### Clientes
- Cada albarán está vinculado a un cliente
- Se pueden ver todos los albaranes de un cliente

### Tickets
- Los albaranes pueden estar vinculados a tickets
- Permite rastrear qué servicio se entregó

### Técnicos
- Opcional: un técnico puede entregar el albarán
- Se registra quién entregó

## Ejemplo de Uso

### 1. Crear un Albarán
```javascript
const nuevoAlbarani = await store.createAlbarani({
  numeroAlbaran: "ALB-2026-001",
  cliente: "clienteId",
  descripcion: "Entrega de hardware",
  lineas: [
    {
      concepto: "Monitor LG 24 pulgadas",
      cantidad: 1,
      unidad: "unidad",
      precioUnitario: 250,
      porcentajeDescuento: 10,
      importe: 225
    }
  ],
  porcentajeIVA: 21
});
```

### 2. Marcar como Entregado
```javascript
await store.entregarAlbarani("albaraniId", {
  nombre: "Juan",
  apellidos: "García López",
  dni: "12345678X"
});
```

### 3. Cambiar Estado
```javascript
await store.cambiarEstadoAlbarani("albaraniId", "devuelto");
```

## Estados Disponibles

- **pendiente**: Albarán creado, esperando entrega
- **entregado**: Entregado al cliente (con firma)
- **devuelto**: Artículos devueltos
- **cancelado**: Albarán cancelado

## Validaciones

- El número de albarán debe ser único
- El cliente es obligatorio
- Al menos una línea es obligatoria
- Las cantidades y precios deben ser positivos
- El IVA está entre 0-100%

## Notas de Desarrollo

- Los cálculos se hacen automáticamente en el middleware `pre save` de Mongoose
- Las fechas se registran automáticamente
- Los albaranes se ordenan por fecha descendente (más recientes primero)
- El sistema genera automáticamente el siguiente número de albarán
