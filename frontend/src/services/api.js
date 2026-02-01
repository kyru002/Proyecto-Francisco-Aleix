import axios from 'axios';

const API_URL = 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const ticketsService = {
    getAll: () => api.get('/tickets').then(res => res.data),
    getById: (id) => api.get(`/tickets/${id}`).then(res => res.data),
    create: (data) => api.post('/tickets', data).then(res => res.data),
    update: (id, data) => api.put(`/tickets/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/tickets/${id}`).then(res => res.data),
};

export const tecnicosService = {
    getAll: () => api.get('/tecnicos').then(res => res.data),
    create: (data) => api.post('/tecnicos', data).then(res => res.data),
    update: (id, data) => api.put(`/tecnicos/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/tecnicos/${id}`).then(res => res.data),
};

export const clientesService = {
    getAll: () => api.get('/clientes').then(res => res.data),
    create: (data) => api.post('/clientes', data).then(res => res.data),
    update: (id, data) => api.put(`/clientes/${id}`, data).then(res => res.data),
    delete: (id) => api.delete(`/clientes/${id}`).then(res => res.data),
};

export default api;
