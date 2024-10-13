const express = require('express');
const cors = require('cors');
const userRoutes = require('../modules/users/routes/userRoutes.js');
const documentRoutes = require('../modules/users/routes/documentRoutes.js');
const authRoutes = require('../modules/users/routes/authRoutes.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/auth', authRoutes);

module.exports = app;
