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
