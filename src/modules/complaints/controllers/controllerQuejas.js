const quejaService = require('../services/serviceQuejas');

exports.createQueja = async (req, res) => {
  try {
    const { tipo } = req.params; // Tipo viene como parámetro en la URL
    const { trabajoId, titulo, descripcion } = req.body;
    const usuarioId = req.userId; // ID del usuario que crea la queja (del token)

    // Validar el tipo
    if (!['Contratista', 'Colaborador'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de queja inválido' });
    }

    const queja = await quejaService.createQueja(usuarioId, trabajoId, titulo, descripcion, tipo);
    res.status(201).json(queja);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getAllQuejas = async (req, res) => {
    try {
        const { page = 1, limit = 10,  estado = 'Pendiente' } = req.query;

        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({ error: 'Los parámetros page y limit deben ser numéricos' });
        }

        const resultado = await quejaService.getAllQuejas(parseInt(page), parseInt(limit), estado);
        res.json(resultado);
    } catch (error) {
        console.error('Error en getAllQuejas:', error);
        res.status(500).json({ error: 'Error al obtener las quejas' });
    }
};
exports.updateQuejaEstado = async (req, res) => {
  try {
    const { id } = req.params; // ID de la queja desde los parámetros de la ruta
    const { estado } = req.query; // Estado desde la query string

    if (!estado) {
      return res.status(400).json({ message: 'El estado es obligatorio en el query' });
    }

    await quejaService.updateQuejaEstado(id, estado);

    res.status(200).json({
      message: 'Estado de la queja actualizado exitosamente',
    });
  } catch (error) {
    console.error('Error al actualizar estado de la queja:', error.message);
    res.status(500).json({ error: error.message });
  }
};