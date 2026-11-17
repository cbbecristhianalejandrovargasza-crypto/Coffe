function limpiarTexto(valor) {
  return typeof valor === "string" ? valor.trim() : "";
}

function validarContacto(req, res, next) {
  const nombre = limpiarTexto(req.body?.nombre);
  const correo = limpiarTexto(req.body?.correo);
  const mensaje = limpiarTexto(req.body?.mensaje);

  if (!nombre || nombre.length > 100) {
    return res.status(400).json({ error: "Escribe un nombre de hasta 100 caracteres." });
  }

  if (correo.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
    return res.status(400).json({ error: "Escribe un correo válido." });
  }

  if (!mensaje || mensaje.length > 1000) {
    return res.status(400).json({ error: "Escribe un mensaje de hasta 1000 caracteres." });
  }

  res.locals.contacto = { nombre, correo, mensaje };
  next();
}

module.exports = { validarContacto };