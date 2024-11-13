const postulacionService = require('../services/postulacionService');

exports.createPostulacion = async (req, res) => {
    try {
        const postulacion = await postulacionService.createPostulacion(req.userId, req.body);
        res.status(201).json({ postulacion });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.listPostulantesByTrabajo = async (req, res) => {
    try {
        const postulantes = await postulacionService.getPostulantesByTrabajo(req.params.trabajoId);
        res.status(200).json({ postulantes });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


exports.getHistorialPostulaciones = async (req, res) => {
    try {
        const colaboradorId = req.userId;
        const { estado, page, limit } = req.query;

        if (!estado) {
            return res.status(400).json({ error: 'El estado es requerido' });
        }

        const historial = await postulacionService.getHistorialPostulaciones(
            colaboradorId,
            estado,
            parseInt(page) || 1,
            parseInt(limit) || 10
        );

        res.json(historial);
    } catch (error) {
        console.error('Error en getHistorialPostulaciones:', error);
        res.status(500).json({ error: 'Error al obtener el historial de postulaciones' });
    }
};
