const trabajoService = require('../services/trabajoService');

exports.createTrabajo = async (req, res) => {
    try {
        const trabajo = await trabajoService.createTrabajo(req.body);
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