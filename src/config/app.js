const express = require('express');
const path = require('path');
const cors = require('cors');
const cron = require('node-cron');
const userRoutes = require('../modules/users/routes/userRoutes.js');
const documentRoutes = require('../modules/users/routes/documentRoutes.js');
const authRoutes = require('../modules/users/routes/authRoutes.js');
const jobRoutes = require('../modules/jobs/routes/trabajoRoutes.js');
const applicationRoutes = require('../modules/jobs/routes/postulacionRoutes.js');
const ratingRoutes = require('../modules/users/routes/ratingRoutes.js');
const oficioRoutes = require('../modules/users/routes/oficioRoutes.js');
const quejaRoutes = require('../modules/complaints/routes/quejaRoutes.js');
const limpiezadocs = require('../utils/limpieza.js');
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
app.use('/api/oficios', oficioRoutes);
app.use('/api/quejas', quejaRoutes);
cron.schedule('0 0 * * *', async () => {
    console.log('Ejecutando limpieza de documentos rechazados a medianoche');
    await limpiezadocs.deleteRejectedDocumentsAndFiles();
});

module.exports = app;