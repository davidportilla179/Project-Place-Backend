var router = require('express').Router();

router.get('/', (req, res)=>{
  res.send('Welcome to PLCS API');
});

router.use('/users', require('./users'));
// router.use('/places', require('./users'));

module.exports = router;