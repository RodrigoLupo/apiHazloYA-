const Postulacion = require('../models/Postulacion');
const User = require('../../users/models/User');
const Trabajo = require('../models/Trabajo');
exports.createPostulacion = async (postulacionData) => {
    return await Postulacion.create(postulacionData);
}
exports.findPostulacionById = async (postulacionId) => {
    console.log(postulacionId);
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
        include: [{ model: User, as: 'colaborador', attributes: ['id', 'nombre', 'apellido', 'calificacion'] }]
    });
};

exports.getPostulacionAceptadaByTrabajoId = async (trabajoId) => {
    return await Postulacion.findOne({
        where: { trabajo_id: trabajoId, estado: 'Aceptado' },
        include: [
            {
                model: Trabajo,
                as: 'trabajo',
                attributes: ['id','contratista_id','titulo', 'descripcion', 'fecha_creacion', 'estado']
            },
            {
                model: User,
                as: 'colaborador',
                attributes: ['id','nombre', 'apellido', 'telefono', 'email']
            }
        ]
    });
};

exports.findPostulacionesByColaboradorId = async (colaboradorId, estado, offset, limit) => {
    return await Postulacion.findAndCountAll({
        where: {
            colaborador_id: colaboradorId,
            estado: estado
        },
        include: [
            {
                model: Trabajo,
                as: "trabajo",
                attributes: ['id','titulo', 'distrito'],
                include: {
                    model: User,
                    as: 'contratista',
                    attributes: ['id','nombre']
                }
            }
        ],
        offset: offset,
        limit: limit
    });
};
