const express = require("express");
const router = express.Router();
const Trabajador = require("../models/Trabajador");
const Cliente = require("../models/Cliente");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const JWT_SECRET = process.env.JWT_SECRET || "tu-clave-secreta-muy-segura";

// Obtener todos los trabajadores de una empresa
router.get("/empresa/:empresaId", async (req, res) => {
    try {
        const trabajadores = await Trabajador.find({ empresa: req.params.empresaId })
            .populate("empresa")
            .sort({ createdAt: -1 });
        res.json(trabajadores);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener trabajadores", error: error.message });
    }
});

// Obtener un trabajador por ID
router.get("/:id", async (req, res) => {
    try {
        const trabajador = await Trabajador.findById(req.params.id).populate("empresa");
        if (!trabajador) {
            return res.status(404).json({ message: "Trabajador no encontrado" });
        }
        res.json(trabajador);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener trabajador", error: error.message });
    }
});

// Crear nuevo trabajador
router.post("/", async (req, res) => {
    try {
        const { nombre, email, telefono, puesto, empresa } = req.body;

        // Validar campos requeridos
        if (!nombre || !email || !puesto || !empresa) {
            return res.status(400).json({ message: "Los campos nombre, email, puesto y empresa son requeridos" });
        }

        // Validar que la empresa exista
        const empresaExistente = await Cliente.findById(empresa);
        if (!empresaExistente) {
            return res.status(404).json({ message: "Empresa no encontrada" });
        }

        // Verificar que el email no exista ya
        const trabajadorExistente = await Trabajador.findOne({ email: email.toLowerCase() });
        if (trabajadorExistente) {
            return res.status(400).json({ message: "El email ya está registrado" });
        }

        // Generar contraseña temporal
        const contraseñaTemporal = Trabajador.generarContraseñaTemporal();

        // Crear nuevo trabajador
        const nuevoTrabajador = new Trabajador({
            nombre,
            email: email.toLowerCase(),
            telefono,
            puesto,
            empresa,
            password: contraseñaTemporal,
            contraseñaTemporal: true,
            estado: "activo"
        });

        const trabajadorGuardado = await nuevoTrabajador.save();
        const trabajadorPopulado = await trabajadorGuardado.populate("empresa");

        // Devolver el trabajador CON la contraseña temporal en texto plano (solo en creación)
        const response = trabajadorPopulado.toObject();
        response.contraseñaTemporalTexto = contraseñaTemporal; // Mostrar solo al crear para notificar al admin

        res.status(201).json(response);
    } catch (error) {
        console.error("Error al crear trabajador:", error);
        res.status(500).json({ message: "Error al crear trabajador", error: error.message });
    }
});

// Actualizar trabajador
router.put("/:id", async (req, res) => {
    try {
        const { nombre, email, telefono, puesto, estado } = req.body;

        const trabajador = await Trabajador.findByIdAndUpdate(
            req.params.id,
            {
                nombre,
                email: email ? email.toLowerCase() : undefined,
                telefono,
                puesto,
                estado
            },
            { new: true, runValidators: true }
        ).populate("empresa");

        if (!trabajador) {
            return res.status(404).json({ message: "Trabajador no encontrado" });
        }

        res.json(trabajador);
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar trabajador", error: error.message });
    }
});

// Cambiar contraseña (por el trabajador mismo o admin)
router.patch("/:id/cambiar-password", async (req, res) => {
    try {
        const { passwordActual, passwordNueva } = req.body;

        if (!passwordNueva) {
            return res.status(400).json({ message: "La nueva contraseña es requerida" });
        }

        const trabajador = await Trabajador.findById(req.params.id);
        if (!trabajador) {
            return res.status(404).json({ message: "Trabajador no encontrado" });
        }

        // Si es contraseña temporal, no necesita validar la actual
        if (trabajador.contraseñaTemporal) {
            trabajador.password = passwordNueva;
            trabajador.contraseñaTemporal = false;
        } else {
            // Validar contraseña actual
            if (!passwordActual) {
                return res.status(400).json({ message: "La contraseña actual es requerida" });
            }

            const esValida = await trabajador.comparePassword(passwordActual);
            if (!esValida) {
                return res.status(401).json({ message: "Contraseña actual incorrecta" });
            }

            trabajador.password = passwordNueva;
        }

        await trabajador.save();

        res.json({
            message: "Contraseña actualizada correctamente",
            trabajador: trabajador.toObject()
        });
    } catch (error) {
        res.status(400).json({ message: "Error al cambiar contraseña", error: error.message });
    }
});

// Login para trabajadores
router.post("/auth/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email y contraseña son requeridos" });
        }

        const trabajador = await Trabajador.findOne({ email: email.toLowerCase() }).populate("empresa");

        if (!trabajador) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        if (trabajador.estado !== "activo") {
            return res.status(401).json({ message: "Tu cuenta ha sido desactivada" });
        }

        const esValida = await trabajador.comparePassword(password);
        if (!esValida) {
            return res.status(401).json({ message: "Credenciales inválidas" });
        }

        // Generar token JWT
        const token = jwt.sign(
            {
                id: trabajador._id,
                email: trabajador.email,
                nombre: trabajador.nombre,
                empresa: trabajador.empresa._id,
                role: "trabajador",
                contraseñaTemporal: trabajador.contraseñaTemporal
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        res.json({
            message: "Login exitoso",
            token,
            trabajador: {
                _id: trabajador._id,
                nombre: trabajador.nombre,
                email: trabajador.email,
                puesto: trabajador.puesto,
                empresa: trabajador.empresa,
                contraseñaTemporal: trabajador.contraseñaTemporal
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Error en login", error: error.message });
    }
});

// Eliminar trabajador
router.delete("/:id", async (req, res) => {
    try {
        const trabajador = await Trabajador.findByIdAndDelete(req.params.id);

        if (!trabajador) {
            return res.status(404).json({ message: "Trabajador no encontrado" });
        }

        res.json({ message: "Trabajador eliminado correctamente", trabajador });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar trabajador", error: error.message });
    }
});

module.exports = router;
