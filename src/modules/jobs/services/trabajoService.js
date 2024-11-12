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