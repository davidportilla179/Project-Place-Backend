const router = require('express').Router();
const {check} = require('express-validator'); //CHECK para validar campos

const {
  loginUser,
  revalidateToken
} = require('../controllers/auth');
//Middleware JWT
const { tokenValidated } = require('../middlewares/tokenValidated');
//Middleware Validar campos
const {validarCampos} = require('../helpers/validarCampos');



//Loggin de usuario
router.post('/', [
    check('email', 'Email no puede estar vacio').notEmpty(),
    check('email', 'Email erroneo, verificalo por favor').isEmail(),
    check('password', 'La contraseña no puede ir vacia'),
    check('password', 'La contraseña debe de ser de almenos 6 caracteres').isLength({min:6}),
    validarCampos
]
,loginUser);

//Revalidacion de token
router.get('/', tokenValidated, revalidateToken);


module.exports = router;