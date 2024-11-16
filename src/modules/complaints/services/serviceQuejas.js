const quejaRepository = require('../repositories/repositoryQuejas');
const trabajoRepository = require('../../jobs/repositories/trabajoRepository');
const postulacionRepository = require('../../jobs/repositories/postulacionRepository');
const userRepository = require('../../users/repositories/userRepository');

exports.createQueja = async (usuarioId, trabajoId, titulo, descripcion, tipo) => {
  let implicado = '';

  const trabajo = await trabajoRepository.findTrabajoById(trabajoId);
  if (!trabajo) throw new Error('Trabajo no encontrado');

  if (tipo === 'Contratista') {
    const postulacionAceptada = await postulacionRepository.getPostulacionAceptadaByTrabajoId(trabajoId);
    if (!postulacionAceptada) throw new Error('No se encontró un colaborador aceptado para este trabajo');
    
    const colaborador = await userRepository.findUserById(postulacionAceptada.colaborador_id);
    if (!colaborador) throw new Error('Colaborador no encontrado');
    implicado = `${colaborador.nombre} ${colaborador.apellido}`;
  } else if (tipo === 'Colaborador') {
    const contratista = await userRepository.findUserById(trabajo.contratista_id);
    if (!contratista) throw new Error('Contratista no encontrado');
    implicado = `${contratista.nombre} ${contratista.apellido}`;
  }

  return await quejaRepository.createQueja({
    usuario_id: usuarioId,
    trabajo_id: trabajoId,
    titulo,
    descripcion,
    tipo,
    implicado
  });
};
exports.getAllQuejas = async (page, limit, estado) => {
    const { count, rows } = await quejaRepository.getAllQuejas(page, limit, estado);

    return {
        total: count,
        quejas: rows.map(queja => ({
            id: queja.id,
            titulo: queja.titulo,
            descripcion: queja.descripcion,
            tipo: queja.tipo,
            estado: queja.estado,
            implicado: queja.implicado,
            fecha: queja.fecha
        })),
        page,
        limit
    };
};
