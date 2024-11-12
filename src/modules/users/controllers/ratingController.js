const ratingService = require('../services/ratingService');

exports.rateCollaborator = async (req, res) => {
    const { trabajoId, colaboradorId, puntualidad, calidad, comunicacion } = req.body;
  
    try {
      // Registrar la calificación en MongoDB
      await ratingService.registerRating(trabajoId, colaboradorId, { puntualidad, calidad, comunicacion });
  
      // Actualizar el ranking en MySQL
      await ratingService.updateUserRanking(colaboradorId);
  
      res.status(200).json({ message: 'Calificación registrada y ranking actualizado' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al registrar la calificación' });
    }
  };