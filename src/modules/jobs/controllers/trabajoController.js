const trabajoService = require('../services/trabajoService');

exports.createTrabajo = async (req, res) => {
    try {
        const trabajo = await trabajoService.createTrabajo(req.userId,req.body);
        res.status(201).json({ trabajo });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getTrabajoById = async (req, res) => {
    try {
        const trabajo = await trabajoService.getJobById(req.params.id);
        res.status(200).json(trabajo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.listTrabajosCercanos = async (req, res) => {
    try {
        const page = parseInt(req.params.page, 10);
        const trabajos = await trabajoService.listTrabajosCercanos(req.userId, page);
        const totalTrabajos = await trabajoService.countTrabajosByDistrito(req.userId);
        res.status(200).json({ trabajos, totalTrabajos });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};