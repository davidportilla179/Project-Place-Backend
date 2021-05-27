const router = require('express').Router();
const {
  createUser,
  getUsers,
  editUser,
  deleteUser,
  logIn
} = require('../controllers/user');

const { auth } = require('./auth');

router.get('/', auth.require, getUsers);
router.get('/:id', getUsers);
router.post('/', createUser);
router.post('/login', logIn);
router.put('/:id', auth.require, editUser);
router.delete('/:id', auth.require, deleteUser);

module.exports = router;