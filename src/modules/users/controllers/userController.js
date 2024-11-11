const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
  try {
    const { tokenTemporal } = await userService.registerUser(req.body);
    res.status(201).json({ token: tokenTemporal });
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
    const page = parseInt(req.params.page) || 1;
    const { users, total } = await userService.getActiveUsers(page);
    res.status(200).json({ users, total });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getInactiveUsers = async (req, res) => {
  try {
    const page = parseInt(req.params.page) || 1;
    const { users, total } = await userService.getInactiveUsers(page);
    res.status(200).json({ users, total });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
