const app = require('./config/app.js');
const sequelize = require('./config/database.js');
const mongoose = require('mongoose');
const { initializeAdmin } = require('./modules/users/controllers/userController.js');

const PORT = process.env.PORT || 3000;


console.log('MYSQL_HOST:', process.env.MYSQL_HOST); // Para verificar el valor cargado

sequelize.sync().then(() => {
  console.log('MySQL connected');
  mongoose.connect(process.env.MONGO_URI)
    .then(() => {
      console.log('MongoDB connected');
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    })
    .catch(err => console.log('MongoDB connection error:', err));
}).catch(err => console.log('MySQL connection error:', err));
//Si este comando no funciona es porque tiene una version anteior recomendable de configurar manualmente la bd en estos casos
initializeAdmin();