const mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('../config').secret;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true, //este campo no se puede repetir
    lowercase: true,
    required: [true, "no puede estar vacío"],
    match: [/\S+@\S+\.\S+/, "es inválido"],
    index: true,
  },
  username: {
    type: String,
    unique: true, //este campo no se puede repetir
    lowercase: true,
    required: [true, "no puede estar vacío"],
    match: [/^[a-zA-Z0-9]+$/, "es inválido"],
    index: true,
  },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  country: String,
  age: Number,
  profilePhoto: String,
  coverPhoto: String,
  information: String,
  friends: Number,
  followers: Number,
  followed: Number,
  posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Place'}],
  hash: String,
  salt: String
}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: "Ya existe" });

//Crear salt y hash a partir de la contraseña
UserSchema.methods.createPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString("hex");
  this.hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
};

//Validar si la contraseña es correcta
UserSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 512, "sha512")
    .toString("hex");
  return this.hash === hash;
};

//Generar el JWT
UserSchema.methods.generateJWT = function() {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60); // 60 días antes de expirar

  return jwt.sign({
    id: this._id,
    username: this.username,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

//Devuelve la representación de un usuario después de autenticar
UserSchema.methods.toAuthJSON = function(){
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT()
  };
};

//Datos públicos
UserSchema.methods.publicData = function(){
  return {
    id: this.id,
    email: this.email,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    country: this.country,
    age: this.age,
    profilePhoto: this.profilePhoto,
    coverPhoto: this.coverPhoto,
    information: this.information,
    friends: this.friends,
    followers: this.followers,
    followed: this.followed,
    posts: this.posts,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

mongoose.model("User", UserSchema);