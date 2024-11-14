const oficioRepository = require('../repositories/oficioRepository');
const userRepository = require('../repositories/userRepository');

exports.createOficio = async (nombre) => {
  return await oficioRepository.createOficio(nombre);
};

exports.addColaborador = async (oficioId, colaboradorId) => {
  return await oficioRepository.addColaborador(oficioId, colaboradorId);
};

exports.getColaboradoresByOficioAndLocation = async (nombre, contratistaId, page = 1, limit = 10, search = null, searchl=null) => {
    const offset = (page - 1) * limit;
  
    const contratista = await userRepository.findUserById(contratistaId);
    if (!contratista) throw new Error('Contratista no encontrado');
  
    const oficio = await oficioRepository.getColaboradoresByOficio(nombre);
    if (!oficio) return [];
  
    const colaboradores = await userRepository.findColaboradoresByLocation({
      colaboradorIds: oficio.colaboradores,
      ciudad: contratista.ciudad,
      distrito: contratista.distrito,
      offset,
      limit,
      search,
      searchl,
    });
  
    return colaboradores;
  };

exports.editOficio = async (oficioId, nombre) => {
  return await oficioRepository.editOficio(oficioId, nombre);
};

exports.deleteOficio = async (oficioId) => {
  return await oficioRepository.deleteOficio(oficioId);
};

exports.countColaboradoresPorOficio = async () => {
  return await oficioRepository.countColaboradoresPorOficio();
};

exports.getAllOficios = async () => {
    return await oficioRepository.findAllOficios();
};

exports.checkColaboradorInOficios = async (colaboradorId) => {
    return await oficioRepository.checkarColaboradorInOficios(colaboradorId);
};