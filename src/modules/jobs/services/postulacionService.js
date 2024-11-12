const postulacionRepository = require('../repositories/postulacionRepository');
const userRepository = require('../../users/repositories/userRepository');
exports.createPostulacion = async (postulacionData) => {
    return await postulacionRepository.createPostulacion({
        ...postulacionData,
        colaborador_id: userId,
    });
};
exports.getPostulacionById = async (postulacionId) => {
    return await postulacionRepository.findPostulacionById(postulacionId);
};
exports.getPostulacionesByJob = async (jobId) => {
    return await postulacionRepository.findPostulacionByForJob(jobId);
};
exports.updatePostulacionStatus = async (id, newStatus) => {
    return await postulacionRepository.updatePostulacionStatus(id, newStatus);
};
exports.getPostulantesByTrabajo = async (trabajoId) => {
    const postulaciones = await postulacionRepository.findPostulacionesByTrabajoId(trabajoId);
    return postulaciones.map(postulacion => ({
        nombre: postulacion.colaborador.nombre,
        apellido: postulacion.colaborador.apellido,
        calificacion: postulacion.colaborador.calificacion
    }));
};