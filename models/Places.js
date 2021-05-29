//Definiendo nuestro esquema de places
const {Schema, model} = require('mongoose');


const placeSchema =  new Schema({
    place: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    likes: {
        type: String,
        required: true
    },
    likeMe: {
        type: Boolean,
        required: true
    },
    visitors: {
        type: String,
        required: true
    },
    comments: {
        type: Array,
        required: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});


//Editandop el schema
placeSchema.method('toJSON', function(){
    const {__v, _id, ...object} = this.toObject();
    object.placeId = _id;
    return object;
});//Esto nos permite sobreEscribir el id y quitar _v de nuestras consultas
  
  

//exportando el modelo
module.exports = model('Place', placeSchema);