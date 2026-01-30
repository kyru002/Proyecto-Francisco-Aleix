

function navigateTo(page, params = {}) {
  appState.currentPage = page;
  appState.pageParams = params;

  // Cerrar sidebar en movil
  closeSidebar();

  // Renderizar la pagina correspondiente
  renderApp();
}

// ========================================
// Iconos SVG
// ========================================

const icons = {
  headphones: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>`,
  dashboard: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>`,
  ticket: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M13 5v2"/><path d="M13 17v2"/><path d="M13 11v2"/></svg>`,
  fileText: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  building: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
  users: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
  logout: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  plus: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  alertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
  clock: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  checkCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
  arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
  arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 19-7-7 7-7"/><path d="M19 12H5"/></svg>`,
  calendar: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  moreVertical: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="12" cy="5" r="1"/><circle cx="12" cy="19" r="1"/></svg>`,
  edit: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>`,
  trash: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  shield: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  wrench: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  user: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  send: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>`,
  menu: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>`,
  x: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
};

// ========================================
// Componentes Reutilizables
// ========================================

function renderStatusBadge(status) {
  const statusClasses = {
    open: 'badge-open',
    abierto: 'badge-open',
    in_progress: 'badge-in-progress',
    'en progreso': 'badge-in-progress',
    closed: 'badge-closed',
    cerrado: 'badge-closed',
  };
  const statusLabels = {
    open: 'Abierto',
    abierto: 'Abierto',
    in_progress: 'En Progreso',
    'en progreso': 'En Progreso',
    closed: 'Cerrado',
    cerrado: 'Cerrado',
  };
  return `<span class="badge ${statusClasses[status] || 'badge-unknown'}">${statusLabels[status] || status}</span>`;
}

function renderPriorityBadge(priority) {
  const priorityClasses = {
    high: 'badge-high',
    alta: 'badge-high',
    medium: 'badge-medium',
    media: 'badge-medium',
    low: 'badge-low',
    baja: 'badge-low',
  };
  const priorityLabels = {
    high: 'Alta',
    alta: 'Alta',
    medium: 'Media',
    media: 'Media',
    low: 'Baja',
    baja: 'Baja',
  };
  return `<span class="badge ${priorityClasses[priority] || 'badge-unknown'}">${priorityLabels[priority] || priority}</span>`;
}

function renderUserStatusBadge(status) {
  return `<span class="badge badge-${status}">${status === 'active' ? 'Activo' : 'Inactivo'}</span>`;
}

// ========================================
// Sidebar
// ========================================

function renderSidebar() {
  const user = appState.currentUser;
  if (!user) return '';

  const navItems = [
    { name: 'Dashboard', page: 'dashboard', icon: 'dashboard', roles: ['admin', 'technician'] },
    { name: 'Tickets', page: 'tickets', icon: 'ticket', roles: ['admin', 'technician', 'client'] },
    { name: 'Albaranes', page: 'albaranes', icon: 'fileText', roles: ['admin', 'technician'] },
    { name: 'Clientes', page: 'clients', icon: 'building', roles: ['admin', 'technician'] },
    { name: 'Equipo', page: 'users', icon: 'users', roles: ['admin'] },
  ];

  const filteredNav = navItems.filter(item => item.roles.includes(user.role));

  return `
    <aside class="sidebar ${appState.sidebarOpen ? 'open' : ''}" id="sidebar">
      <div class="sidebar-header">
        <div class="sidebar-logo">${icons.headphones}</div>
        <span class="sidebar-title">SupportDesk</span>
      </div>
      
      <nav class="sidebar-nav">
        ${filteredNav.map(item => `
          <a href="#" class="sidebar-nav-item ${appState.currentPage === item.page ? 'active' : ''}" 
             onclick="navigateTo('${item.page}'); return false;">
            ${icons[item.icon]}
            ${item.name}
          </a>
        `).join('')}
      </nav>
      
      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">${user.name.charAt(0)}</div>
          <div class="sidebar-user-info">
            <p class="sidebar-user-name truncate">${user.name}</p>
            <p class="sidebar-user-email truncate">${user.role === 'client' && user.companyName ? user.companyName : user.email}</p>
          </div>
        </div>
        <button class="sidebar-logout" onclick="logout()">
          ${icons.logout}
          Cerrar Sesion
        </button>
      </div>
    </aside>
    <div class="sidebar-overlay ${appState.sidebarOpen ? 'open' : ''}" onclick="closeSidebar()"></div>
  `;
}

function toggleSidebar() {
  appState.sidebarOpen = !appState.sidebarOpen;
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.toggle('open', appState.sidebarOpen);
  if (overlay) overlay.classList.toggle('open', appState.sidebarOpen);
}

