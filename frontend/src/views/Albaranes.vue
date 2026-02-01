<script setup>
import { onMounted, ref, computed } from 'vue';
import { useAppStore } from '../stores/appStore';
import { 
  Plus, 
  Search, 
  FileText,
  Package,
  CheckCircle,
  Clock,
  ExternalLink,
  Edit,
  Trash2,
  MoreVertical
} from 'lucide-vue-next';

const store = useAppStore();
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showMenuId = ref(null);
const editingAlbarani = ref(null);
const searchQuery = ref('');
const filterEstado = ref('');

const newAlbarani = ref({
  numeroAlbaran: '',
  cliente: '',
  tecnico: '',
  ticket: '',
  descripcion: '',
  lineas: [],
  porcentajeIVA: 21,
  notas: '',
  observaciones: ''
});

const newLinea = ref({
  concepto: '',
  cantidad: 1,
  unidad: 'unidad',
  precioUnitario: 0,
  porcentajeDescuento: 0,
  importe: 0
});

onMounted(async () => {
  await store.fetchAll();
});

const albaranesFiltered = computed(() => {
  return store.albaranes.filter(albarani => {
    const matchesSearch = albarani.numeroAlbaran.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          (albarani.cliente?.nombreEmpresa || '').toLowerCase().includes(searchQuery.value.toLowerCase());
    const matchesEstado = !filterEstado.value || albarani.estado === filterEstado.value;
    return matchesSearch && matchesEstado;
  });
});

const calcularImporte = () => {
  const cantidad = parseFloat(newLinea.value.cantidad) || 0;
  const precio = parseFloat(newLinea.value.precioUnitario) || 0;
  const descuento = parseFloat(newLinea.value.porcentajeDescuento) || 0;
  
  const subtotal = cantidad * precio;
  const descuentoAplicado = subtotal * (descuento / 100);
  newLinea.value.importe = Math.max(0, subtotal - descuentoAplicado);
};

const agregarLinea = () => {
  // Validar que todos los campos estén completo
  if (!newLinea.value.concepto || newLinea.value.concepto.trim() === '') {
    alert('Por favor, ingresa el concepto');
    return;
  }
  
  const cantidad = parseFloat(newLinea.value.cantidad);
  if (isNaN(cantidad) || cantidad <= 0) {
    alert('La cantidad debe ser un número mayor a 0');
    return;
  }
  
  const precio = parseFloat(newLinea.value.precioUnitario);
  if (isNaN(precio) || precio < 0) {
    alert('El precio debe ser un número válido y mayor o igual a 0');
    return;
  }
  
  // Calcular importe antes de agregar
  calcularImporte();
  
  // Validar que el importe sea mayor a 0
  if (newLinea.value.importe <= 0) {
    alert('El importe debe ser mayor a 0');
    return;
  }
  
  // Agregar la línea con valores parseados correctamente
  newAlbarani.value.lineas.push({
    concepto: newLinea.value.concepto.trim(),
    cantidad: parseFloat(newLinea.value.cantidad),
    unidad: newLinea.value.unidad || 'unidad',
    precioUnitario: parseFloat(newLinea.value.precioUnitario),
    porcentajeDescuento: parseFloat(newLinea.value.porcentajeDescuento) || 0,
    importe: newLinea.value.importe
  });
  
  // Limpiar formulario
  newLinea.value = {
    concepto: '',
    cantidad: 1,
    unidad: 'unidad',
    precioUnitario: 0,
    porcentajeDescuento: 0,
    importe: 0
  };
  
  alert('Línea agregada correctamente');
};

const eliminarLinea = (index) => {
  newAlbarani.value.lineas.splice(index, 1);
};

