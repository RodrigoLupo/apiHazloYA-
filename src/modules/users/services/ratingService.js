const Rating = require('../models/Rating');
const User = require('../models/User');
exports.registerRating = async (userId, trabajoId, colaboradorId, calificaciones) => {
  const { puntualidad, calidad, comunicacion } = calificaciones;

  const rating = new Rating({
    contratistaId: userId,
    trabajoId,
    colaboradorId,
    puntualidad,
    calidad,
    comunicacion
  });

  return await rating.save();
};

exports.updateUserRanking = async (colaboradorId) => {
  const ratings = await Rating.find({ colaboradorId });

  if (ratings.length === 0) return;

  const totalRatings = ratings.length;
  const avgPuntualidad = ratings.reduce((sum, r) => sum + r.puntualidad, 0) / totalRatings;
  const avgCalidad = ratings.reduce((sum, r) => sum + r.calidad, 0) / totalRatings;
  const avgComunicacion = ratings.reduce((sum, r) => sum + r.comunicacion, 0) / totalRatings;

  const rankingGeneral = (avgPuntualidad * 0.3) + (avgCalidad * 0.5) + (avgComunicacion * 0.2);

  await User.update({ calificacion: rankingGeneral }, { where: { id: colaboradorId } });
};

