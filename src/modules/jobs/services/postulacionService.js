const postulacionRepository = require('../repositories/postulacionRepository');

exports.createPostulacion = async (postulacionData) => {
    return await postulacionRepository.createPostulacion(postulacionData);
}
exports.getPostulacionById = async (postulacionId) => {
    return await postulacionRepository.findPostulacionById(postulacionId);
};
exports.getPostulacionesByJob = async (jobId) => {
    return await postulacionRepository.findPostulacionByForJob(jobId);
};
exports.updatePostulacionStatus = async (id, newStatus) => {
    return await postulacionRepository.updatePostulacionStatus(id, newStatus);
};