function closeSidebar() {
  appState.sidebarOpen = false;
  const sidebar = document.getElementById('sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  if (sidebar) sidebar.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
}

// ========================================
// Pagina de Login
// ========================================

function renderLoginPage() {
  return `
    <main class="login-page">
      <div class="card login-card">
        <div class="login-header">
          <div class="login-logo">${icons.headphones}</div>
          <h1 class="login-title">Bienvenido a SupportDesk</h1>
          <p class="login-description">Inicia sesion para gestionar tus tickets de soporte</p>
        </div>
        <div class="login-body">
          <form id="loginForm" onsubmit="handleLogin(event)">
            <div id="loginError" class="login-error hidden">
              ${icons.alertCircle}
              <span>Email o contrasena incorrectos</span>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input type="email" id="email" class="form-input" placeholder="tu@ejemplo.com" required>
            </div>
            
            <div class="form-group">
              <label class="form-label" for="password">Contrasena</label>
              <input type="password" id="password" class="form-input" placeholder="Ingresa tu contrasena" required>
            </div>
            
            <button type="submit" class="btn btn-primary" style="width: 100%;" id="loginBtn">
              Iniciar Sesion
            </button>
          </form>
          
          <div class="login-demo">
            <p class="login-demo-title">Credenciales de Demo:</p>
            <div class="login-demo-credentials">
              <p><strong>Admin:</strong> admin@support.com / admin123</p>
              <p><strong>Tecnico:</strong> tech@support.com / tech123</p>
              <p style="border-top: 1px solid #e2e8f0; padding-top: 4px; margin-top: 4px;"><strong>Clientes:</strong></p>
              <p><strong>Acme Corp:</strong> client@company.com / client123</p>
              <p><strong>TechStart:</strong> techstart@client.com / client123</p>
              <p><strong>Global:</strong> global@client.com / client123</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

function handleLogin(event) {
  event.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorDiv = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');

  btn.textContent = 'Iniciando sesion...';
  btn.disabled = true;

  setTimeout(() => {
    if (login(email, password)) {
      navigateTo('dashboard');
    } else {
      errorDiv.classList.remove('hidden');
      btn.textContent = 'Iniciar Sesion';
      btn.disabled = false;
    }
  }, 500);
}

// ========================================
// Pagina Dashboard
// ========================================

async function renderDashboardPage() {
  const user = appState.currentUser;
  const tickets = await fetchTickets();
  const stats = getStats();
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return `
    <button class="mobile-menu-btn" onclick="toggleSidebar()">${icons.menu}</button>
    ${renderSidebar()}
    <main class="main-content with-sidebar">
      <div class="page-content">
        <div class="page-header">
          <div>
            <h1 class="page-title">Bienvenido, ${user.name.split(' ')[0]}</h1>
            <p class="page-subtitle">
              ${isClient()
      ? `Estado de tus tickets de soporte para ${user.companyName || 'tu empresa'}.`
      : 'Esto es lo que esta pasando con tus tickets de soporte hoy.'
    }
            </p>
          </div>
        </div>
        
        <div class="stats-grid" style="margin-bottom: 2rem;">
          <div class="stat-card">
            <div class="stat-icon stat-icon-blue">${icons.ticket}</div>
            <div>
              <p class="stat-label">${isClient() ? 'Mis Tickets' : 'Total Tickets'}</p>
              <p class="stat-value">${stats.total}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-icon-amber">${icons.clock}</div>
            <div>
              <p class="stat-label">En Progreso</p>
              <p class="stat-value">${stats.inProgress}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-icon-red">${icons.alertCircle}</div>
            <div>
              <p class="stat-label">Alta Prioridad</p>
              <p class="stat-value">${stats.highPriority}</p>
            </div>
          </div>
          
          <div class="stat-card">
            <div class="stat-icon stat-icon-green">${icons.checkCircle}</div>
            <div>
              <p class="stat-label">Resueltos</p>
              <p class="stat-value">${stats.closed}</p>
            </div>
          </div>
        </div>
        
        <div style="display: grid; gap: 1.5rem; grid-template-columns: 1fr;">
          <div class="card" style="grid-column: span 1;">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: center;">
              <h2 class="card-title">${isClient() ? 'Mis Tickets Recientes' : 'Tickets Recientes'}</h2>
              <a href="#" onclick="navigateTo('tickets'); return false;" class="btn btn-ghost" style="font-size: 0.875rem;">
                Ver todos ${icons.arrowRight}
              </a>
            </div>
            <div class="card-content">
              ${recentTickets.length === 0
      ? '<div class="empty-state"><p class="empty-state-text">No hay tickets aun</p></div>'
      : recentTickets.map(ticket => `
                  <div class="ticket-list-item" onclick="navigateTo('ticket-detail', { id: '${ticket.id}' })">
                    <div class="ticket-info">
                      <p class="ticket-title">${ticket.title}</p>
                      <p class="ticket-meta">${isClient() ? `Actualizado ${formatDate(ticket.updatedAt)}` : ticket.clientName}</p>
                    </div>
                    <div class="ticket-badges">
                      ${renderPriorityBadge(ticket.priority)}
                      ${renderStatusBadge(ticket.status)}
                    </div>
                  </div>
                `).join('')
    }
            </div>
          </div>
          
          <div class="card">
            <div class="card-header">
              <h2 class="card-title">Estadisticas Rapidas</h2>
            </div>
            <div class="card-content">
              <div class="progress-container">
                <div class="progress-header">
                  <span class="progress-label">Tickets Abiertos</span>
                  <span class="progress-value">${stats.open}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill progress-fill-blue" style="width: ${stats.total > 0 ? (stats.open / stats.total) * 100 : 0}%"></div>
                </div>
              </div>
              
              <div class="progress-container">
                <div class="progress-header">
                  <span class="progress-label">En Progreso</span>
                  <span class="progress-value">${stats.inProgress}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill progress-fill-amber" style="width: ${stats.total > 0 ? (stats.inProgress / stats.total) * 100 : 0}%"></div>
                </div>
              </div>
              
              <div class="progress-container">
                <div class="progress-header">
                  <span class="progress-label">Cerrados</span>
                  <span class="progress-value">${stats.closed}</span>
                </div>
                <div class="progress-bar">
                  <div class="progress-fill progress-fill-green" style="width: ${stats.total > 0 ? (stats.closed / stats.total) * 100 : 0}%"></div>
                </div>
              </div>
              
              ${!isClient() ? `
                <div style="border-top: 1px solid var(--border); padding-top: 1rem; margin-top: 1rem;">
                  <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <div class="stat-icon stat-icon-blue" style="width: 40px; height: 40px;">
                      ${icons.users}
                    </div>
                    <div>
                      <p class="stat-label">Total Clientes</p>
                      <p style="font-size: 1.125rem; font-weight: 600;">${stats.clients}</p>
                    </div>
                  </div>
                </div>
              ` : ''}
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

// ========================================
// Pagina de Tickets
// ========================================

async function renderTicketsPage() {
  const tickets = await fetchTickets();
  const clients = getClients();
  const technicians = getTeamUsers().filter(u => u.role === 'technician' && u.status === 'active');

  return `
    <button class="mobile-menu-btn" onclick="toggleSidebar()">${icons.menu}</button>
    ${renderSidebar()}
    <main class="main-content with-sidebar">
      <div class="page-content">
        <div class="page-header">
          <div>
            <h1 class="page-title">${isClient() ? 'Mis Tickets' : 'Tickets'}</h1>
            <p class="page-subtitle">
              ${isClient()
      ? `Ver tickets de ${appState.currentUser?.companyName || 'tu empresa'}`
      : 'Gestiona y rastrea todos los tickets de soporte'
    }
            </p>
          </div>
          <button class="btn btn-primary" onclick="openCreateTicketModal()">
            ${icons.plus} Nuevo Ticket
          </button>
        </div>
        
        <div class="card">
          <div class="card-header">
            <div class="filters-bar">
              <div class="input-with-icon" style="flex: 1; max-width: 300px;">
                ${icons.search}
                <input type="text" class="form-input" placeholder="Buscar tickets..." id="ticketSearch" oninput="filterTickets()">
              </div>
              <select class="form-input form-select" id="statusFilter" onchange="filterTickets()">
                <option value="all">Todos los Estados</option>
                <option value="open">Abierto</option>
                <option value="in_progress">En Progreso</option>
                <option value="closed">Cerrado</option>
              </select>
              ${!isClient() ? `
                <select class="form-input form-select" id="priorityFilter" onchange="filterTickets()">
                  <option value="all">Todas las Prioridades</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                </select>
                <select class="form-input form-select" id="clientFilter" onchange="filterTickets()">
                  <option value="all">Todos los Clientes</option>
                  ${clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              ` : ''}
            </div>
          </div>
          <div class="card-content">
            <div class="table-container">
              <table class="table" id="ticketsTable">
                <thead>
                  <tr>
                    <th>Ticket</th>
                    ${!isClient() ? '<th>Cliente</th>' : ''}
                    <th>Estado</th>
                    <th>Prioridad</th>
                    <th>Asignado a</th>
                    <th>Actualizado</th>
                    ${isAdmin() ? '<th class="sr-only">Acciones</th>' : ''}
                  </tr>
                </thead>
                <tbody id="ticketsTableBody">
                  ${renderTicketsTableBody(tickets)}
                </tbody>
              </table>
            </div>
            <div id="emptyTickets" class="empty-state hidden">
              <p class="empty-state-text">No se encontraron tickets</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Modal Crear Ticket -->
    <div id="createTicketModal" class="modal-overlay hidden">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Crear Nuevo Ticket</h2>
        </div>
        <form onsubmit="handleCreateTicket(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="ticketTitle">Titulo</label>
              <input type="text" id="ticketTitle" class="form-input" placeholder="Descripcion breve del problema" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="ticketDescription">Descripcion</label>
              <textarea id="ticketDescription" class="form-input form-textarea" placeholder="Descripcion detallada del problema..." required></textarea>
            </div>
            ${!isClient() ? `
              <div class="form-group">
                <label class="form-label" for="ticketClient">Cliente</label>
                <select id="ticketClient" class="form-input form-select" required>
                  <option value="">Seleccionar cliente</option>
                  ${clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="ticketPriority">Prioridad</label>
                <select id="ticketPriority" class="form-input form-select">
                  <option value="baja">Baja</option>
                  <option value="media" selected>Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            ` : ''}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal('createTicketModal')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Crear Ticket</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Editar Ticket -->
    <div id="editTicketModal" class="modal-overlay hidden">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Editar Ticket</h2>
        </div>
        <form onsubmit="handleEditTicket(event)">
          <div class="modal-body">
            <input type="hidden" id="editTicketId">
            <div class="form-group">
              <label class="form-label" for="editTicketTitle">Titulo</label>
              <input type="text" id="editTicketTitle" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="editTicketDescription">Descripcion</label>
              <textarea id="editTicketDescription" class="form-input form-textarea" required></textarea>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div class="form-group">
                <label class="form-label" for="editTicketStatus">Estado</label>
                <select id="editTicketStatus" class="form-input form-select">
                  <option value="abierto">Abierto</option>
                  <option value="en progreso">En Progreso</option>
                  <option value="cerrado">Cerrado</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label" for="editTicketPriority">Prioridad</label>
                <select id="editTicketPriority" class="form-input form-select">
                  <option value="baja">Baja</option>
                  <option value="media">Media</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </div>
            <div class="form-group">
              <label class="form-label" for="editTicketClient">Cliente</label>
              <select id="editTicketClient" class="form-input form-select">
                ${clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="editTicketAssigned">Asignado a</label>
              <select id="editTicketAssigned" class="form-input form-select">
                <option value="">Sin asignar</option>
                ${technicians.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal('editTicketModal')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Confirmar Eliminacion -->
    <div id="deleteTicketModal" class="modal-overlay hidden">
      <div class="modal" style="max-width: 400px;">
        <div class="modal-header">
          <h2 class="modal-title">Eliminar Ticket</h2>
        </div>
        <div class="modal-body">
          <p>Estas seguro de que deseas eliminar este ticket? Esta accion no se puede deshacer.</p>
          <input type="hidden" id="deleteTicketId">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('deleteTicketModal')">Cancelar</button>
          <button type="button" class="btn btn-destructive" onclick="handleDeleteTicket()">Eliminar</button>
        </div>
      </div>
    </div>
  `;
}

function renderTicketsTableBody(tickets) {
  if (tickets.length === 0) {
    return '';
  }

  return tickets.map(ticket => `
    <tr>
      <td>
        <a href="#" onclick="navigateTo('ticket-detail', { id: '${ticket.id}' }); return false;" style="font-weight: 500; color: var(--foreground); text-decoration: none;">
          ${ticket.title}
        </a>
        <p class="line-clamp-1" style="font-size: 0.875rem; color: var(--muted-foreground); margin-top: 0.25rem;">
          ${ticket.description}
        </p>
      </td>
      ${!isClient() ? `<td style="font-size: 0.875rem;">${ticket.clientName}</td>` : ''}
      <td>${renderStatusBadge(ticket.status)}</td>
      <td>${renderPriorityBadge(ticket.priority)}</td>
      <td style="font-size: 0.875rem; color: var(--muted-foreground);">${ticket.assignedToName || 'Sin asignar'}</td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem; color: var(--muted-foreground);">
          ${icons.calendar}
          ${formatDate(ticket.updatedAt)}
        </div>
      </td>
      ${isAdmin() ? `
        <td>
          <div class="dropdown">
            <button class="btn btn-ghost btn-icon" onclick="toggleDropdown('dropdown-${ticket.id}')">
              ${icons.moreVertical}
            </button>
            <div id="dropdown-${ticket.id}" class="dropdown-menu">
              <button class="dropdown-item" onclick="openEditTicketModal('${ticket.id}')">
                ${icons.edit} Editar
              </button>
              <div class="dropdown-separator"></div>
              <button class="dropdown-item dropdown-item-destructive" onclick="openDeleteTicketModal('${ticket.id}')">
                ${icons.trash} Eliminar
              </button>
            </div>
          </div>
        </td>
      ` : ''}
    </tr>
  `).join('');
}

function filterTickets() {
  const search = document.getElementById('ticketSearch').value.toLowerCase();
  const status = document.getElementById('statusFilter').value;
  const priority = document.getElementById('priorityFilter')?.value || 'all';
  const client = document.getElementById('clientFilter')?.value || 'all';

  let tickets = getTickets();

  tickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(search) ||
      ticket.description.toLowerCase().includes(search);

    const ticketStatus = ticket.status.toLowerCase();
    const statusMap = { 'abierto': 'open', 'en progreso': 'in_progress', 'cerrado': 'closed' };
    const normalizedStatus = statusMap[ticketStatus] || ticketStatus;

    const matchesStatus = status === 'all' || normalizedStatus === status || ticketStatus === status;

    const ticketPriority = ticket.priority.toLowerCase();
    const priorityMap = { 'baja': 'low', 'media': 'medium', 'alta': 'high' };
    const normalizedPriority = priorityMap[ticketPriority] || ticketPriority;

    const matchesPriority = priority === 'all' || normalizedPriority === priority || ticketPriority === priority;
    const matchesClient = client === 'all' || ticket.clientId === client;

    return matchesSearch && matchesStatus && matchesPriority && matchesClient;
  });

  const tbody = document.getElementById('ticketsTableBody');
  const emptyDiv = document.getElementById('emptyTickets');

  if (tickets.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.classList.remove('hidden');
  } else {
    tbody.innerHTML = renderTicketsTableBody(tickets);
    emptyDiv.classList.add('hidden');
  }
}

function openCreateTicketModal() {
  openModal('createTicketModal');
}

async function handleCreateTicket(event) {
  event.preventDefault();

  const title = document.getElementById('ticketTitle').value;
  const description = document.getElementById('ticketDescription').value;
  const clientId = isClient() ? appState.currentUser.companyId : document.getElementById('ticketClient').value;
  const priority = isClient() ? 'media' : document.getElementById('ticketPriority').value;

  const client = getClients().find(c => c.id === clientId);

  await createTicket({
    title,
    description,
    status: 'abierto',
    priority,
    clientId,
    clientName: client?.name || appState.currentUser?.companyName || 'Desconocido',
  });

  closeModal('createTicketModal');
  await navigateTo('tickets');
}

async function openEditTicketModal(ticketId) {
  const ticket = await fetchTicketById(ticketId);
  if (!ticket) return;

  document.getElementById('editTicketId').value = ticket.id;
  document.getElementById('editTicketTitle').value = ticket.title;
  document.getElementById('editTicketDescription').value = ticket.description;
  document.getElementById('editTicketStatus').value = ticket.status;
  document.getElementById('editTicketPriority').value = ticket.priority;
  document.getElementById('editTicketClient').value = ticket.clientId || '';
  document.getElementById('editTicketAssigned').value = ticket.assignedTo || '';

  closeAllDropdowns();
  openModal('editTicketModal');
}

async function handleEditTicket(event) {
  event.preventDefault();

  const id = document.getElementById('editTicketId').value;
  const title = document.getElementById('editTicketTitle').value;
  const description = document.getElementById('editTicketDescription').value;
  const status = document.getElementById('editTicketStatus').value;
  const priority = document.getElementById('editTicketPriority').value;
  const clientId = document.getElementById('editTicketClient').value;
  const assignedTo = document.getElementById('editTicketAssigned').value;

  // Los objetos de cliente y tecnico pueden no estar disponibles si son de la BD
  // Enviamos lo que tenemos

  await updateTicketAPI(id, {
    title,
    description,
    status,
    priority,
    clientId,
    assignedTo
  });

  closeModal('editTicketModal');
  await navigateTo('tickets');
}

function openDeleteTicketModal(ticketId) {
  document.getElementById('deleteTicketId').value = ticketId;
  closeAllDropdowns();
  openModal('deleteTicketModal');
}

async function handleDeleteTicket() {
  const id = document.getElementById('deleteTicketId').value;
  await deleteTicketAPI(id);
  closeModal('deleteTicketModal');
  await navigateTo('tickets');
}

// ========================================
// Pagina Detalle de Ticket
// ========================================

async function renderTicketDetailPage() {
  const ticketId = appState.pageParams?.id;
  const ticket = await fetchTicketById(ticketId);

  if (!ticket) {
    return `
      <button class="mobile-menu-btn" onclick="toggleSidebar()">${icons.menu}</button>
      ${renderSidebar()}
      <main class="main-content with-sidebar">
        <div class="page-content">
          <div class="empty-state">
            <p class="empty-state-text">Ticket no encontrado</p>
            <button class="btn btn-primary" onclick="navigateTo('tickets')" style="margin-top: 1rem;">
              Volver a Tickets
            </button>
          </div>
        </div>
      </main>
    `;
  }

  const messages = getMessagesByTicketId(ticketId);
  const technicians = getTeamUsers().filter(u => u.role === 'technician' && u.status === 'active');

  return `
    <button class="mobile-menu-btn" onclick="toggleSidebar()">${icons.menu}</button>
    ${renderSidebar()}
    <main class="main-content with-sidebar">
      <div class="page-content">
        <div style="margin-bottom: 1.5rem;">
          <a href="#" onclick="navigateTo('tickets'); return false;" class="btn btn-ghost" style="margin-bottom: 1rem;">
            ${icons.arrowLeft} Volver a Tickets
          </a>
          <div class="ticket-detail-header">
            <div>
              <h1 class="page-title">${ticket.title}</h1>
              <div class="ticket-detail-badges">
                ${renderStatusBadge(ticket.status)}
                ${renderPriorityBadge(ticket.priority)}
              </div>
            </div>
            ${(isAdmin() || isTechnician()) ? `
              <div style="display: flex; gap: 0.5rem;">
                <select class="form-input form-select" style="width: auto;" onchange="updateTicketStatus('${ticket.id}', this.value)">
                  <option value="open" ${ticket.status === 'open' ? 'selected' : ''}>Abierto</option>
                  <option value="in_progress" ${ticket.status === 'in_progress' ? 'selected' : ''}>En Progreso</option>
                  <option value="closed" ${ticket.status === 'closed' ? 'selected' : ''}>Cerrado</option>
                </select>
              </div>
            ` : ''}
          </div>
        </div>
        
        <div class="ticket-detail-grid">
          <div>
            <div class="card" style="margin-bottom: 1.5rem;">
              <div class="card-header">
                <h2 class="card-title">Descripcion</h2>
              </div>
              <div class="card-content">
                <p style="color: var(--muted-foreground);">${ticket.description}</p>
              </div>
            </div>
            
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Conversacion</h2>
              </div>
              <div class="card-content" style="padding: 0;">
                <div class="chat-container">
                  <div class="chat-messages" id="chatMessages">
                    ${messages.length === 0
      ? '<p style="text-align: center; color: var(--muted-foreground); padding: 2rem;">No hay mensajes aun</p>'
      : messages.map(msg => `
                        <div class="chat-message ${msg.senderRole === 'client' ? 'chat-message-client' : 'chat-message-team'}">
                          <div class="chat-message-sender">${msg.senderName}</div>
                          <div class="chat-message-content">${msg.content}</div>
                          <div class="chat-message-time">${formatDateTime(msg.timestamp)}</div>
                        </div>
                      `).join('')
    }
                  </div>
                  <div class="chat-input">
                    <input type="text" class="form-input" id="chatInput" placeholder="Escribe un mensaje...">
                    <button class="btn btn-primary btn-icon" onclick="sendMessage('${ticket.id}')">
                      ${icons.send}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div class="card">
              <div class="card-header">
                <h2 class="card-title">Detalles</h2>
              </div>
              <div class="card-content">
                <div class="ticket-info-grid">
                  <div class="ticket-info-item">
                    <p class="ticket-info-label">Cliente</p>
                    <p class="ticket-info-value">${ticket.clientName}</p>
                  </div>
                  <div class="ticket-info-item">
                    <p class="ticket-info-label">Asignado a</p>
                    <p class="ticket-info-value">${ticket.assignedToName || 'Sin asignar'}</p>
                  </div>
                  <div class="ticket-info-item">
                    <p class="ticket-info-label">Creado</p>
                    <p class="ticket-info-value">${formatDate(ticket.createdAt)}</p>
                  </div>
                  <div class="ticket-info-item">
                    <p class="ticket-info-label">Actualizado</p>
                    <p class="ticket-info-value">${formatDate(ticket.updatedAt)}</p>
                  </div>
                </div>
                
                ${(isAdmin() || isTechnician()) ? `
                  <div style="border-top: 1px solid var(--border); margin-top: 1.5rem; padding-top: 1.5rem;">
                    <div class="form-group">
                      <label class="form-label">Asignar a Tecnico</label>
                      <select class="form-input form-select" onchange="assignTicket('${ticket.id}', this.value)">
                        <option value="">Sin asignar</option>
                        ${technicians.map(t => `
                          <option value="${t.id}" ${ticket.assignedTo === t.id ? 'selected' : ''}>${t.name}</option>
                        `).join('')}
                      </select>
                    </div>
                  </div>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;
}

function updateTicketStatus(ticketId, status) {
  updateTicket(ticketId, { status });
  navigateTo('ticket-detail', { id: ticketId });
}

function assignTicket(ticketId, technicianId) {
  const technician = getTeamUsers().find(u => u.id === technicianId);
  updateTicket(ticketId, {
    assignedTo: technicianId || undefined,
    assignedToName: technician?.name || undefined,
  });
  navigateTo('ticket-detail', { id: ticketId });
}

function sendMessage(ticketId) {
  const input = document.getElementById('chatInput');
  const content = input.value.trim();

  if (!content) return;

  const user = appState.currentUser;
  addMessage({
    ticketId,
    senderId: user.id,
    senderName: user.name,
    senderRole: user.role,
    content,
  });

  input.value = '';
  navigateTo('ticket-detail', { id: ticketId });

  // Scroll al final del chat
  setTimeout(() => {
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }, 100);
}

// ========================================
// Pagina de Clientes
// ========================================

function renderClientsPage() {
  const clients = getClients();

  return `
    <button class="mobile-menu-btn" onclick="toggleSidebar()">${icons.menu}</button>
    ${renderSidebar()}
    <main class="main-content with-sidebar">
      <div class="page-content">
        <div class="page-header">
          <div>
            <h1 class="page-title">Clientes</h1>
            <p class="page-subtitle">Gestiona tus organizaciones cliente</p>
          </div>
          <button class="btn btn-primary" onclick="openModal('createClientModal')">
            ${icons.plus} Agregar Cliente
          </button>
        </div>
        
        <div style="margin-bottom: 1.5rem;">
          <div class="input-with-icon" style="max-width: 300px;">
            ${icons.search}
            <input type="text" class="form-input" placeholder="Buscar clientes..." id="clientSearch" oninput="filterClients()">
          </div>
        </div>
        
        <div class="clients-grid" id="clientsGrid">
          ${renderClientCards(clients)}
        </div>
        
        <div id="emptyClients" class="empty-state hidden">
          <p class="empty-state-text">No se encontraron clientes</p>
        </div>
      </div>
    </main>
    
    <!-- Modal Crear Cliente -->
    <div id="createClientModal" class="modal-overlay hidden">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Agregar Nuevo Cliente</h2>
        </div>
        <form onsubmit="handleCreateClient(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="clientName">Nombre de Contacto</label>
              <input type="text" id="clientName" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="clientCompany">Empresa</label>
              <input type="text" id="clientCompany" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="clientEmail">Email</label>
              <input type="email" id="clientEmail" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="clientPhone">Telefono</label>
              <input type="tel" id="clientPhone" class="form-input">
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal('createClientModal')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Agregar Cliente</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function renderClientCards(clients) {
  return clients.map(client => `
    <div class="card client-card">
      <div class="client-card-header">
        <div class="client-icon">${icons.building}</div>
        <div class="client-tickets">
          ${icons.ticket}
          ${client.ticketCount} tickets
        </div>
      </div>
      <h3 class="client-company">${client.company}</h3>
      <p class="client-name">${client.name}</p>
      <div class="client-details">
        <div class="client-detail">
          ${icons.mail}
          <span class="truncate">${client.email}</span>
        </div>
        <div class="client-detail">
          ${icons.phone}
          <span>${client.phone}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function filterClients() {
  const search = document.getElementById('clientSearch').value.toLowerCase();
  let clients = getClients();

  clients = clients.filter(client =>
    client.name.toLowerCase().includes(search) ||
    client.company.toLowerCase().includes(search) ||
    client.email.toLowerCase().includes(search)
  );

  const grid = document.getElementById('clientsGrid');
  const emptyDiv = document.getElementById('emptyClients');

  if (clients.length === 0) {
    grid.innerHTML = '';
    emptyDiv.classList.remove('hidden');
  } else {
    grid.innerHTML = renderClientCards(clients);
    emptyDiv.classList.add('hidden');
  }
}

function handleCreateClient(event) {
  event.preventDefault();

  addClient({
    name: document.getElementById('clientName').value,
    company: document.getElementById('clientCompany').value,
    email: document.getElementById('clientEmail').value,
    phone: document.getElementById('clientPhone').value,
  });

  closeModal('createClientModal');
  navigateTo('clients');
}

// ========================================
// Pagina de Usuarios/Equipo
// ========================================

function renderUsersPage() {
  if (!isAdmin()) {
    return `
      <button class="mobile-menu-btn" onclick="toggleSidebar()">${icons.menu}</button>
      ${renderSidebar()}
      <main class="main-content with-sidebar">
        <div class="page-content">
          <div class="empty-state">
            <p class="empty-state-text">No tienes permiso para ver esta pagina.</p>
          </div>
        </div>
      </main>
    `;
  }

  const teamUsers = getTeamUsers();

  return `
    <button class="mobile-menu-btn" onclick="toggleSidebar()">${icons.menu}</button>
    ${renderSidebar()}
    <main class="main-content with-sidebar">
      <div class="page-content">
        <div class="page-header">
          <div>
            <h1 class="page-title">Miembros del Equipo</h1>
            <p class="page-subtitle">Gestiona tu equipo de soporte y sus roles</p>
          </div>
          <button class="btn btn-primary" onclick="openModal('createUserModal')">
            ${icons.plus} Agregar Miembro
          </button>
        </div>
        
        <div class="card">
          <div class="card-header">
            <div class="input-with-icon" style="max-width: 300px;">
              ${icons.search}
              <input type="text" class="form-input" placeholder="Buscar miembros del equipo..." id="userSearch" oninput="filterUsers()">
            </div>
          </div>
          <div class="card-content">
            <div class="table-container">
              <table class="table" id="usersTable">
                <thead>
                  <tr>
                    <th>Miembro</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Tickets</th>
                    <th>Registro</th>
                    <th class="sr-only">Acciones</th>
                  </tr>
                </thead>
                <tbody id="usersTableBody">
                  ${renderUsersTableBody(teamUsers)}
                </tbody>
              </table>
            </div>
            <div id="emptyUsers" class="empty-state hidden">
              <p class="empty-state-text">No se encontraron miembros del equipo</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    
    <!-- Modal Crear Usuario -->
    <div id="createUserModal" class="modal-overlay hidden">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Agregar Miembro del Equipo</h2>
        </div>
        <form onsubmit="handleCreateUser(event)">
          <div class="modal-body">
            <div class="form-group">
              <label class="form-label" for="userName">Nombre Completo</label>
              <input type="text" id="userName" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="userEmail">Email</label>
              <input type="email" id="userEmail" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="userRole">Rol</label>
              <select id="userRole" class="form-input form-select">
                <option value="technician">Tecnico</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal('createUserModal')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Agregar Miembro</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Editar Usuario -->
    <div id="editUserModal" class="modal-overlay hidden">
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Editar Miembro del Equipo</h2>
        </div>
        <form onsubmit="handleEditUser(event)">
          <div class="modal-body">
            <input type="hidden" id="editUserId">
            <div class="form-group">
              <label class="form-label" for="editUserName">Nombre Completo</label>
              <input type="text" id="editUserName" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="editUserEmail">Email</label>
              <input type="email" id="editUserEmail" class="form-input" required>
            </div>
            <div class="form-group">
              <label class="form-label" for="editUserRole">Rol</label>
              <select id="editUserRole" class="form-input form-select">
                <option value="technician">Tecnico</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="editUserStatus">Estado</label>
              <select id="editUserStatus" class="form-input form-select">
                <option value="active">Activo</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="closeModal('editUserModal')">Cancelar</button>
            <button type="submit" class="btn btn-primary">Guardar Cambios</button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- Modal Confirmar Eliminacion -->
    <div id="deleteUserModal" class="modal-overlay hidden">
      <div class="modal" style="max-width: 400px;">
        <div class="modal-header">
          <h2 class="modal-title">Eliminar Miembro del Equipo</h2>
        </div>
        <div class="modal-body">
          <p>Estas seguro de que deseas eliminar este miembro del equipo? Esta accion no se puede deshacer.</p>
          <input type="hidden" id="deleteUserId">
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" onclick="closeModal('deleteUserModal')">Cancelar</button>
          <button type="button" class="btn btn-destructive" onclick="handleDeleteUser()">Eliminar</button>
        </div>
      </div>
    </div>
  `;
}

function renderUsersTableBody(users) {
  return users.map(user => `
    <tr>
      <td>
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <div style="width: 40px; height: 40px; border-radius: 50%; background: var(--primary-light); color: var(--primary); display: flex; align-items: center; justify-content: center; font-weight: 500;">
            ${user.name.charAt(0)}
          </div>
          <div>
            <p style="font-weight: 500;">${user.name}</p>
            <p style="font-size: 0.875rem; color: var(--muted-foreground);">${user.email}</p>
          </div>
        </div>
      </td>
      <td>
        <div style="display: flex; align-items: center; gap: 0.375rem; font-size: 0.875rem;">
          ${user.role === 'admin' ? icons.shield : icons.wrench}
          <span style="text-transform: capitalize;">${user.role === 'admin' ? 'Administrador' : 'Tecnico'}</span>
        </div>
      </td>
      <td>${renderUserStatusBadge(user.status)}</td>
      <td style="font-size: 0.875rem;">${user.ticketsAssigned}</td>
      <td style="font-size: 0.875rem; color: var(--muted-foreground);">${formatDate(user.createdAt)}</td>
      <td>
        <div class="dropdown">
          <button class="btn btn-ghost btn-icon" onclick="toggleDropdown('dropdown-user-${user.id}')">
            ${icons.moreVertical}
          </button>
          <div id="dropdown-user-${user.id}" class="dropdown-menu">
            <button class="dropdown-item" onclick="openEditUserModal('${user.id}')">
              ${icons.edit} Editar
            </button>
            <button class="dropdown-item" onclick="toggleUserStatus('${user.id}')">
              ${user.status === 'active' ? 'Desactivar' : 'Activar'}
            </button>
            <div class="dropdown-separator"></div>
            <button class="dropdown-item dropdown-item-destructive" onclick="openDeleteUserModal('${user.id}')">
              ${icons.trash} Eliminar
            </button>
          </div>
        </div>
      </td>
    </tr>
  `).join('');
}

function filterUsers() {
  const search = document.getElementById('userSearch').value.toLowerCase();
  let users = getTeamUsers();

  users = users.filter(user =>
    user.name.toLowerCase().includes(search) ||
    user.email.toLowerCase().includes(search)
  );

  const tbody = document.getElementById('usersTableBody');
  const emptyDiv = document.getElementById('emptyUsers');

  if (users.length === 0) {
    tbody.innerHTML = '';
    emptyDiv.classList.remove('hidden');
  } else {
    tbody.innerHTML = renderUsersTableBody(users);
    emptyDiv.classList.add('hidden');
  }
}

function handleCreateUser(event) {
  event.preventDefault();

  addTeamUser({
    name: document.getElementById('userName').value,
    email: document.getElementById('userEmail').value,
    role: document.getElementById('userRole').value,
    status: 'active',
  });

  closeModal('createUserModal');
  navigateTo('users');
}

function openEditUserModal(userId) {
  const user = getTeamUsers().find(u => u.id === userId);
  if (!user) return;

  document.getElementById('editUserId').value = user.id;
  document.getElementById('editUserName').value = user.name;
  document.getElementById('editUserEmail').value = user.email;
  document.getElementById('editUserRole').value = user.role;
  document.getElementById('editUserStatus').value = user.status;

  closeAllDropdowns();
  openModal('editUserModal');
}

function handleEditUser(event) {
  event.preventDefault();

  updateTeamUser(document.getElementById('editUserId').value, {
    name: document.getElementById('editUserName').value,
    email: document.getElementById('editUserEmail').value,
    role: document.getElementById('editUserRole').value,
    status: document.getElementById('editUserStatus').value,
  });

  closeModal('editUserModal');
  navigateTo('users');
}

function toggleUserStatus(userId) {
  const user = getTeamUsers().find(u => u.id === userId);
  if (user) {
    updateTeamUser(userId, {
      status: user.status === 'active' ? 'inactive' : 'active',
    });
    closeAllDropdowns();
    navigateTo('users');
  }
}

function openDeleteUserModal(userId) {
  document.getElementById('deleteUserId').value = userId;
  closeAllDropdowns();
  openModal('deleteUserModal');
}

function handleDeleteUser() {
  const id = document.getElementById('deleteUserId').value;
  deleteTeamUser(id);
  closeModal('deleteUserModal');
  navigateTo('users');
}

// ========================================
// Pagina de Albaranes
// ========================================

function renderAlbaranesPage() {
  const notes = getDeliveryNotes();
  const clients = getClients();
  const technicians = getTeamUsers().filter(u => u.role === 'technician');

  const totalHours = notes.reduce((sum, note) => sum + note.hoursWorked, 0);
  const uniqueClients = new Set(notes.map(n => n.clientId)).size;

  return `
    <button class="mobile-menu-btn" onclick="toggleSidebar()">${icons.menu}</button>
    ${renderSidebar()}
    <main class="main-content with-sidebar">
      <div class="page-content">
        <div class="page-header">
          <div>
            <h1 class="page-title">${isTechnician() ? 'Mis Albaranes' : 'Albaranes'}</h1>
            <p class="page-subtitle">
              ${isTechnician()
      ? 'Ver tu trabajo completado y horas'
      : 'Ver todos los albaranes de los tecnicos'
    }
            </p>
          </div>
        </div>
        
        <div class="stats-grid" style="margin-bottom: 1.5rem;">
          <div class="stat-card">
            <div class="stat-icon stat-icon-blue">${icons.fileText}</div>
            <div>
              <p class="stat-label">Total Albaranes</p>
              <p class="stat-value">${notes.length}</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-icon-amber">${icons.clock}</div>
            <div>
              <p class="stat-label">Total Horas</p>
              <p class="stat-value">${totalHours.toFixed(1)}h</p>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon stat-icon-green">${icons.building}</div>
            <div>
              <p class="stat-label">Clientes Atendidos</p>
              <p class="stat-value">${uniqueClients}</p>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-header">
            <div class="filters-bar">
              <div class="input-with-icon" style="flex: 1; max-width: 300px;">
                ${icons.search}
                <input type="text" class="form-input" placeholder="Buscar albaranes..." id="albaranSearch" oninput="filterAlbaranes()">
              </div>
              ${isAdmin() ? `
                <select class="form-input form-select" id="technicianFilter" onchange="filterAlbaranes()">
                  <option value="all">Todos los Tecnicos</option>
                  ${technicians.map(t => `<option value="${t.id}">${t.name}</option>`).join('')}
                </select>
              ` : ''}
              <select class="form-input form-select" id="albaranClientFilter" onchange="filterAlbaranes()">
                <option value="all">Todos los Clientes</option>
                ${clients.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="card-content" id="albaranesContent">
            ${notes.length === 0
      ? `<div class="empty-state">
                  ${icons.fileText}
                  <p class="empty-state-text">No se encontraron albaranes</p>
                  <p style="font-size: 0.875rem; color: var(--muted-foreground); margin-top: 0.5rem;">
                    Los albaranes se crean cuando se completan tickets
                  </p>
                </div>`
      : renderDeliveryNotes(notes)
    }
          </div>
        </div>
      </div>
    </main>
  `;
}

function renderDeliveryNotes(notes) {
  return notes.map(note => `
    <div class="delivery-note-card">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1;">
          <div class="delivery-note-header">
            <div class="delivery-note-icon">${icons.fileText}</div>
            <div>
              <h3 class="delivery-note-title">${note.ticketTitle}</h3>
              <p class="delivery-note-ticket">Ticket #${note.ticketId}</p>
            </div>
          </div>
          <p class="delivery-note-description line-clamp-2">${note.description}</p>
          <div class="delivery-note-meta">
            <div class="delivery-note-meta-item">
              ${icons.building}
              <span>${note.clientName}</span>
            </div>
            ${isAdmin() ? `
              <div class="delivery-note-meta-item">
                ${icons.user}
                <span>${note.technicianName}</span>
              </div>
            ` : ''}
            <div class="delivery-note-meta-item">
              ${icons.calendar}
              <span>${formatDateTime(note.createdAt)}</span>
            </div>
          </div>
        </div>
        <div class="delivery-note-hours">
          ${icons.clock}
          ${note.hoursWorked}h
        </div>
      </div>
    </div>
  `).join('');
}

function filterAlbaranes() {
  const search = document.getElementById('albaranSearch').value.toLowerCase();
  const technician = document.getElementById('technicianFilter')?.value || 'all';
  const client = document.getElementById('albaranClientFilter').value;

  let notes = getDeliveryNotes();

  notes = notes.filter(note => {
    const matchesSearch = note.ticketTitle.toLowerCase().includes(search) ||
      note.clientName.toLowerCase().includes(search) ||
      note.description.toLowerCase().includes(search);
    const matchesTechnician = technician === 'all' || note.technicianId === technician;
    const matchesClient = client === 'all' || note.clientId === client;
    return matchesSearch && matchesTechnician && matchesClient;
  });

  const content = document.getElementById('albaranesContent');

  if (notes.length === 0) {
    content.innerHTML = `
      <div class="empty-state">
        ${icons.fileText}
        <p class="empty-state-text">No se encontraron albaranes</p>
      </div>
    `;
  } else {
    content.innerHTML = renderDeliveryNotes(notes);
  }
}

// ========================================
// Utilidades para Modales y Dropdowns
// ========================================

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function toggleDropdown(dropdownId) {
  closeAllDropdowns();
  const dropdown = document.getElementById(dropdownId);
  if (dropdown) {
    dropdown.classList.toggle('open');
  }
}

function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('open');
  });
}

