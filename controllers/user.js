const mongoose = require("mongoose");
const User = mongoose.model("User");
const passport = require('passport');

function createUser(req, res, next) {
  const body = req.body;
  let password = body.password;

  delete body.password;
  const user = new User(body);
  user.createPassword(password);
  user.save().then(userCreated => {
    return res.status(201).json(userCreated.toAuthJSON());
  }).catch(next);
}

function getUsers(req, res, next) {
  User.findById(req.user.id, (err, user) => {
    if (!user || err) {
      return res.sendStatus(401);
    }
    return res.json(user.publicData());
  }).catch(next);
}

function editUser(req, res, next) {
  User.findById(req.user.id).then(user => {
    if (!user) { return res.sendStatus(401); }
    let newInfo = req.body;
    if (typeof newInfo.username !== 'undefined')
      user.username = newInfo.username;
    if (typeof newInfo.firstName !== 'undefined')
      user.firstName = newInfo.firstName;
    if (typeof newInfo.lastName !== 'undefined')
      user.lastName = newInfo.lastName;
    if (typeof newInfo.country !== 'undefined')
      user.country = newInfo.country;
    if (typeof newInfo.age !== 'undefined')
      user.age = newInfo.age;
    user.save().then(updatedUser => {
      res.status(201).json(updatedUser.publicData());
    }).catch(next);
  }).catch(next);
}

function deleteUser(req, res, next) {
  User.findOneAndDelete({ _id: req.user.id }).then(r => {
    res.status(200).send(`Usuario ${req.params.id} eliminado: ${r}`);
  }).catch(next);
}

function logIn(req, res, next) {
  if (!req.body.email) {
    return res.status(422).json({ errors: { email: "no puede estar vacío" } });
  }

  if (!req.body.password) {
    return res.status(422).json({ errors: { password: "no puede estar vacío" } });
  }

  passport.authenticate('local-user', { session: false }, function (err, user, info) {
    if (err) { return next(err); }

    if (user) {
      user.token = user.generateJWT();
      return res.json({ user: user.toAuthJSON() });
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
}

module.exports = {
  createUser,
  getUsers,
  editUser,
  deleteUser,
  logIn
};