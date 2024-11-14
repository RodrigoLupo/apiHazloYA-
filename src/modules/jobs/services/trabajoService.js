const trabajoRepository = require('../repositories/trabajoRepository');
const userRepository = require('../../users/repositories/userRepository');
exports.createTrabajo = async (userId, trabajoData) => {
    return await trabajoRepository.createTrabajo({ 
        ...trabajoData, contratista_id: userId });
}

exports.getJobById = async (jobId) => {
    return await trabajoRepository.findTrabajoById(jobId);
}

exports.getAllJobs = async (criteria) => {
    return await trabajoRepository.findAllTrabajos(criteria);
}

exports.updateJobStatus = async (id, newStatus) => {
    return await trabajoRepository.updateTrabajoStatus(id, newStatus);
}
exports.listTrabajosCercanos = async (userId, page) => {
    const user = await userRepository.findUserById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    return await trabajoRepository.findTrabajosByDistrito(user.distrito, page);
};
exports.countTrabajosByDistrito = async (userId) => {
    const user = await userRepository.findUserById(userId);
    return await trabajoRepository.countTrabajosByDistrito(user.distrito);
};
exports.listUltimosTrabajosByContratista = async (contratistaId, page) => {
    try {
        const trabajos = await trabajoRepository.findUltimosTrabajosByContratista(contratistaId, page);
        return trabajos;
    } catch (error) {
        throw new Error('Error al obtener los ultimos trabajos del contratista: ' + error.message);
    }
};

exports.getTrabajosByTitleAndLocation = async (search, colaboradorId, page = 1, limit = 10, estado = 'Abierto') => {
  const offset = (page - 1) * limit;

  // Obtener al colaborador para acceder a la ciudad y distrito del contratista (trabajos vinculados)
  const colaborador = await userRepository.findUserById(colaboradorId);
  if (!colaborador) throw new Error('Colaborador no encontrado');

  return await trabajoRepository.findTrabajosByTitleAndLocation({
    search,
    ciudad: colaborador.ciudad,
    distrito: colaborador.distrito,
    estado,
    offset,
    limit,
  });
};
