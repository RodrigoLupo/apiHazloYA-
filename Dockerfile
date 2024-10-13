# Establecer la imagen base
FROM node:20

# Crear el directorio de la aplicación en el contenedor
WORKDIR /app

# Copiar el package.json y el package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install


# Copiar el resto de la aplicación al contenedor
COPY . .

# Exponer el puerto en el que corre la aplicación
EXPOSE 3000

# Comando para correr la aplicación
CMD ["npm", "start"]
