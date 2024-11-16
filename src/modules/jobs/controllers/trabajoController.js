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
      const estado = req.query.estado || 'Abierto';
  
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

exports.aceptarSolicitud = async (req, res) => {
    try {
        const {postulacionId} = req.params;
        const postulacion = await trabajoService.aceptarPostulacion(postulacionId);
        res.status(200).json(postulacion);
    } catch (error) {
        console.error('Error en aceptarSolicitud:', error)
        res.status(500).json({ error: 'Error al aceptar la solicitud' });
    }
};

exports.getColaboradorByTrabajoId = async (req, res) => {
    try {
        const { trabajoId } = req.params;

        const colaborador = await trabajoService.getPostulacionAceptadaByTrabajoId(trabajoId);

        res.status(200).json(colaborador);
    } catch (error) {
        console.error('Error en getColaboradorByTrabajoId:', error);
        res.status(500).json({ error: 'Error al obtener información del colaborador' });
    }
};
exports.getHistorialTrabajos = async (req, res) => {
    try {
        const contratistaId = req.userId; // Se asume que `req.userId` es el contratista autenticado.
        const { page, limit, estado } = req.query;

        if (!estado) {
            return res.status(400).json({ error: 'El estado es requerido' });
        }

        const historial = await trabajoService.getHistorialTrabajosByContratista(
            contratistaId,
            estado,
            parseInt(page) || 1,
            parseInt(limit) || 10
        );

        res.json(historial);
    } catch (error) {
        console.error('Error en getHistorialTrabajos:', error);
        res.status(500).json({ error: 'Error al obtener el historial de trabajos' });
    }
};

exports.getAllTrabajos = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        if (isNaN(page) || isNaN(limit)) {
            return res.status(400).json({ error: 'Los parámetros page y limit deben ser numéricos' });
        }

        const resultado = await trabajoService.getAllTrabajos(parseInt(page), parseInt(limit));
        res.json(resultado);
    } catch (error) {
        console.error('Error en getAllTrabajos:', error);
        res.status(500).json({ error: 'Error al obtener los trabajos' });
    }
};
