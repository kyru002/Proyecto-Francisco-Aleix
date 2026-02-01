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

// Eliminar un cliente
router.delete("/:id", async (req, res) => {
    try {
        await Cliente.findByIdAndDelete(req.params.id);
        res.json({ msg: "Cliente eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el cliente" });
    }
});

module.exports = router;
