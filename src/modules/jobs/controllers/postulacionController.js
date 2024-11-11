const postulacionService = require('../services/postulacionService');

exports.createPostulacion = async (req, res) => {
    try {
        const postulacion = await postulacionService.createPostulacion(req.body);
        res.status(201).json({ postulacion });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
