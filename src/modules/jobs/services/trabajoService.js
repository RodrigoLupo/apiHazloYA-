const trabajoRepository = require('../repositories/trabajoRepository');

exports.createTrabajo = async (trabajoData) => {
    return await trabajoRepository.createTrabajo(trabajoData);
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