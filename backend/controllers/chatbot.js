const { obtenerCafeteria } = require("../models/cafeteria");
const { listarServicios } = require("../models/servicios");
const { listarProductos } = require("../models/productos");

const ollamaUrl = (process.env.OLLAMA_URL || "http://127.0.0.1:11434")
  .replace(/\/+$/, "");
const modelo = process.env.OLLAMA_MODEL || "gemma3:4b";

async function responderChatbot(req, res, next) {
  const pregunta = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";

  if (!pregunta || pregunta.length > 500) {
    return res.status(400).json({ error: "Escribe una pregunta de hasta 500 caracteres." });
  }

  let datos;
  try {
    const [cafeteria, servicios, productos] = await Promise.all([
      obtenerCafeteria(),
      listarServicios(),
      listarProductos(),
    ]);
    datos = { cafeteria, servicios, productos };
  } catch (error) {
    return next(error);
  }

  try {
    const respuesta = await fetch(`${ollamaUrl}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelo,
        prompt: pregunta,
        stream: false,
        system: [
          "Eres el asistente de CoffeeHouse. Responde en español y de forma breve.",
          "Responde sobre la cafetería, sus servicios, productos y precios en bolivianos.",
          "Usa los datos proporcionados. Si falta información, dilo sin inventarla.",
          "No confirmes pedidos ni reservas. Para solicitarlos, indica el formulario de contacto.",
          `Datos de CoffeeHouse: ${JSON.stringify(datos)}`,
        ].join("\n"),
      }),
      signal: AbortSignal.timeout(120_000),
    });

    if (!respuesta.ok) {
      console.error("Ollama respondió con estado", respuesta.status);
      return res.status(502).json({ error: "Ollama no pudo generar la respuesta." });
    }

    const resultado = await respuesta.json();

    if (typeof resultado.response !== "string" || !resultado.response.trim()) {
      return res.status(502).json({ error: "Ollama devolvió una respuesta vacía." });
    }

    return res.json({ response: resultado.response.trim() });
  } catch (error) {
    if (error.name === "TimeoutError") {
      return res.status(504).json({ error: "El chatbot tardó demasiado. Intenta otra vez." });
    }
    console.error("Error al consultar Ollama", error.message);
    return res.status(502).json({ error: "No se pudo conectar con Ollama." });
  }
}

module.exports = { responderChatbot };