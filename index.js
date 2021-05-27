const express = require('express');
const bodyParser = require('body-parser');
const cors= require('cors');

/*********************** Mongoose Configuration *******************************/
const mongoose = require('mongoose');

let isProduction = process.env.NODE_ENV === 'production';

mongoose.connect(
  process.env.MONGODB_URI,
  { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }
);
mongoose.set("debug", true);

require("./models/User");
// require("./models/Place");
/*********************** Mongoose Configuration *******************************/

// Objeto global de la app
const app = express();
// configuración de middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

//routers
app.use('/v1', require('./routes/index'));
app.get('/', (req, res)=>{
  res.send('Bienvenidos a Plcs');
});

// Manejando los errores 404
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Iniciando el servidor...
var server = app.listen(process.env.PORT || 3000, function(){
  console.log('Escuchando en el puerto http://localhost:' + server.address().port);
});