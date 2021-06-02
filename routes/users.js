const router = require('express').Router();
//Check
const {check} = require('express-validator');

const {
  createUser,
  getUsers,
  editUser,
  deleteUser,
  logIn,
  updateUser,
  getUserById
} = require('../controllers/user');

//Middlewares
const { tokenValidated } = require('../middlewares/tokenValidated');
const {validarCampos} = require('../helpers/validarCampos');


router.get('/', tokenValidated,getUsers);


router.get('/:id', tokenValidated,getUserById);

//Nuevo usuario
router.post('/',[
  check('userName','El userName es obligatorio').notEmpty(),
  check('email','El email es obligatorio').notEmpty(),
  check('email','El email no valido').isEmail(),
  check('password','Password vacio').notEmpty(),
  check('password','El password debe de ser minimo 6 caracteres').isLength({min:6}),
  check('firstName','FirstName es obligatorio').notEmpty(),
  check('lastName',' Lastname no puede estar vacio').notEmpty(),
  check('country', 'Country no puede estar vacio'),
  check('age', 'Campo Age esta vacio'),
  validarCampos
], createUser);

router.put('/:id', tokenValidated, updateUser);

router.delete('/:id', tokenValidated, deleteUser);

module.exports = router;