const postulacionRepository = require('../repositories/postulacionRepository');
const userRepository = require('../../users/repositories/userRepository');
const Rating = require('../../users/models/Rating');


exports.createPostulacion = async (userId,postulacionData) => {
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
        id: postulacion.colaborador.id,
        nombre: postulacion.colaborador.nombre,
        apellido: postulacion.colaborador.apellido,
        calificacion: postulacion.colaborador.calificacion,
        precio: postulacion.precio_ofrecido,
        duracion: postulacion.tiempo_estimado
    }));
};
exports.getHistorialPostulaciones = async (colaboradorId, estado, page = 1, limit = 10) => {
    const offset = (page - 1) * limit;

    // Paso 1: Obtener las postulaciones desde SQL
    const { rows: postulaciones, count } = await postulacionRepository.findPostulacionesByColaboradorId(
        colaboradorId,
        estado,
        offset,
        limit
    );

    // Paso 2: Para cada postulación, buscar el rating en MongoDB usando trabajo_id y colaborador_id
    const data = await Promise.all(postulaciones.map(async (postulacion) => {
        const rating = await Rating.findOne({
            trabajoId: postulacion.trabajo_id,
            colaboradorId: colaboradorId
        });

        return {
            id: postulacion.id,
            tituloTrabajo: postulacion.trabajo.titulo,
            precioOfrecido: postulacion.precio_ofrecido,
            estado: postulacion.estado,
            distritoTrabajo: postulacion.trabajo.distrito,
            nombreContratista: postulacion.trabajo.contratista.nombre,
            calificacionColaborador: {
                puntualidad: rating?.puntualidad || 0,
                calidad: rating?.calidad || 0,
                comunicacion: rating?.comunicacion || 0
            }
        };
    }));

    return {
        total: count,
        pages: Math.ceil(count / limit),
        currentPage: page,
        data
    };
};
