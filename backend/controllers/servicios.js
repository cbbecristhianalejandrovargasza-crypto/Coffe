const { listarServicios } = require("../models/servicios");

async function consultarServicios(req, res) {
  try {
    const servicios = await listarServicios();
    return res.json(servicios);
  } catch (error) {
    console.error("Error al consultar servicios", error.message);
    return res.status(500).json({ error: "No se pudieron consultar los servicios" });
  }
}

module.exports = { consultarServicios };