const express = require("express");
const router = express.Router();
const Tecnico = require("../models/Tecnico");

// Obtener todos los técnicos
router.get("/", async (req, res) => {
    try {
        const technicians = await Tecnico.find().sort({ createdAt: -1 });
        res.json(technicians);
    } catch (error) {
        res.status(500).json({ msg: "Error al obtener los técnicos" });
    }
});

// Crear un nuevo técnico
router.post("/", async (req, res) => {
    try {
        const newTecnico = new Tecnico(req.body);
        const savedTecnico = await newTecnico.save();
        res.json(savedTecnico);
    } catch (error) {
        res.status(500).json({ msg: "Error al crear el técnico", error: error.message });
    }
});

// Actualizar un técnico
router.put("/:id", async (req, res) => {
    try {
        const updatedTecnico = await Tecnico.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedTecnico);
    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar el técnico" });
    }
});

// Eliminar un técnico
router.delete("/:id", async (req, res) => {
    try {
        await Tecnico.findByIdAndDelete(req.params.id);
        res.json({ msg: "Técnico eliminado" });
    } catch (error) {
        res.status(500).json({ msg: "Error al eliminar el técnico" });
    }
});

module.exports = router;
