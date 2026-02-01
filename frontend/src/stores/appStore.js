import { defineStore } from 'pinia';
import { ticketsService, tecnicosService, clientesService } from '../services/api';

export const useAppStore = defineStore('app', {
    state: () => ({
        tickets: [],
        tecnicos: [],
        clientes: [],
        loading: false,
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
    }),
    actions: {
        async fetchAll() {
            this.loading = true;
            try {
                // Ejecutar en paralelo pero capturar errores individualmente para no bloquear todo
                const results = await Promise.allSettled([
                    ticketsService.getAll(),
                    tecnicosService.getAll(),
                    clientesService.getAll(),
                ]);

                if (results[0].status === 'fulfilled') this.tickets = results[0].value;
                else console.error('Error fetching tickets:', results[0].reason);

                if (results[1].status === 'fulfilled') this.tecnicos = results[1].value;
                else console.error('Error fetching tecnicos:', results[1].reason);

                if (results[2].status === 'fulfilled') this.clientes = results[2].value;
                else console.error('Error fetching clientes:', results[2].reason);

            } catch (error) {
                console.error('Unexpected error in fetchAll:', error);
            } finally {
                this.loading = false;
            }
        },
        async createTicket(data) {
            const newTicket = await ticketsService.create(data);
            this.tickets.unshift(newTicket);
            return newTicket;
        },
        async createTecnico(data) {
            const newTecnico = await tecnicosService.create(data);
            this.tecnicos.unshift(newTecnico);
            return newTecnico;
        },
        async createCliente(data) {
            const newCliente = await clientesService.create(data);
            this.clientes.unshift(newCliente);
            return newCliente;
        },
        logout() {
            this.currentUser = null;
            localStorage.removeItem('currentUser');
        },
        login(user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
        }
    },
});
