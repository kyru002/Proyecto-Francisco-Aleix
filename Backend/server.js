const express = require("express");
const app = express();

// Middlewares
app.use(express.json());

// Ruta inicial
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Inicio del servidor
app.listen(3000, () => {
  console.log("Servidor ejecutándose en http://localhost:3000");
});
