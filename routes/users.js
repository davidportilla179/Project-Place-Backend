const router = require('express').Router();

const {
  createUser,
  getUsers,
  editUser,
  deleteUser,
  logIn,
  updateUser
} = require('../controllers/user');

//Middlewares
const { tokenValidated } = require('../middlewares/tokenValidated');

//tokenValidated --- Aplica para todos
// router.use(tokenValidated)


router.get('/', tokenValidated,getUsers);
// router.get('/:id', getUsers);
router.post('/', createUser);
// router.post('/login', logIn);
router.put('/:id', tokenValidated, updateUser);

router.delete('/:id', tokenValidated, deleteUser);

module.exports = router;