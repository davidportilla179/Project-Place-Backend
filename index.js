//Importando express
const express = require('express');
//Connecion a la base de datos
const {dbConnection} = require('./database/config');
//variables de entorno
require('dotenv').config();
//CORS
const cors = require('cors');


//Crear el servidor de express
const app = express();

//conexion a base de datos
dbConnection();

//intercambio de recursos de origen cruzado
app.use(cors());

//Lectura y parse del body
app.use(express.json());


//rutas
// app.use()

app.use('/PLACE', require('./routes'))

app.listen(process.env.PORT,()=>{
  console.log(`> Servidor coriendo en el puerto ${process.env.PORT}`);
})

