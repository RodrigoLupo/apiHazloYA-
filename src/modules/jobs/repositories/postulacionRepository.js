const Postulacion = require('../models/Postulacion');
const User = require('../../users/models/User');

exports.createPostulacion = async (postulacionData) => {
    return await Postulacion.create(postulacionData);
}
exports.findPostulacionById = async (postulacionId) => {
    return await Postulacion.findByPk(postulacionId);
}
exports.findPostulacionByForJob = async (jobId) => {
    return await Postulacion.findAll({ where: { trabajo_id: jobId } });
}
exports.updatePostulacionStatus = async (id, newStatus) => {
    const postulacion = await this.findPostulacionById(id);
    if (postulacion) {
        return await postulacion.update({ estado: newStatus });
    }
    throw new Error('Postulación no encontrada');
}
exports.findPostulacionesByTrabajoId = async (trabajoId) => {
    return await Postulacion.findAll({
        where: { trabajo_id: trabajoId },
        include: [{ model: User, as: 'colaborador', attributes: ['nombre', 'apellido', 'calificacion'] }]
    });
};