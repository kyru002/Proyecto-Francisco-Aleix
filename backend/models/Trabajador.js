const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const TrabajadorSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  telefono: {
    type: String,
    required: false,
  },
  puesto: {
    type: String,
    required: true,
  },
  empresa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  contraseñaTemporal: {
    type: Boolean,
    default: true, // Cuando se crea, es temporal y debe cambiarla al primer login
  },
  estado: {
    type: String,
    enum: ["activo", "inactivo", "suspendido"],
    default: "activo",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash de contraseña antes de guardar
TrabajadorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
TrabajadorSchema.methods.comparePassword = async function (passwordIngresada) {
  return await bcrypt.compare(passwordIngresada, this.password);
};

// Método para generar contraseña temporal
function generarContraseñaTemporal() {
  const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%";
  let contraseña = "";
  for (let i = 0; i < 12; i++) {
    contraseña += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return contraseña;
}

TrabajadorSchema.statics.generarContraseñaTemporal = generarContraseñaTemporal;

module.exports = mongoose.model("Trabajador", TrabajadorSchema);
