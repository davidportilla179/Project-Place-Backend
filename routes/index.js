const router = require('express').Router();

//Definimos el comportamiento raiz del endpoint
router.get('/', (req, res) =>{
  res.send('Bienvenidos a PLACES.INC, aqui inicia nuestro servidor');
});


//Definimos las rutas a nuestras collecciones
router.use('/auth', require('./auth'));
router.use('/users', require('./users'));
router.use('/places', require('./places'));


module.exports = router;