// ========================================
// SERVICORE - Datos y Estado de la Aplicacion
// ========================================

// Clientes
const mockClients = [
  { id: "c1", name: "Acme Corporation", email: "contact@acme.com", company: "Acme Corp", phone: "+1 555-0101", ticketCount: 12, createdAt: "2024-01-15" },
  { id: "c2", name: "TechStart Inc", email: "support@techstart.io", company: "TechStart", phone: "+1 555-0102", ticketCount: 8, createdAt: "2024-02-20" },
  { id: "c3", name: "Global Solutions", email: "help@globalsol.com", company: "Global Solutions Ltd", phone: "+1 555-0103", ticketCount: 5, createdAt: "2024-03-10" },
  { id: "c4", name: "DataFlow Systems", email: "admin@dataflow.net", company: "DataFlow", phone: "+1 555-0104", ticketCount: 15, createdAt: "2024-01-05" },
  { id: "c5", name: "CloudNine Services", email: "info@cloudnine.co", company: "CloudNine", phone: "+1 555-0105", ticketCount: 3, createdAt: "2024-04-01" },
];

// Tickets
let mockTickets = [
  { id: "t1", title: "Error de conexion al servidor", description: "Los usuarios experimentan errores de timeout frecuentes al conectar al servidor principal de base de datos.", status: "open", priority: "high", clientId: "c1", clientName: "Acme Corporation", assignedTo: "2", assignedToName: "Juan Tecnico", createdAt: "2024-06-01T10:30:00", updatedAt: "2024-06-01T14:20:00" },
  { id: "t2", title: "Integracion de email no sincroniza", description: "La integracion con Outlook dejo de sincronizar despues de la ultima actualizacion.", status: "in_progress", priority: "medium", clientId: "c2", clientName: "TechStart Inc", assignedTo: "2", assignedToName: "Juan Tecnico", createdAt: "2024-05-28T09:15:00", updatedAt: "2024-06-01T11:00:00" },
  { id: "t3", title: "Dashboard carga lento", description: "El dashboard principal tarda mas de 15 segundos en cargar para algunos usuarios.", status: "open", priority: "low", clientId: "c3", clientName: "Global Solutions", createdAt: "2024-06-02T08:00:00", updatedAt: "2024-06-02T08:00:00" },
  { id: "t4", title: "Fallo de autenticacion tras resetear contrasena", description: "Los usuarios no pueden iniciar sesion despues de restablecer sus contrasenas.", status: "closed", priority: "high", clientId: "c4", clientName: "DataFlow Systems", assignedTo: "2", assignedToName: "Juan Tecnico", createdAt: "2024-05-20T16:45:00", updatedAt: "2024-05-25T10:30:00" },
  { id: "t5", title: "Exportacion de reportes genera PDF vacio", description: "Al exportar reportes mensuales a PDF, el archivo esta vacio.", status: "in_progress", priority: "medium", clientId: "c1", clientName: "Acme Corporation", assignedTo: "2", assignedToName: "Juan Tecnico", createdAt: "2024-05-30T12:00:00", updatedAt: "2024-06-01T09:30:00" },
  { id: "t6", title: "App movil se cierra al iniciar", description: "La app de iOS se cierra inmediatamente despues de la pantalla de inicio en iPhone 12 y posteriores.", status: "open", priority: "high", clientId: "c5", clientName: "CloudNine Services", createdAt: "2024-06-02T07:30:00", updatedAt: "2024-06-02T07:30:00" },
];

