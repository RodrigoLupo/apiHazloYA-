const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
  try {
    const { tokenTemporal } = await userService.registerUser(req.body);
    res.status(201).json({ token: tokenTemporal });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.EstadoUsuario = async (req, res) => {
  try {
    const estado = await userService.getStateById(req.userId);  // Recibe el objeto `{ estado }`
    res.status(200).json(estado);  // Enviar el objeto `{ estado }` directamente
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.createEncargadoOrAdmin = async (req, res) => {
  try {
    const user = await userService.createEncargadoOrAdmin(req.userId, req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.initializeAdmin = async () => {
  await userService.ensureAdminExists();
};

exports.activateUser = async (req, res) => {
  try {
    const user = await userService.activateUser(req.params.id);
    res.status(200).json({ message: 'Usuario activado correctamente', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deactivateUser = async (req, res) => {
  try {
    const user = await userService.deactivateUser(req.params.id);
    res.status(200).json({ message: 'Usuario desactivado correctamente', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await userService.rechazar(req.params.id);
    res.status(200).json({ message: 'Usuario y documentos eliminados correctamente' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getActiveUsers = async (req, res) => {
  try {
    const tipoUsuario = req.query.tipo || null;
    const page = parseInt(req.params.page) || 1;
    const { users, total } = await userService.getActiveUsers(page, tipoUsuario);
    res.status(200).json({ users, total });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getInactiveUsers = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const tipoUsuario = req.query.tipo || null;
    const { users, total } = await userService.getInactiveUsers(page, tipoUsuario);
    res.status(200).json({ users, total });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.getReport = async (req, res) => {
  try {
    const report = await userService.getReport();
    res.status(200).json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.searchUsers = async (req, res) => {
  try {
      const { name, lastName } = req.query;

      if (!name && !lastName) {
          return res.status(400).json({ error: 'Debe proporcionar al menos un parámetro: name o lastName' });
      }

      const users = await userService.searchUsersByNameOrLastName(name, lastName);

      if (users.length === 0) {
          return res.status(404).json({ message: 'No se encontraron usuarios con los criterios proporcionados' });
      }

      res.json(users);
  } catch (error) {
      console.error('Error en searchUsers:', error);
      res.status(500).json({ error: 'Error al buscar usuarios' });
  }
};

exports.miPerfil = async (req, res) => {
  try{
    const userId = req.userId;
    const profile = await userService.getProfile(userId);
    res.status(200).json(profile);
  }catch(error){
    res.status(400).json({ error: error.message });
  }
};