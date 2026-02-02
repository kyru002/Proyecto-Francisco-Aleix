<script setup>
import { onMounted, ref } from 'vue';
import { useAppStore } from '../stores/appStore';
import { 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Building2, 
  MoreVertical,
  Edit,
  Trash2,
  ExternalLink,
  Users,
  Ticket,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  CheckCircle
} from 'lucide-vue-next';

const store = useAppStore();
const showCreateModal = ref(false);
const newClient = ref({
  nombreContacto: '',
  nombreEmpresa: '',
  email: '',
  telefono: ''
});

onMounted(async () => {
  await store.fetchAll();
});

const editingClient = ref(null);
const showEditModal = ref(false);
const expandedClientId = ref(null);

const handleCreateClient = async () => {
  try {
    await store.createCliente(newClient.value);
    showCreateModal.value = false;
    newClient.value = { nombreContacto: '', nombreEmpresa: '', email: '', telefono: '' };
  } catch (error) {
    alert('Error al crear el cliente');
  }
};

const handleEditClient = (client) => {
  editingClient.value = { ...client };
  showEditModal.value = true;
};

const handleSaveEdit = async () => {
  try {
    await store.updateCliente(editingClient.value._id, editingClient.value);
    showEditModal.value = false;
    editingClient.value = null;
  } catch (error) {
    alert('Error al actualizar el cliente');
  }
};

const handleViewClient = (client) => {
  console.log('Ver cliente:', client);
};

const handleDeleteClient = async (clientId) => {
  if (confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
    try {
      await store.deleteCliente(clientId);
      await store.fetchAll();
    } catch (error) {
      alert('Error al eliminar el cliente');
    }
  }
};

const toggleClientTickets = (clientId) => {
  expandedClientId.value = expandedClientId.value === clientId ? null : clientId;
};

const getClientTickets = (clientId) => {
  console.log('Filtrando tickets para cliente:', clientId);
  const filtered = store.tickets.filter(ticket => {
    // ticket.cliente puede ser un string (ID) o un objeto poblado
    const ticketClientId = typeof ticket.cliente === 'object' ? ticket.cliente?._id : ticket.cliente;
    const match = String(ticketClientId) === String(clientId);
    if (match) {
      console.log('Ticket encontrado:', ticket.title, 'Cliente ID:', ticketClientId);
    }
    return match;
  });
  console.log('Total tickets encontrados:', filtered.length);
  return filtered;
};
</script>

