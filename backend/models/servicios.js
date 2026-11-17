const db = require("../db");

async function listarServicios() {
  const [filas] = await db.execute(`
    SELECT id, nombre, descripcion
    FROM servicios
    ORDER BY id
  `);

  return filas;
}

module.exports = { listarServicios };   