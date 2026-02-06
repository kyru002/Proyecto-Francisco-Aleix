const express = require("express");
const router = express.Router();
const Cliente = require("../models/Cliente");

// Obtener todos los clientes
router.get("/", async (req, res) => {
    try {
        const clientes = await Cliente.find().sort({ createdAt: -1 });
        res.json(clientes);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los clientes" });
    }
});

// Obtener un cliente por ID
router.get("/:id", async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el cliente", error: error.message });
    }
});

// Crear un nuevo cliente
router.post("/", async (req, res) => {
    try {
        const newCliente = new Cliente(req.body);
        const savedCliente = await newCliente.save();
        res.json(savedCliente);
    } catch (error) {
        res.status(500).json({ msg: "Error al crear el cliente", error: error.message });
    }
});

// Actualizar un cliente
router.put("/:id", async (req, res) => {
    try {
        const updatedCliente = await Cliente.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedCliente);
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el cliente" });
    }
});

// Eliminar un cliente por completo (incluyendo sus trabajadores y tickets)
router.delete("/:id", async (req, res) => {
    try {
        const clienteId = req.params.id;

        // 1. Borrar todos los trabajadores asociados a la empresa
        const Trabajador = require("../models/Trabajador");
        await Trabajador.deleteMany({ empresa: clienteId });

        // 2. Borrar todos los tickets asociados a la empresa
        const Ticket = require("../models/Ticket");
        await Ticket.deleteMany({ cliente: clienteId });

        // 3. Borrar la empresa
        await Cliente.findByIdAndDelete(clienteId);

        res.json({ msg: "Empresa y todos sus datos asociados (trabajadores y tickets) han sido eliminados" });
    } catch (error) {
        console.error("Error al eliminar empresa completa:", error);
        res.status(500).json({ msg: "Error al eliminar la empresa y sus datos", error: error.message });
    }
});

// ========== ENDPOINTS PARA CONTACTOS ==========

// Obtener contactos de un cliente
router.get("/:id/contactos", async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }
        res.json(cliente.contactos);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener contactos", error: error.message });
    }
});

// Crear un nuevo contacto en un cliente
router.post("/:id/contactos", async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }

        const { nombre, email, telefono, puesto, esContactoPrincipal } = req.body;

        if (!nombre || !email) {
            return res.status(400).json({ msg: "Nombre y email son requeridos" });
        }

        const nuevoContacto = {
            nombre,
            email,
            telefono: telefono || "",
            puesto: puesto || "Contacto",
            esContactoPrincipal: esContactoPrincipal || false
        };

        cliente.contactos.push(nuevoContacto);
        const clienteActualizado = await cliente.save();

        res.status(201).json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ msg: "Error al crear contacto", error: error.message });
    }
});

// Actualizar un contacto
router.put("/:id/contactos/:contactoId", async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }

        const contacto = cliente.contactos.id(req.params.contactoId);
        if (!contacto) {
            return res.status(404).json({ msg: "Contacto no encontrado" });
        }

        const { nombre, email, telefono, puesto, esContactoPrincipal } = req.body;

        if (nombre) contacto.nombre = nombre;
        if (email) contacto.email = email;
        if (telefono !== undefined) contacto.telefono = telefono;
        if (puesto) contacto.puesto = puesto;
        if (esContactoPrincipal !== undefined) contacto.esContactoPrincipal = esContactoPrincipal;

        const clienteActualizado = await cliente.save();
        res.json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar contacto", error: error.message });
    }
});

// Eliminar un contacto
router.delete("/:id/contactos/:contactoId", async (req, res) => {
    try {
        const cliente = await Cliente.findById(req.params.id);
        if (!cliente) {
            return res.status(404).json({ msg: "Cliente no encontrado" });
        }

        cliente.contactos.id(req.params.contactoId).deleteOne();
        const clienteActualizado = await cliente.save();

        res.json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar contacto", error: error.message });
    }
});

module.exports = router;
