const db = require("../db");

async function obtenerCafeteria() {
  const [filas] = await db.execute(`
    SELECT id, nombre, ciudad, direccion, telefono, horario, historia
    FROM cafeteria
    ORDER BY id
    LIMIT 1
  `);

  return filas[0];
}

module.exports = { obtenerCafeteria };