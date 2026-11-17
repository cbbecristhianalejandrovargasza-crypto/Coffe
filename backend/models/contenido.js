const db = require("../db");

async function listarMultimedia() {
  const [filas] = await db.execute(`
    SELECT id, tipo, titulo, descripcion, url, poster, fuente_url
    FROM multimedia
    ORDER BY id
  `);
  return filas;
}

async function guardarContacto({ nombre, correo, mensaje }) {
  const [resultado] = await db.execute(
    "INSERT INTO contactos (nombre, correo, mensaje) VALUES (?, ?, ?)",
    [nombre, correo, mensaje],
  );

  return resultado.insertId;
}

module.exports = { listarMultimedia, guardarContacto };