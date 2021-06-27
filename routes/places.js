//Importando el router de express
const router = require('express').Router();
//Middleware Validacion del JWT
const {tokenValidated} = require('../middlewares/tokenValidated');
//Middleware validar campos
const {validarCampos} =  require('../helpers/validarCampos')
//Middleware Check
const {check} = require('express-validator');

//Importando el controller
const {
addNewPlace, 
getPLaces,
updatePlace,
deletePlace
} = require('../controllers/place')

//todos los endpoints tienen que pasar por tokenValidated
router.use(tokenValidated);

//Agregar nuevo place
router.post('/',[
    check('place', 'El nombre del lugar no puede estar vacio').notEmpty(),
    check('image', 'Url de la imagen vacia').notEmpty(),
    check('address', 'Direccion vacia').notEmpty(),
    check('city', 'City esta vacia').notEmpty(),
    check('country', 'Country esta vacia').notEmpty(), 
],addNewPlace);

//Consultando los places
router.get('/', getPLaces);

//Actualizando el place
router.put('/:id', updatePlace);

//Eliminando el Place
router.delete('/:id', deletePlace)


module.exports = router;