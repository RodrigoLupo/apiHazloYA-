const express = require('express');
const path = require('path');
const cors = require('cors');
const userRoutes = require('../modules/users/routes/userRoutes.js');
const documentRoutes = require('../modules/users/routes/documentRoutes.js');
const authRoutes = require('../modules/users/routes/authRoutes.js');
const jobRoutes = require('../modules/jobs/routes/trabajoRoutes.js');
const applicationRoutes = require('../modules/jobs/routes/postulacionRoutes.js');
const ratingRoutes = require('../modules/users/routes/ratingRoutes.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/ranking', ratingRoutes);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

module.exports = app;
