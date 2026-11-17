const { listarProductos } = require("../models/productos");

async function consultarProductos(req, res, next) {
  try {
    res.json(await listarProductos());
  } catch (error) {
    next(error);
  }
}

module.exports = { consultarProductos };