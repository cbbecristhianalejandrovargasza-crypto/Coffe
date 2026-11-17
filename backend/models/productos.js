const db = require("../db");

async function listarProductos() {
  const [filas] = await db.execute(`
    SELECT id, nombre, descripcion, precio, especialidad
    FROM productos
    ORDER BY id
  `);
  return filas;
}

module.exports = { listarProductos };