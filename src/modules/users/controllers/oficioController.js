const oficioService = require('../services/oficioService');

exports.createOficio = async (req, res) => {
  try {
    const oficio = await oficioService.createOficio(req.body.nombre);
    res.status(201).json({ oficio });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.addColaboradorToOficio = async (req, res) => {
  try {
    const colaboradorId = req.userId;
    const oficio = await oficioService.addColaborador(req.params.oficioId, colaboradorId);
    res.status(200).json({ oficio });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getColaboradoresByOficioAndLocation = async (req, res) => {
    try {
      const { nombre } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || null;
      const searchl = req.query.searchl || null;
  
      const colaboradores = await oficioService.getColaboradoresByOficioAndLocation(
        nombre,
        req.userId,
        page,
        limit,
        search,
        searchl
      );
  
      res.status(200).json({ colaboradores });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
exports.editOficio = async (req, res) => {
  try {
    const oficio = await oficioService.editOficio(req.params.oficioId, req.body.nombre);
    res.status(200).json({ oficio });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteOficio = async (req, res) => {
  try {
    await oficioService.deleteOficio(req.params.oficioId);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.countColaboradoresPorOficio = async (req, res) => {
  try {
    const count = await oficioService.countColaboradoresPorOficio(req.params.nombre);
    res.status(200).json({ count });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