<template>
  <div class="page-content">
    <div class="page-header">
      <div>
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">Gestiona tu cartera de clientes y empresas</p>
      </div>
      <button @click="showCreateModal = true" class="btn btn-primary">
        <Plus />
        Nuevo Cliente
      </button>
    </div>

    <!-- Filtros (Simplificados para la migración) -->
    <div class="card" style="margin-bottom: 1.5rem; padding: 1rem;">
      <div class="input-with-icon">
        <Search />
        <input type="text" class="form-input" placeholder="Buscar clientes...">
      </div>
    </div>

    <!-- Grid de Clientes -->
    <div v-if="store.loading" class="empty-state">
      <p>Cargando clientes...</p>
    </div>
    
    <div v-else-if="store.clientes.length === 0" class="empty-state">
      <Users />
      <p class="empty-state-text">No hay clientes registrados.</p>
    </div>

    <div v-else class="clients-grid">
      <div v-for="client in store.clientes" :key="client._id" class="card client-card">
        <div class="client-card-header">
          <div class="client-icon">
            <Building2 />
          </div>
          <div class="client-tickets">
            <Ticket style="width: 14px; height: 14px;" />
            {{ getClientTickets(client._id).length }} Tickets
          </div>
        </div>
        
        <h3 class="client-company truncate">{{ client.nombreEmpresa }}</h3>
        <p class="client-name">{{ client.nombreContacto }}</p>

        <div class="client-details">
          <div class="client-detail">
            <Mail />
            <span class="truncate">{{ client.email }}</span>
          </div>
          <div class="client-detail">
            <Phone />
            <span>{{ client.telefono }}</span>
          </div>
        </div>

        <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem;">
          <button @click="handleEditClient(client)" class="btn btn-secondary btn-icon" title="Editar">
            <Edit />
          </button>
          <button @click="handleDeleteClient(client._id)" class="btn btn-ghost btn-icon" title="Eliminar">
            <Trash2 />
          </button>
          <button 
            @click="toggleClientTickets(client._id)" 
            class="btn btn-ghost btn-icon" 
            :title="expandedClientId === client._id ? 'Ocultar tickets' : 'Ver tickets'"
            style="margin-left: auto;"
          >
            <ChevronDown v-if="expandedClientId !== client._id" />
            <ChevronUp v-else />
          </button>
        </div>

        <!-- Tickets del cliente (expandible) -->
        <div v-if="expandedClientId === client._id" style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
          <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--foreground);">
            Tickets del cliente ({{ getClientTickets(client._id).length }})
          </h4>
          
          <div v-if="getClientTickets(client._id).length === 0" style="text-align: center; padding: 1rem; color: var(--muted-foreground);">
            <Ticket style="width: 24px; height: 24px; opacity: 0.5; margin-bottom: 0.5rem;" />
            <p style="font-size: 0.875rem;">No hay tickets registrados para este cliente</p>
          </div>
          
          <div v-else style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div 
              v-for="ticket in getClientTickets(client._id)" 
              :key="ticket._id"
              class="client-ticket-item"
              :class="{ 'ticket-completed': ticket.status === 'cerrado' }"
            >
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <div style="flex: 1; min-width: 0;">
                  <div style="font-weight: 500; font-size: 0.875rem; margin-bottom: 0.25rem; color: var(--foreground);">
                    {{ ticket.title }}
                    <span v-if="ticket.status === 'cerrado'" style="color: var(--success); font-size: 0.75rem; margin-left: 0.5rem;">
                      ✓ Completado
                    </span>
                  </div>
                  <div style="font-size: 0.75rem; color: var(--muted-foreground);">
                    #{{ ticket._id.slice(-6).toUpperCase() }} • 
                    {{ ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A' }}
                    <span v-if="ticket.endDate" style="margin-left: 0.5rem; color: var(--success);">
                      • Finalizado: {{ new Date(ticket.endDate).toLocaleDateString() }}
                    </span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-left: 1rem;">
                  <span class="badge" :class="'badge-' + (ticket.status === 'en progreso' ? 'in-progress' : ticket.status)">
                    <CheckCircle v-if="ticket.status === 'cerrado'" style="width: 10px; height: 10px; margin-right: 0.25rem;" />
                    {{ ticket.status }}
                  </span>
                  <span class="badge" :class="'badge-' + (ticket.priority === 'media' ? 'medium' : (ticket.priority === 'baja' ? 'low' : 'high'))">
                    {{ ticket.priority }}
                  </span>
                  <button 
                    @click="$router.push(`/tickets/${ticket._id}`)" 
                    class="btn btn-ghost btn-icon" 
                    title="Ver ticket"
                    style="padding: 0.25rem;"
                  >
                    <ExternalLink style="width: 14px; height: 14px;" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Edición -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Editar Cliente</h2>
        </div>
        <form @submit.prevent="handleSaveEdit" v-if="editingClient">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nombre de Contacto</label>
              <input v-model="editingClient.nombreContacto" type="text" class="form-input" required placeholder="Ej: Juan Pérez">
            </div>
            <div class="form-group">
              <label class="form-label">Nombre de la Empresa</label>
              <input v-model="editingClient.nombreEmpresa" type="text" class="form-input" required placeholder="Ej: Acme Corp">
            </div>
            <div class="form-group">
              <label class="form-label">Correo Electrónico</label>
              <input v-model="editingClient.email" type="email" class="form-input" required placeholder="correo@empresa.com">
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input v-model="editingClient.telefono" type="tel" class="form-input" placeholder="+34 600 000 000">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showEditModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de Creación -->
    <div v-if="showCreateModal" class="modal-overlay">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Registrar Nuevo Cliente</h2>
        </div>
        <form @submit.prevent="handleCreateClient">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label">Nombre de Contacto</label>
              <input v-model="newClient.nombreContacto" type="text" class="form-input" required placeholder="Ej: Juan Pérez">
            </div>
            <div class="form-group">
              <label class="form-label">Nombre de la Empresa</label>
              <input v-model="newClient.nombreEmpresa" type="text" class="form-input" required placeholder="Ej: Acme Corp">
            </div>
            <div class="form-group">
              <label class="form-label">Correo Electrónico</label>
              <input v-model="newClient.email" type="email" class="form-input" required placeholder="correo@empresa.com">
            </div>
            <div class="form-group">
              <label class="form-label">Teléfono</label>
              <input v-model="newClient.telefono" type="tel" class="form-input" placeholder="+34 600 000 000">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" @click="showCreateModal = false" class="btn btn-secondary">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
