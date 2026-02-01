const express = require("express");
const router = express.Router();
const Ticket = require("../models/Ticket");

// Obtener todos los tickets
router.get("/", async (req, res) => {
    try {
        const tickets = await Ticket.find().sort({ createdAt: -1 });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los tickets" });
    }
});

// Crear un nuevo ticket
router.post("/", async (req, res) => {
    try {
        const newTicket = new Ticket(req.body);
        const savedTicket = await newTicket.save();
        res.json(savedTicket);
    } catch (error) {
        res.status(500).json({ msg: "Error al crear el ticket", error: error.message });
    }
});

// Obtener mensajes de un ticket (DEBE estar antes de /:id)
router.get("/:id/messages", async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket no encontrado" });
        }
        res.json(ticket.messages || []);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener mensajes", error: error.message });
    }
});

// Enviar mensaje en un ticket (DEBE estar antes de /:id)
router.post("/:id/messages", async (req, res) => {
    try {
        const { author, role, content } = req.body;

        if (!author || !role || !content) {
            return res.status(400).json({ msg: "Faltan campos requeridos: author, role, content" });
        }

        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket no encontrado" });
        }

        ticket.messages.push({
            author: author.trim(),
            role: role,
            content: content.trim(),
            createdAt: new Date()
        });

        await ticket.save();
        res.status(201).json(ticket);
    } catch (error) {
        res.status(500).json({ msg: "Error al enviar mensaje", error: error.message });
    }
});

// Obtener un ticket por ID (DEBE estar después de rutas específicas)
router.get("/:id", async (req, res) => {
    try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) {
            return res.status(404).json({ msg: "Ticket no encontrado" });
        }
        res.json(ticket);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener el ticket", error: error.message });
    }
});

// Actualizar un ticket
router.put("/:id", async (req, res) => {
    try {
        const updatedTicket = await Ticket.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTicket);
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el ticket" });
    }
});

// Eliminar un ticket
router.delete("/:id", async (req, res) => {
    try {
        await Ticket.findByIdAndDelete(req.params.id);
        res.json({ msg: "Ticket eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el ticket" });
    }
});

module.exports = router;
