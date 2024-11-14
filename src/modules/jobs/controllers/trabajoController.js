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
exports.listUltimosTrabajosByContratista = async (req, res) => {
    try {
        const contratistaId = req.userId;
        const page = parseInt(req.params.page, 10) || 1;
        
        const trabajos = await trabajoService.listUltimosTrabajosByContratista(contratistaId, page);
        
        res.status(200).json(trabajos);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.getTrabajosByTitleAndLocation = async (req, res) => {
    try {
      const search = req.query.search || null;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const estado = req.query.estado || 'Aceptado';
  
      const {trabajos, total} = await trabajoService.getTrabajosByTitleAndLocation(
        search,
        req.userId, // ID del colaborador que realiza la búsqueda
        page,
        limit,
        estado
      );
  
      res.status(200).json({ total ,trabajos });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  