const handleCreateAlbarani = async () => {
  try {
    // Validar campos requeridos
    if (!newAlbarani.value.numeroAlbaran || newAlbarani.value.numeroAlbaran.trim() === '') {
      alert('Por favor, ingresa el número de albarán');
      return;
    }
    
    if (!newAlbarani.value.cliente) {
      alert('Por favor, selecciona un cliente');
      return;
    }
    
    if (newAlbarani.value.lineas.length === 0) {
      alert('Debes agregar al menos una línea. Completa los campos (Concepto, Cantidad, Precio) y haz clic en el botón "+" para agregar');
      return;
    }

    // Validar que todas las líneas tengan importes calculados
    const lineasValidas = newAlbarani.value.lineas.every(linea => {
      console.log('Validando línea:', linea);
      return linea.concepto && 
             linea.concepto.trim() !== '' &&
             typeof linea.cantidad === 'number' && 
             linea.cantidad > 0 && 
             typeof linea.precioUnitario === 'number' &&
             linea.precioUnitario >= 0 && 
             typeof linea.importe === 'number' &&
             linea.importe > 0;
    });

    if (!lineasValidas) {
      alert('Todas las líneas deben tener concepto, cantidad y precio válidos');
      console.error('Líneas inválidas:', newAlbarani.value.lineas);
      return;
    }

    // Preparar datos con tipos correctos
    const datosAlbarani = {
      numeroAlbaran: newAlbarani.value.numeroAlbaran.trim(),
      cliente: newAlbarani.value.cliente,
      tecnico: newAlbarani.value.tecnico || null,
      ticket: newAlbarani.value.ticket || null,
      estado: 'pendiente',
      descripcion: newAlbarani.value.descripcion || '',
      lineas: newAlbarani.value.lineas.map(linea => ({
        concepto: String(linea.concepto).trim(),
        cantidad: Number(linea.cantidad),
        unidad: String(linea.unidad || 'unidad'),
        precioUnitario: Number(linea.precioUnitario),
        porcentajeDescuento: Number(linea.porcentajeDescuento) || 0,
        importe: Number(linea.importe)
      })),
      porcentajeIVA: Number(newAlbarani.value.porcentajeIVA) || 21,
      notas: newAlbarani.value.notas || ''
    };

    console.log('Enviando albarán:', JSON.stringify(datosAlbarani, null, 2));
    
    const respuesta = await store.createAlbarani(datosAlbarani);
    console.log('Respuesta del servidor:', respuesta);
    
    showCreateModal.value = false;
    newAlbarani.value = {
      numeroAlbaran: '',
      cliente: '',
      tecnico: '',
      ticket: '',
      descripcion: '',
      lineas: [],
      porcentajeIVA: 21,
      notas: '',
      observaciones: ''
    };
    alert('¡Albarán creado correctamente!');
  } catch (error) {
    console.error('Error al crear albarán:', error);
    console.error('Respuesta de error:', error.response?.data);
    alert('Error al crear el albarán: ' + (error.response?.data?.message || error.message));
  }
};

const handleEditAlbarani = (albarani) => {
  editingAlbarani.value = { ...albarani };
  showEditModal.value = true;
  showMenuId.value = null;
};

const handleSaveEdit = async () => {
  try {
    await store.updateAlbarani(editingAlbarani.value._id, editingAlbarani.value);
    showEditModal.value = false;
    editingAlbarani.value = null;
  } catch (error) {
    alert('Error al actualizar el albarán: ' + error.message);
  }
};

const handleDeleteAlbarani = async (albaraniId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este albarán?')) {
    try {
      await store.deleteAlbarani(albaraniId);
      showMenuId.value = null;
    } catch (error) {
      alert('Error al eliminar el albarán');
    }
  }
};

const handleEntregarAlbarani = async (albaraniId) => {
  const nombre = prompt('Nombre del firmante:');
  if (nombre) {
    try {
      await store.entregarAlbarani(albaraniId, { nombre });
    } catch (error) {
      alert('Error al marcar como entregado: ' + error.message);
    }
  }
};

const toggleMenu = (albaraniId) => {
  showMenuId.value = showMenuId.value === albaraniId ? null : albaraniId;
};

const calcularTotales = (albarani) => {
  const subtotal = albarani.lineas.reduce((sum, linea) => sum + (linea.importe || 0), 0);
  const iva = subtotal * (albarani.porcentajeIVA / 100);
  return {
    subtotal: subtotal.toFixed(2),
    iva: iva.toFixed(2),
    total: (subtotal + iva).toFixed(2)
  };
};

