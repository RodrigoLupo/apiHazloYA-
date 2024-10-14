const userService = require('../services/userService');

exports.registerUser = async (req, res) => {
  try {
    const user = await userService.registerUser(req.body);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.activateUser = async (req, res) => {
  try {
    const user = await userService.activateUser(req.params.id);
    res.status(200).json({ message: 'Usuario activado correctamente', user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};