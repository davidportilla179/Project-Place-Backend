const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const User = mongoose.model('Student');

passport.use('local-user', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, function (email, password, done) {
  User.findOne({ email: email })
    .then(function (user) {
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { errors: { 'email o contraseña': 'equivocado(a)' } });
      }
      return done(null, user);
    })
    .catch(done);
}));