# Sistema de Gestión de Trabajos

Este proyecto es una aplicación backend en Node.js con MySQL y MongoDB que permite la gestión de trabajos, postulaciones, recargas y quejas para colaboradores y contratistas, similar a un sistema de contratación de servicios. Incluye funcionalidades de autenticación JWT, subida de documentos PDF y registro de usuarios.

## Tecnologías Utilizadas

- Node.js
- Express.js
- MySQL (Sequelize)
- MongoDB (Mongoose)
- JWT (Json Web Token)
- Multer (Para la subida de archivos)
- Docker

## Estructura del Proyecto

El proyecto sigue una arquitectura de monolito modular. Cada funcionalidad importante está separada en módulos para facilitar el mantenimiento y la escalabilidad.

root/
├── src/
│   ├── modules/
│   │   ├── users/
│   │   │   ├── controllers/
│   │   │   │   ├── userController.js
│   │   │   │   ├── authController.js
│   │   │   │   ├── documentController.js
│   │   │   ├── services/
│   │   │   │   ├── userService.js
│   │   │   │   ├── documentService.js
│   │   │   ├── repositories/
│   │   │   │   ├── userRepository.js
│   │   │   │   ├── documentRepository.js
│   │   │   ├── models/
│   │   │   │   ├── User.js
│   │   │   │   ├── Document.js
│   │   │   ├── routes/
│   │   │   │   ├── userRoutes.js
│   │   │   │   ├── authRoutes.js
│   │   │   │   ├── documentRoutes.js
│   ├── config/
│   │   ├── database.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   ├── server.js
├── uploads/  # Carpeta para almacenar los PDFs subidos
├── docker-compose.yml
├── package.json
├── .env


## Características Principales

- **Registro de usuarios**: Permite que los colaboradores y contratistas se registren en el sistema.
- **Subida de documentos**: Los usuarios pueden subir documentos PDF (DNI y antecedentes) para validación.
- **Autenticación**: Login de usuarios con JWT.
- **Gestión de trabajos**: Los contratistas pueden publicar trabajos y los colaboradores pueden postularse.
- **Recargas**: Los colaboradores pueden recargar crédito para aplicar a trabajos.
- **Quejas**: Sistema de quejas para contratistas y colaboradores.

## Configuración

### Prerrequisitos

- Node.js (v14 o superior)
- Docker (opcional, si quieres correr MySQL y MongoDB en contenedores)

### Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/RodrigoLupo/apiHazloYA!.git
cd apiHazloYA!
```
2. Instala las dependencias:
npm install

3. Configura las variables de entorno. Crea un archivo .env basado en el ejemplo:
```bash
PORT=3000
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=nombre_de_la_base_de_datos
MONGO_URI=mongodb://localhost:27017/nombre_de_la_base_de_datos_mongo
JWT_SECRET=alguna_clave_secreta
```
4. Levanta los contenedores de Docker para MySQL y MongoDB:
docker-compose up -d

5. Corre las migraciones de la base de datos (si utilizas Sequelize para MySQL):
npx sequelize-cli db:migrate

Inicia el servidor:
npm start

El servidor estará corriendo en http://localhost:3000.

#### Uso

Endpoints principales:

POST /api/users/register: Registro de usuarios.

POST /api/auth/login: Login de usuarios.

POST /api/documents/upload/:id: Subida de documentos PDF (DNI, antecedentes).

GET /api/jobs: Obtener trabajos disponibles.

POST /api/jobs: Crear un trabajo (solo contratistas).

Pruebas con Postman

Registra un usuario enviando una petición POST a /api/users/register con los campos nombre, apellido, email, password.

Inicia sesión con el usuario registrado enviando una petición POST a /api/auth/login.

Sube documentos enviando una petición POST a /api/documents/upload/:id con el archivo PDF correspondiente.

