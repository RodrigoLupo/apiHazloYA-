const trabajoRepository = require('../repositories/trabajoRepository');
const postulacionRepository = require('../repositories/postulacionRepository');
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
exports.aceptarPostulacion = async (postulacionId) => {
    const postulacion = await postulacionRepository.findPostulacionById(postulacionId);
    if (!postulacion) throw new Error('Postulación no encontrada');
  
    const trabajo = await trabajoRepository.findTrabajoById(postulacion.trabajo_id);
    if (!trabajo) throw new Error('Trabajo no encontrado');
    if (trabajo.estado !== 'Abierto') throw new Error('El trabajo no está disponible para aceptar postulaciones');
  
    postulacion.estado = 'Aceptado';
    await postulacion.save();
  
    trabajo.estado = 'En proceso';
    await trabajo.save();
  
    return {
      message: 'Postulación aceptada y trabajo en proceso',
      trabajoId: trabajo.id,
      estadoTrabajo: trabajo.estado,
      estadoPostulacion: postulacion.estado
    };
};
exports.getPostulacionAceptadaByTrabajoId = async (trabajoId) => {
    const postulacion = await postulacionRepository.getPostulacionAceptadaByTrabajoId(trabajoId);

    if (!postulacion) throw new Error('No se encontró una postulación aceptada para este trabajo');

    return {
        trabajoId: postulacion.trabajo.id,
        contratistaId: postulacion.trabajo.contratista_id,
        titulo: postulacion.trabajo.titulo,
        descripcion: postulacion.trabajo.descripcion,
        fecha: postulacion.trabajo.fecha_creacion,
        estado: postulacion.trabajo.estado,
        colaborador: {
            postulacionId: postulacion.id,
            id: postulacion.colaborador.id,
            nombre: postulacion.colaborador.nombre,
            apellido: postulacion.colaborador.apellido,
            telefono: postulacion.colaborador.telefono,
            email: postulacion.colaborador.email
        }
    };
};
exports.getHistorialTrabajosByContratista = async (contratistaId, estado, page, limit) => {
    const offset = (page - 1) * limit;

    const trabajos = await trabajoRepository.getHistorialTrabajosByContratistaId(
        contratistaId,
        estado,
        offset,
        limit
    );

    return trabajos.map(trabajo => ({
        id: trabajo.id,
        contratistaid : contratistaId,
        titulo: trabajo.titulo,
        descripcion: trabajo.descripcion,
        estado: trabajo.estado,
        fecha_creacion: trabajo.fecha_creacion
    }));
};

exports.getAllTrabajos = async (page, limit) => {
    const { count, rows } = await trabajoRepository.getAllTrabajos(page, limit);

    return {
        total: count,
        trabajos: rows.map(trabajo => ({
            id: trabajo.id,
            titulo: trabajo.titulo,
            descripcion: trabajo.descripcion,
            precio: trabajo.precio,
            estado: trabajo.estado,
            fecha_creacion: trabajo.fecha_creacion
        })),
        page,
        limit
    };
};