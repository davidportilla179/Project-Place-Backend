//Definiendo nuestro esquema de usuarios;
const {Schema, model} = require('mongoose');


const userSchema = new Schema({

  userName:{
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type:String,
    required: true
  },
  country: {
    type:String,
    required: true
  },
  age: {
    type:String,
    required: true
  },
  profilePhoto: {
    type: String,
    required: true
  },
  coverPhoto: {
    type: String,
    required: true
  },
  information: {
    type: String,
    required: true
  },
  friends:{
    type: String,
    required: true
  },
  followers: {
    type: String,
    required: true
  },
  followed: {
    type: String,
    required: true
  },
  posts: {
   type: [Schema.Types.ObjectId],
   ref: 'Place'

  },

});

//Editandop el schema
userSchema.method('toJSON', function(){
  const {__v, _id, ...object} = this.toObject();
  object.uid = _id;
  return object;
});//Esto nos permite sobreEscribir el id y quitar _v de nuestras consultas




//exportando el modelo
module.exports = model('User', userSchema);