// Mensajes de chat
let mockMessages = [
  { id: "m1", ticketId: "t1", senderId: "c1", senderName: "Acme Corporation", senderRole: "client", content: "Estamos viendo este problema en todas nuestras oficinas. Se esta volviendo critico.", timestamp: "2024-06-01T10:30:00" },
  { id: "m2", ticketId: "t1", senderId: "2", senderName: "Juan Tecnico", senderRole: "technician", content: "Entiendo la urgencia. Estoy revisando los logs del servidor. Puede confirmar a que cluster de base de datos se conectan?", timestamp: "2024-06-01T10:45:00" },
  { id: "m3", ticketId: "t1", senderId: "c1", senderName: "Acme Corporation", senderRole: "client", content: "Estamos en el cluster DB-WEST-02. El timeout comenzo alrededor de las 9 AM de hoy.", timestamp: "2024-06-01T11:00:00" },
  { id: "m4", ticketId: "t1", senderId: "2", senderName: "Juan Tecnico", senderRole: "technician", content: "Lo encontre. Hubo un cambio de configuracion de red que afecto ese cluster. Estoy revirtiendo los cambios ahora.", timestamp: "2024-06-01T14:20:00" },
];

// Usuarios del equipo
let mockTeamUsers = [
  { id: "1", name: "Admin Usuario", email: "admin@support.com", role: "admin", status: "active", ticketsAssigned: 0, createdAt: "2024-01-01" },
  { id: "2", name: "Juan Tecnico", email: "tech@support.com", role: "technician", status: "active", ticketsAssigned: 4, createdAt: "2024-01-15" },
  { id: "3", name: "Sara Soporte", email: "sara@support.com", role: "technician", status: "active", ticketsAssigned: 6, createdAt: "2024-02-01" },
  { id: "4", name: "Miguel Ayuda", email: "miguel@support.com", role: "technician", status: "inactive", ticketsAssigned: 0, createdAt: "2024-03-01" },
];

// Albaranes (Notas de entrega)
let mockDeliveryNotes = [
  { id: "dn1", ticketId: "t4", ticketTitle: "Fallo de autenticacion tras resetear contrasena", clientId: "c4", clientName: "DataFlow Systems", technicianId: "2", technicianName: "Juan Tecnico", hoursWorked: 3.5, description: "Se corrigio el flujo de autenticacion actualizando la validacion del token de restablecimiento de contrasena. Probado en todos los navegadores principales.", createdAt: "2024-05-25T10:30:00" },
];

// Credenciales de usuarios para login
const userCredentials = [
  { email: "admin@support.com", password: "admin123", id: "1", name: "Admin Usuario", role: "admin" },
  { email: "tech@support.com", password: "tech123", id: "2", name: "Juan Tecnico", role: "technician" },
  { email: "client@company.com", password: "client123", id: "c1-user", name: "Usuario Acme", role: "client", companyId: "c1", companyName: "Acme Corporation" },
  { email: "techstart@client.com", password: "client123", id: "c2-user", name: "Usuario TechStart", role: "client", companyId: "c2", companyName: "TechStart Inc" },
  { email: "global@client.com", password: "client123", id: "c3-user", name: "Usuario Global", role: "client", companyId: "c3", companyName: "Global Solutions" },
];

// Estado de la aplicacion
let appState = {
  currentUser: null,
  currentPage: 'login',
  sidebarOpen: false,
};

// Función navigateTo
function navigateTo(page) {
  appState.currentPage = page;
}

// ========================================
// Funciones de Autenticacion
// ========================================

function login(email, password) {
  const user = userCredentials.find(
    (u) => u.email === email && u.password === password
  );
  
  if (user) {
    appState.currentUser = { ...user };
    delete appState.currentUser.password;
    localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
    navigateTo('dashboard'); // Redirect to dashboard after login
    return true;
  }
  return false;
}

function logout() {
  appState.currentUser = null;
  localStorage.removeItem('currentUser');
  navigateTo('login');
}

function checkAuth() {
  const savedUser = localStorage.getItem('currentUser');
  if (savedUser) {
    appState.currentUser = JSON.parse(savedUser);
    return true;
  }
  return false;
}

function isAdmin() {
  return appState.currentUser?.role === 'admin';
}

function isTechnician() {
  return appState.currentUser?.role === 'technician';
}

function isClient() {
  return appState.currentUser?.role === 'client';
}