// Cerrar dropdowns al hacer clic fuera
document.addEventListener('click', function (event) {
  if (!event.target.closest('.dropdown')) {
    closeAllDropdowns();
  }
});

// ========================================
// Renderizador Principal de la App
// ========================================

async function renderApp() {
  const app = document.getElementById('app');

  // Si no hay usuario autenticado, mostrar login
  if (!appState.currentUser && appState.currentPage !== 'login') {
    appState.currentPage = 'login';
  }

  // Si hay usuario autenticado y esta en login, ir a dashboard
  if (appState.currentUser && appState.currentPage === 'login') {
    appState.currentPage = 'dashboard';
  }

  let content = '';

  switch (appState.currentPage) {
    case 'login':
      content = renderLoginPage();
      break;
    case 'dashboard':
      content = await renderDashboardPage();
      break;
    case 'tickets':
      content = await renderTicketsPage();
      break;
    case 'ticket-detail':
      content = await renderTicketDetailPage();
      break;
    case 'clients':
      content = renderClientsPage();
      break;
    case 'users':
      content = renderUsersPage();
      break;
    case 'albaranes':
      content = renderAlbaranesPage();
      break;
    default:
      content = await renderDashboardPage();
  }

  app.innerHTML = content;
}

// ========================================
// Inicializacion
// ========================================

document.addEventListener('DOMContentLoaded', async function () {
  // Verificar si hay un usuario guardado
  if (checkAuth()) {
    appState.currentPage = 'dashboard';
  }

  // Renderizar la aplicacion
  await renderApp();
});
