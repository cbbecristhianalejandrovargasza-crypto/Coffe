const { obtenerCafeteria } = require("../models/cafeteria");

async function consultarCafeteria(req, res) {
  try {
    const cafeteria = await obtenerCafeteria();

    if (!cafeteria) {
      return res.status(404).json({ error: "No se encontró la cafetería" });
    }

    return res.json(cafeteria);
  } catch (error) {
    console.error("Error al consultar la cafetería", error.message);
    return res.status(500).json({ error: "No se pudo consultar la cafetería" });
  }
}

module.exports = { consultarCafeteria };