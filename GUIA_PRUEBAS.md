# Guía de Prueba - Funcionalidades Arregladas

## Estado de las Funcionalidades

### ✅ Todas las Funcionalidades Arregladas

Este documento detalla las pruebas que puedes hacer para verificar que todo funciona correctamente.

---

## Iniciando la Aplicación

### Paso 1: Iniciar el Backend
```bash
cd backend
npm install  # Si no lo has hecho
npm run dev  # Inicia el servidor en puerto 5001
```

**Esperado:** Verás un mensaje como:
```
✅ MongoDB conectado correctamente
Servidor ejecutándose en http://localhost:5001
```

### Paso 2: Iniciar el Frontend
```bash
cd frontend
npm install  # Si no lo has hecho
npm run dev  # Inicia el servidor en puerto 5173
```

**Esperado:** Se abrirá la aplicación en `http://localhost:5173`

---

## Pruebas Funcionales

### 1. **Login**
1. Abre la aplicación en `http://localhost:5173`
2. Usa las credenciales:
   - Email: `admin@support.com`
   - Password: `admin123`
3. Debería redirigirte al Dashboard

**✅ Esperado:** Dashboard cargado sin errores

---

### 2. **Gestión de Clientes** (`/clients`)
#### Crear Cliente
1. Haz clic en "Nuevo Cliente"
2. Completa el formulario:
   - Nombre de Contacto: `Juan García`
   - Nombre de la Empresa: `Acme Corp`
   - Email: `juan@acmecorp.com`
   - Teléfono: `+34 600 123 456`
3. Haz clic en "Guardar Cliente"

**✅ Esperado:** Cliente aparece en la lista sin errores

#### Editar Cliente
1. Haz clic en el botón "Editar" (icono de lápiz)
2. Modifica algún campo
3. Haz clic en "Guardar Cambios"

**✅ Esperado:** Los cambios se reflejan inmediatamente

#### Eliminar Cliente
1. Haz clic en el botón "Eliminar" (icono de basura)
2. Confirma en el diálogo
3. El cliente desaparece de la lista

**✅ Esperado:** Cliente eliminado sin errores

---

### 3. **Gestión de Tickets** (`/tickets`)
#### Crear Ticket
1. Haz clic en "Nuevo Ticket"
2. Completa:
   - Título: `No puedo acceder al correo`
   - Cliente: Selecciona uno (ej: Acme Corp)
   - Prioridad: `Alta`
   - Técnico: Selecciona uno o déjalo en blanco
   - Descripción: `El usuario no puede acceder a su correo corporativo`
3. Haz clic en "Crear Ticket"

**✅ Esperado:** Ticket aparece en la lista

#### Actualizar Estado de Ticket
1. Haz clic en "Editar" en un ticket
2. Cambia el estado a "En Progreso"
3. Haz clic en "Guardar Cambios"

**✅ Esperado:** El estado se actualiza

---

### 4. **Gestión de Técnicos** (`/technicians`)
#### Crear Técnico
1. Haz clic en "Nuevo Miembro"
2. Completa:
   - Nombre: `Carlos Soporte`
   - Email: `carlos@support.com`
   - Rol: `Técnico`
3. Haz clic en "Añadir Miembro"

**✅ Esperado:** Técnico aparece en la tabla

#### Editar Técnico
1. Haz clic en el menú (⋮) y selecciona "Editar"
2. Cambia el rol a "Administrador"
3. Haz clic en "Guardar Cambios"

**✅ Esperado:** El rol se actualiza en la tabla

---

### 5. **Gestión de Albaranes** (`/albaranes`)
#### Crear Albarán
1. Haz clic en "Crear Albarán"
2. Selecciona cliente y técnico
3. Agrega líneas con:
   - Concepto: `Servicio de soporte`
   - Cantidad: `1`
   - Precio Unitario: `100`
4. Haz clic en "Crear Albarán"

**✅ Esperado:** Albarán creado y aparece en la lista

#### Cambiar Estado de Albarán
1. Abre un albarán
2. Cambia el estado a "Entregado"
3. Ingresa el nombre del firmante

**✅ Esperado:** Estado actualizado

---

### 6. **Dashboard**
1. Ve a Dashboard (`/dashboard`)
2. Verifica que muestre:
   - Total de Tickets
   - Tickets abiertos
   - Tickets cerrados
   - Tickets de alta prioridad
   - Últimos 5 tickets recientes

**✅ Esperado:** Todos los números se calculan correctamente

---

## Problemas Resueltos

| Problema | Causa | Solución | Estado |
|----------|-------|----------|--------|
| Los clientes no se eliminaban | Error de referencia `_id` vs `id` | Cambiar todos los `.id` por `._id` | ✅ Arreglado |
| Las rutas de albaranes fallaban | Orden incorrecto de rutas | Reordenar rutas específicas antes de genéricas | ✅ Arreglado |
| Inconsistencia en campos de tickets | Modelo desorganizado | Reorganizar campos del modelo | ✅ Arreglado |
| Componentes no renderizaban | Imports faltantes | Agregar imports de `Users` y `Ticket` | ✅ Arreglado |
| Referencias a campos inexistentes | Nombres de campos incorrectos | Usar nombres correctos del backend | ✅ Arreglado |

---

## Verificación Final

Ejecuta estos comandos para asegurarte de que no hay errores sintácticos:

```bash
# Backend
cd backend
node -c server.js
node -c models/Ticket.js
node -c routes/albaranes.js

# Frontend (si tienes un linter)
cd frontend
npm run lint  # Si está configurado
```

---

## Notas Importantes

- ✅ La base de datos debe estar en `mongodb://127.0.0.1:27017/MyApp`
- ✅ Asegúrate de que MongoDB está corriendo
- ✅ Los puertos 5001 (backend) y 5173 (frontend) deben estar disponibles
- ✅ Usa credenciales demo para testing rápido

---

## Soporte

Si encuentras algún problema:
1. Revisa los logs en la consola del navegador (F12)
2. Revisa los logs del servidor en la terminal
3. Verifica que MongoDB esté corriendo
4. Comprueba las conexiones de red
