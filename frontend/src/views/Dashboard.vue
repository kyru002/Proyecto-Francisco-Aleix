<script setup>
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppStore } from '../stores/appStore';
import { 
  Ticket, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  ChevronRight,
  TrendingUp,
  FileText,
  ArrowRight
} from 'lucide-vue-next';

const router = useRouter();
const store = useAppStore();

onMounted(async () => {
  await store.fetchAll();
});

const isClientUser = computed(() => store.currentUser?.role === 'cliente');

const stats = computed(() => {
  const t = store.tickets;
  return [
    { label: 'Total Tickets', value: t.length, icon: Ticket, class: 'stat-icon-blue', percent: 100 },
    { label: 'Abiertos', value: t.filter(x => x.status === 'abierto').length, icon: Clock, class: 'stat-icon-amber', percent: (t.filter(x => x.status === 'abierto').length / t.length * 100) || 0 },
    { label: 'Cerrados', value: t.filter(x => x.status === 'cerrado').length, icon: CheckCircle, class: 'stat-icon-green', percent: (t.filter(x => x.status === 'cerrado').length / t.length * 100) || 0 },
    { label: 'Alta Prioridad', value: t.filter(x => x.priority === 'alta' && x.status !== 'cerrado').length, icon: AlertCircle, class: 'stat-icon-red', percent: (t.filter(x => x.priority === 'alta').length / t.length * 100) || 0 },
  ];
});

const recentTickets = computed(() => store.tickets.slice(0, 5));
const recentAlbaranes = computed(() => store.albaranes.slice(0, 5));
</script>

<template>
  <div class="page-content">
    <!-- DASHBOARD PARA CLIENTE -->
    <template v-if="isClientUser">
      <div class="page-header">
        <div>
          <h1 class="page-title">Mi Resumen</h1>
          <p class="page-subtitle">Panel de control de {{ store.currentUser?.empresa?.nombreEmpresa || 'tu empresa' }}</p>
        </div>
        <router-link to="/tickets" class="btn btn-primary">
          <Plus style="width: 18px; height: 18px; margin-right: 0.5rem;" />
          Nuevo Ticket
        </router-link>
      </div>
      <div class="stats-grid" style="margin-bottom: 2rem; grid-template-columns: repeat(3, 1fr);">
        <div class="stat-card">
          <div class="stat-icon stat-icon-blue">
            <Ticket />
          </div>
          <div>
            <div class="stat-label">Mis Tickets</div>
            <div class="stat-value">{{ store.tickets.length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-amber">
            <Clock />
          </div>
          <div>
            <div class="stat-label">Por Resolver</div>
            <div class="stat-value">{{ store.tickets.filter(x => x.status !== 'cerrado').length }}</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-green">
            <CheckCircle />
          </div>
          <div>
            <div class="stat-label">Resueltos</div>
            <div class="stat-value">{{ store.tickets.filter(x => x.status === 'cerrado').length }}</div>
          </div>
        </div>
      </div>

      <!-- Grid para Cliente: Tickets -->
      <div style="display: grid; grid-template-columns: 1fr; gap: 1.5rem;">
        <!-- Mis Tickets -->
        <div class="card">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <h2 class="card-title">Mis Tickets Recientes</h2>
            <router-link to="/tickets" class="btn btn-ghost" style="font-size: 0.75rem; display: flex; align-items: center; gap: 0.25rem;">
              Ver todos
              <ArrowRight style="width: 14px; height: 14px;" />
            </router-link>
          </div>
          <div class="card-content">
            <div v-if="recentTickets.length === 0" class="empty-state">
              <Ticket style="width: 40px; height: 40px; opacity: 0.3; margin-bottom: 1rem;" />
              <p>No tienes tickets aún.</p>
            </div>
            <div v-else>
              <div v-for="ticket in recentTickets" :key="ticket._id" class="ticket-list-item" style="cursor: pointer;" @click="router.push(`/tickets/${ticket._id}`)">
                <div class="ticket-info">
                  <div class="ticket-title">{{ ticket.title }}</div>
                  <div class="ticket-meta">
                    Creado: {{ new Date(ticket.startDate).toLocaleDateString('es-ES') }}
                    <span v-if="ticket.endDate">• Cerrado: {{ new Date(ticket.endDate).toLocaleDateString('es-ES') }}</span>
                    <span v-if="ticket.tecnico" style="margin-left: 0.5rem; color: var(--primary);">• Técnico: {{ ticket.tecnico.nombre }}</span>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 1rem;">
                  <div class="ticket-badges">
                    <span class="badge" :class="'badge-' + ticket.status">{{ ticket.status }}</span>
                    <span class="badge" :class="'badge-' + ticket.priority">{{ ticket.priority }}</span>
                  </div>
                  <ChevronRight style="width: 18px; height: 18px; color: var(--muted-foreground);" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- DASHBOARD PARA ADMIN/TÉCNICO -->
    <template v-else>
      <div class="page-header">
        <div>
          <h1 class="page-title">Panel de Control</h1>
          <p class="page-subtitle">Bienvenido de nuevo al sistema de soporte</p>
        </div>
      </div>

      <!-- Grid de Estadísticas -->
      <div class="stats-grid" style="margin-bottom: 2rem;">
        <div v-for="stat in stats" :key="stat.label" class="stat-card">
          <div class="stat-icon" :class="stat.class">
            <component :is="stat.icon" />
          </div>
          <div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-value">{{ stat.value }}</div>
          </div>
        </div>
      </div>

      <div class="ticket-detail-grid">
        <!-- Tickets Recientes -->
        <div class="card">
          <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
            <h2 class="card-title">Tickets Recientes</h2>
            <router-link to="/tickets" class="btn btn-ghost" style="font-size: 0.75rem;">Ver todos</router-link>
          </div>
          <div class="card-content">
            <div v-if="recentTickets.length === 0" class="empty-state">
              <p>No hay tickets recientes.</p>
            </div>
            <div v-else>
              <div v-for="ticket in recentTickets" :key="ticket._id" class="ticket-list-item">
                <div class="ticket-info">
                  <div class="ticket-title">{{ ticket.title }}</div>
                  <div class="ticket-meta">{{ ticket.cliente?.nombreEmpresa || 'Cargando...' }} • Asignado a: {{ ticket.tecnico?.nombre || 'Sin asignar' }}</div>
                </div>
                <div class="ticket-badges">
                  <span class="badge" :class="'badge-' + ticket.status">{{ ticket.status }}</span>
                  <span class="badge" :class="'badge-' + ticket.priority">{{ ticket.priority }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Resumen de Actividad / Otros -->
        <div class="card">
          <div class="card-header">
            <h2 class="card-title">Resumen de Estado</h2>
          </div>
          <div class="card-content">
            <div v-for="stat in stats" :key="'prog-' + stat.label" class="progress-container">
              <div class="progress-header">
                <span class="progress-label">{{ stat.label }}</span>
                <span class="progress-value">{{ Math.round(stat.percent) }}%</span>
              </div>
              <div class="progress-bar">
                <div class="progress-fill" :class="'progress-fill-' + stat.class.split('-')[2]" :style="{ width: stat.percent + '%' }"></div>
              </div>
            </div>
            
            <div style="margin-top: 2rem; padding: 1rem; background-color: var(--primary-light); border-radius: var(--radius); color: var(--primary); display: flex; align-items: center; gap: 1rem;">
              <TrendingUp />
              <div style="font-size: 0.875rem; font-weight: 500;">
                El volumen de tickets ha subido un 12% esta semana.
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
