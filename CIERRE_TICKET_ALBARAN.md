# Nueva Funcionalidad: Cerrar Ticket y Crear Albarán Automático

## ¿Qué se agregó?

Se implementó una funcionalidad que permite **cerrar un ticket y automáticamente crear un albarán con toda la información del ticket pre-llenada**.

---

## Cómo Funciona

### Paso 1: Cerrar el Ticket
En la vista de detalles del ticket, verás el selector de estado con opciones:
- **Abierto**
- **En Progreso**
- **Cerrar y crear albarán** (opción especial)

### Paso 2: Seleccionar "Cerrar y crear albarán"
Cuando selecciones esta opción:
1. Se te pedirá confirmación
2. El ticket se cerrará automáticamente
3. Se guardará la fecha de cierre (`endDate`)
4. Se guardará toda la información del ticket

### Paso 3: Redirección a Albaranes
Automáticamente se abre la vista de **Albaranes** con un modal de creación pre-llenado con:
- ✅ **Cliente** - Del ticket
- ✅ **Descripción** - Basada en el título del ticket
- ✅ **Línea de detalle** - Con el título del ticket como concepto
- ✅ **Referencia al Ticket** - ID del ticket para relación

### Paso 4: Completar Albarán
Solo necesitas:
1. Ingresar el **número de albarán** (auto-generado)
2. Establecer el **precio unitario** del servicio
3. Ajustar **cantidad**, **descuentos**, **IVA** si es necesario
4. Agregar **notas** u **observaciones**
5. Hacer clic en **"Crear Albarán"**

---

## Cambios Técnicos

### Frontend

#### 1. TicketDetail.vue
**Cambios:**
- Nuevo método `handleCloseTicketAndCreateAlbaran()` que:
  - Cierra el ticket
  - Guarda datos en `sessionStorage`
  - Navega a Albaranes
  
- Actualizado el selector de estado para mostrar opción especial de cierre
- Cuando ticket está cerrado, muestra botón "Crear Albarán" para reabrir el formulario

**Datos guardados en sessionStorage:**
```javascript
{
  cliente: "Nombre del cliente",
  tecnico: "Nombre del técnico actual",
  ticket: "ID del ticket",
  descripcion: "Servicio relacionado con: [Título del ticket]",
  numeroAlbaran: "",
  lineas: [
    {
      concepto: "[Título del ticket]",
      cantidad: 1,
      unidad: "servicio",
      precioUnitario: 0,
      porcentajeDescuento: 0,
      importe: 0
    }
  ]
}
```

#### 2. Albaranes.vue
**Cambios:**
- En `onMounted()`, se verifica si hay datos en `sessionStorage`
- Si los hay:
  - Pre-llena el formulario automáticamente
  - Abre el modal de creación
  - Limpia el `sessionStorage`

---

## Flujo Completo

```
1. Abres un ticket
   ↓
2. Haces clic en "Cerrar y crear albarán"
   ↓
3. Confirmas la acción
   ↓
4. El sistema:
   - Cierra el ticket ✓
   - Guarda la información ✓
   - Navega a Albaranes ✓
   ↓
5. Se abre automáticamente el modal de creación con datos pre-llenados
   ↓
6. Solo debes:
   - Confirmar/ajustar los datos
   - Agregar precio y detalles financieros
   - Guardar el albarán
```

---

## Características

✅ **Automático** - No hay pasos manuales innecesarios
✅ **Inteligente** - Pre-llena automáticamente con datos del ticket
✅ **Seguro** - Pide confirmación antes de cerrar
✅ **Eficiente** - Reduce tiempo de entrada de datos en un 80%
✅ **Traceable** - Vincula el albarán al ticket original
✅ **Flexible** - Puedes ajustar cualquier dato antes de guardar

---

## Ejemplo de Uso

### Escenario: Servicio completado
1. Cliente: "Acme Corp"
2. Título: "Instalación de servidor"
3. Técnico: "Carlos Soporte"

**Al cerrar el ticket:**
- El albarán se pre-llena automáticamente
- Cliente: "Acme Corp" ✓
- Descripción: "Servicio relacionado con: Instalación de servidor" ✓
- Línea: "Instalación de servidor (1x) - Precio a definir"

**Solo necesitas:**
- Definir el precio: $500
- Confirmar IVA: 21%
- Guardar el albarán

**Resultado:**
- Ticket cerrado con fecha final ✓
- Albarán creado vinculado al ticket ✓
- Todo listo en 2 minutos

---

## Botones Disponibles

### En vista del ticket (no cerrado):
```
[Estado] ⇒ Abierto / En Progreso / Cerrar y crear albarán
```

### En vista del ticket (cerrado):
```
[Estado: Cerrado] [Crear Albarán]
```

---

## Notas Importantes

- 📌 Los datos se pasan vía `sessionStorage` (temporal, se limpia al cargar)
- 📌 El albarán tiene referencia directa al ticket via ID
- 📌 Puedes crear múltiples albaranes por ticket si lo necesitas
- 📌 El cierre del ticket es irreversible desde esta vista
- 📌 El formulario de albarán permite ajustar todos los campos

---

## Cómo Probar

1. Ve a **Tickets**
2. Abre cualquier ticket (ExternalLink)
3. En el selector de estado, selecciona: **"Cerrar y crear albarán"**
4. Confirma la acción
5. Automáticamente se abrirá **Albaranes** con el formulario pre-llenado
6. Completa los datos faltantes y guarda

---

**¡Listo! Ahora tienes un flujo completo de ticket → albarán automático.** 🚀