const getEstadoColor = (estado) => {
  const colores = {
    'pendiente': 'badge-in-progress',
    'entregado': 'badge-abierto',
    'devuelto': 'badge-cerrado',
    'cancelado': 'badge-cerrado'
  };
  return colores[estado] || 'badge-medium';
};
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <div>
        <h1 class="page-title">Albaranes</h1>
        <p class="page-subtitle">Gestiona los albaranes de entrega</p>
      </div>
      <button @click="showCreateModal = true" class="btn btn-primary">
        <Plus />
        Nuevo Albarán
      </button>
    </div>

    <!-- Barra de Filtros -->
    <div class="card" style="margin-bottom: 1.5rem; padding: 1rem;">
      <div class="filters-bar">
        <div class="input-with-icon" style="flex: 1;">
          <Search />
          <input v-model="searchQuery" type="text" class="form-input" placeholder="Buscar por número o cliente...">
        </div>
        <select v-model="filterEstado" class="form-input form-select">
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="entregado">Entregado</option>
          <option value="devuelto">Devuelto</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>
    </div>

    <!-- Lista de Albaranes -->
    <div v-if="albaranesFiltered.length === 0" class="empty-state">
      <FileText style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 1rem;" />
      <p>No se encontraron albaranes.</p>
    </div>

    <div v-else class="card" style="padding: 1rem;">
      <div v-for="albarani in albaranesFiltered" :key="albarani._id" style="padding-bottom: 1rem; border-bottom: 1px solid var(--border); margin-bottom: 1rem;">
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr 100px; gap: 1rem; align-items: center;">
          <!-- Número de Albarán -->
          <div>
            <div style="font-weight: 600; font-size: 0.95rem;">{{ albarani.numeroAlbaran }}</div>
            <div style="font-size: 0.75rem; color: var(--muted-foreground);">{{ new Date(albarani.fechaAlbaran).toLocaleDateString() }}</div>
          </div>

          <!-- Cliente -->
          <div>
            <div style="font-size: 0.875rem; font-weight: 500;">{{ albarani.cliente?.nombreEmpresa || 'N/A' }}</div>
            <div style="font-size: 0.75rem; color: var(--muted-foreground);">{{ albarani.cliente?.nombreContacto || '' }}</div>
          </div>

          <!-- Importe Total -->
          <div>
            <div style="font-weight: 600; font-size: 0.95rem;">{{ calcularTotales(albarani).total }}€</div>
            <div style="font-size: 0.75rem; color: var(--muted-foreground);">Total</div>
          </div>

          <!-- Estado -->
          <div>
            <span class="badge" :class="getEstadoColor(albarani.estado)">{{ albarani.estado }}</span>
          </div>

          <!-- Acciones -->
          <div style="position: relative; display: flex; justify-content: flex-end;">
            <button @click="toggleMenu(albarani._id)" class="btn btn-ghost btn-icon">
              <MoreVertical />
            </button>
            <div v-if="showMenuId === albarani._id" style="position: absolute; right: 0; top: 100%; background: white; border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow-md); z-index: 10; min-width: 150px;">
              <button @click="handleEditAlbarani(albarani)" style="display: block; width: 100%; text-align: left; padding: 0.5rem 1rem; border: none; background: transparent; cursor: pointer; font-size: 0.875rem;" type="button">
                Editar
              </button>
              <button @click="handleEntregarAlbarani(albarani._id)" v-if="albarani.estado === 'pendiente'" style="display: block; width: 100%; text-align: left; padding: 0.5rem 1rem; border: none; background: transparent; cursor: pointer; font-size: 0.875rem; color: var(--primary);" type="button">
                Entregar
              </button>
              <button @click="handleDeleteAlbarani(albarani._id)" style="display: block; width: 100%; text-align: left; padding: 0.5rem 1rem; border: none; background: transparent; cursor: pointer; font-size: 0.875rem; color: var(--destructive);" type="button">
                Eliminar
              </button>
            </div>
          </div>
        </div>

        <!-- Detalles de líneas (expandido) -->
        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border); font-size: 0.85rem;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid var(--border);">
                <th style="text-align: left; padding: 0.5rem;">Concepto</th>
                <th style="text-align: center; padding: 0.5rem;">Cantidad</th>
                <th style="text-align: right; padding: 0.5rem;">Precio</th>
                <th style="text-align: right; padding: 0.5rem;">Importe</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(linea, index) in albarani.lineas" :key="index" style="border-bottom: 1px solid var(--border);">
                <td style="padding: 0.5rem;">{{ linea.concepto }}</td>
                <td style="text-align: center; padding: 0.5rem;">{{ linea.cantidad }} {{ linea.unidad }}</td>
                <td style="text-align: right; padding: 0.5rem;">{{ linea.precioUnitario.toFixed(2) }}€</td>
                <td style="text-align: right; padding: 0.5rem; font-weight: 600;">{{ linea.importe.toFixed(2) }}€</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Resumen financiero -->
        <div style="display: flex; justify-content: flex-end; gap: 3rem; margin-top: 1rem; font-size: 0.85rem;">
          <div>
            <div style="color: var(--muted-foreground);">Subtotal</div>
            <div style="font-weight: 600;">{{ calcularTotales(albarani).subtotal }}€</div>
          </div>
          <div>
            <div style="color: var(--muted-foreground);">IVA ({{ albarani.porcentajeIVA }}%)</div>
            <div style="font-weight: 600;">{{ calcularTotales(albarani).iva }}€</div>
          </div>
          <div>
            <div style="color: var(--muted-foreground);">Total</div>
            <div style="font-weight: 700; font-size: 1.05rem;">{{ calcularTotales(albarani).total }}€</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Creación -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <h2 class="modal-title">Crear Nuevo Albarán</h2>
        </div>
        <form @submit.prevent="handleCreateAlbarani">
          <div class="modal-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Número de Albarán</label>
                <input v-model="newAlbarani.numeroAlbaran" type="text" class="form-input" required placeholder="ALB-2026-001">
              </div>
              <div class="form-group">
                <label class="form-label">Cliente *</label>
                <select v-model="newAlbarani.cliente" class="form-input form-select" required>
                  <option value="" disabled>Seleccionar cliente</option>
                  <option v-for="c in store.clientes" :key="c._id" :value="c._id">{{ c.nombreEmpresa }} ({{ c.nombreContacto }})</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Técnico</label>
                <select v-model="newAlbarani.tecnico" class="form-input form-select">
                  <option value="">Sin asignar</option>
                  <option v-for="t in store.tecnicos" :key="t._id" :value="t._id">{{ t.nombre }}</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Ticket</label>
                <select v-model="newAlbarani.ticket" class="form-input form-select">
                  <option value="">Sin vincular</option>
                  <option v-for="tk in store.tickets" :key="tk._id" :value="tk._id">#{{ tk._id?.slice(-6) }} - {{ tk.title }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Descripción</label>
              <input v-model="newAlbarani.descripcion" type="text" class="form-input" placeholder="Descripción general del albarán">
            </div>

            <!-- Agregar líneas -->
            <div style="border-top: 2px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
              <h3 style="font-weight: 600; margin-bottom: 1rem;">Líneas de Albarán *</h3>
              <p style="font-size: 0.85rem; color: var(--muted-foreground); margin-bottom: 1rem;">Completa todos los campos y haz clic en "+" para agregar una línea.</p>
              
              <div style="display: grid; grid-template-columns: 2fr 1fr 1fr 1fr 50px; gap: 0.5rem; margin-bottom: 1rem;">
                <div>
                  <label style="font-size: 0.75rem; color: var(--muted-foreground); display: block; margin-bottom: 0.25rem;">Concepto</label>
                  <input v-model="newLinea.concepto" type="text" class="form-input" placeholder="Ej: Monitor">
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: var(--muted-foreground); display: block; margin-bottom: 0.25rem;">Cantidad</label>
                  <input v-model.number="newLinea.cantidad" type="number" class="form-input" placeholder="1" step="0.01" min="0.01">
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: var(--muted-foreground); display: block; margin-bottom: 0.25rem;">Precio</label>
                  <input v-model.number="newLinea.precioUnitario" type="number" class="form-input" placeholder="100" step="0.01" min="0">
                </div>
                <div>
                  <label style="font-size: 0.75rem; color: var(--muted-foreground); display: block; margin-bottom: 0.25rem;">Desc %</label>
                  <input v-model.number="newLinea.porcentajeDescuento" type="number" class="form-input" placeholder="0" step="0.01" min="0" max="100">
                </div>
                <div style="display: flex; align-items: flex-end;">
                  <button type="button" @click="agregarLinea" class="btn btn-primary" style="width: 100%; padding: 0.5rem; font-weight: 600;">Agregar</button>
                </div>
              </div>

              <!-- Tabla de líneas agregadas -->
              <div v-if="newAlbarani.lineas.length > 0" style="margin-bottom: 1rem; padding: 1rem; background-color: var(--muted); border-radius: var(--radius);">
                <p style="font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem;">✓ {{ newAlbarani.lineas.length }} línea(s) agregada(s)</p>
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem;">
                  <thead>
                    <tr style="border-bottom: 1px solid var(--border);">
                      <th style="text-align: left; padding: 0.5rem;">Concepto</th>
                      <th style="text-align: center; padding: 0.5rem;">Cantidad</th>
                      <th style="text-align: right; padding: 0.5rem;">Precio</th>
                      <th style="text-align: right; padding: 0.5rem;">Importe</th>
                      <th style="text-align: center; padding: 0.5rem;">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(linea, index) in newAlbarani.lineas" :key="index" style="border-bottom: 1px solid var(--border);">
                      <td style="padding: 0.5rem;">{{ linea.concepto }}</td>
                      <td style="text-align: center; padding: 0.5rem;">{{ linea.cantidad }}</td>
                      <td style="text-align: right; padding: 0.5rem;">{{ linea.precioUnitario.toFixed(2) }}€</td>
                      <td style="text-align: right; padding: 0.5rem; font-weight: 600;">{{ linea.importe.toFixed(2) }}€</td>
                      <td style="text-align: center; padding: 0.5rem;">
                        <button type="button" @click="eliminarLinea(index)" class="btn btn-ghost btn-icon" style="padding: 0.25rem;">×</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else style="padding: 1rem; background-color: var(--primary-light); border-radius: var(--radius); text-align: center; margin-bottom: 1rem;">
                <p style="font-size: 0.85rem; color: var(--primary);">Aún no hay líneas. Completa los campos y haz clic en "Agregar"</p>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem;">
              <div class="form-group">
                <label class="form-label">% IVA</label>
                <input v-model.number="newAlbarani.porcentajeIVA" type="number" class="form-input" placeholder="21" step="0.01" min="0">
              </div>
              <div class="form-group">
                <label class="form-label">Notas</label>
                <input v-model="newAlbarani.notas" type="text" class="form-input" placeholder="Notas adicionales">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Observaciones</label>
              <textarea v-model="newAlbarani.observaciones" class="form-input form-textarea" placeholder="Observaciones..." style="min-height: 60px;"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary">Crear Albarán</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Edición -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal" style="max-width: 700px; max-height: 90vh; overflow-y: auto;">
        <div class="modal-header">
          <h2 class="modal-title">Editar Albarán</h2>
        </div>
        <form @submit.prevent="handleSaveEdit" v-if="editingAlbarani">
          <div class="modal-body">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">Número de Albarán</label>
                <input v-model="editingAlbarani.numeroAlbaran" type="text" class="form-input" required>
              </div>
              <div class="form-group">
                <label class="form-label">Estado</label>
                <select v-model="editingAlbarani.estado" class="form-input form-select">
                  <option value="pendiente">Pendiente</option>
                  <option value="entregado">Entregado</option>
                  <option value="devuelto">Devuelto</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Descripción</label>
              <input v-model="editingAlbarani.descripcion" type="text" class="form-input">
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label">% IVA</label>
                <input v-model.number="editingAlbarani.porcentajeIVA" type="number" class="form-input" step="0.01" min="0">
              </div>
              <div class="form-group">
                <label class="form-label">Notas</label>
                <input v-model="editingAlbarani.notas" type="text" class="form-input">
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Observaciones</label>
              <textarea v-model="editingAlbarani.observaciones" class="form-input form-textarea" style="min-height: 60px;"></textarea>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showEditModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
