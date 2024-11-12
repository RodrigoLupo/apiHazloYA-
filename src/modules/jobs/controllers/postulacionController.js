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