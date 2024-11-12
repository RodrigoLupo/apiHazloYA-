const Trabajo = require('../models/Trabajo');
exports.createTrabajo = async (trabajoData) => {
    return await Trabajo.create(trabajoData);
};
exports.findTrabajoById = async (trabajoId) => {
    return await Trabajo.findByPk(trabajoId);
};
exports.findAllTrabajos = async (criteria) => {
    return await Trabajo.findAll({ where: { criteria } });
};
exports.updateTrabajoStatus = async (id, newStatus) => {
    const trabajo = await this.findTrabajoById(id);
    if (trabajo) {
        return await trabajo.update({ estado: newStatus });
    }
    throw new Error('Trabajo no encontrado');
};
exports.findTrabajosByDistrito = async (distrito, page) => {
    return await Trabajo.findAll({
        where: { distrito, estado: 'Abierto' },
        limit: 10,
        offset: (page - 1) * 10
    });
};
exports.countTrabajosByDistrito = async (distrito) => {
    return await Trabajo.count({
        where: { distrito, estado: 'Abierto' }
    });
};