// ========================================
// Funciones CRUD para Tickets
// ========================================

function getTickets() {
  if (isClient() && appState.currentUser?.companyId) {
    return mockTickets.filter(t => t.clientId === appState.currentUser.companyId);
  }
  return mockTickets;
}

function getTicketById(id) {
  return mockTickets.find(t => t.id === id);
}

function addTicket(ticketData) {
  const newTicket = {
    id: 't' + Date.now(),
    ...ticketData,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  mockTickets.unshift(newTicket);
  return newTicket;
}

function updateTicket(id, updates) {
  const index = mockTickets.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTickets[index] = {
      ...mockTickets[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return mockTickets[index];
  }
  return null;
}

function deleteTicket(id) {
  const index = mockTickets.findIndex(t => t.id === id);
  if (index !== -1) {
    mockTickets.splice(index, 1);
    return true;
  }
  return false;
}

// ========================================
// Funciones CRUD para Usuarios del Equipo
// ========================================

function getTeamUsers() {
  return mockTeamUsers;
}

function addTeamUser(userData) {
  const newUser = {
    id: Date.now().toString(),
    ...userData,
    ticketsAssigned: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  mockTeamUsers.push(newUser);
  return newUser;
}

function updateTeamUser(id, updates) {
  const index = mockTeamUsers.findIndex(u => u.id === id);
  if (index !== -1) {
    mockTeamUsers[index] = { ...mockTeamUsers[index], ...updates };
    return mockTeamUsers[index];
  }
  return null;
}

function deleteTeamUser(id) {
  const index = mockTeamUsers.findIndex(u => u.id === id);
  if (index !== -1) {
    mockTeamUsers.splice(index, 1);
    return true;
  }
  return false;
}

// ========================================
// Funciones CRUD para Clientes
// ========================================

function getClients() {
  return mockClients;
}

function addClient(clientData) {
  const newClient = {
    id: 'c' + Date.now(),
    ...clientData,
    ticketCount: 0,
    createdAt: new Date().toISOString().split('T')[0],
  };
  mockClients.push(newClient);
  return newClient;
}

// ========================================
// Funciones para Mensajes
// ========================================

function getMessagesByTicketId(ticketId) {
  return mockMessages.filter(m => m.ticketId === ticketId);
}

function addMessage(messageData) {
  const newMessage = {
    id: 'm' + Date.now(),
    ...messageData,
    timestamp: new Date().toISOString(),
  };
  mockMessages.push(newMessage);
  return newMessage;
}

// ========================================
// Funciones para Albaranes
// ========================================

function getDeliveryNotes() {
  if (isTechnician() && appState.currentUser) {
    return mockDeliveryNotes.filter(n => n.technicianId === appState.currentUser.id);
  }
  return mockDeliveryNotes;
}

function addDeliveryNote(noteData) {
  const newNote = {
    id: 'dn' + Date.now(),
    ...noteData,
    createdAt: new Date().toISOString(),
  };
  mockDeliveryNotes.push(newNote);
  return newNote;
}

// ========================================
// Funciones de Estadisticas
// ========================================

function getStats() {
  const tickets = getTickets();
  return {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    highPriority: tickets.filter(t => t.priority === 'high' && t.status !== 'closed').length,
    clients: mockClients.length,
  };
}

// ========================================
// Funciones de Utilidad
// ========================================

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function getStatusLabel(status) {
  const labels = {
    open: 'Abierto',
    in_progress: 'En Progreso',
    closed: 'Cerrado',
    active: 'Activo',
    inactive: 'Inactivo',
  };
  return labels[status] || status;
}

function getPriorityLabel(priority) {
  const labels = {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja',
  };
  return labels[priority] || priority;
}

function getRoleLabel(role) {
  const labels = {
    admin: 'Administrador',
    technician: 'Tecnico',
    client: 'Cliente',
  };
  return labels[role] || role;
}
