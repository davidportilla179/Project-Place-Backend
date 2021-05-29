const router = require('express').Router();
const {check} = require('express-validator'); //CHECK para validar campos

const {
  loginUser,
  revalidateToken
} = require('../controllers/auth');
const { tokenValidated } = require('../middlewares/tokenValidated');



router.post('/', loginUser);
router.get('/', tokenValidated, revalidateToken)


module.exports = router;