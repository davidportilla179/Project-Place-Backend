//Importando el router de express
const {response} = require('express');
//Importando el modelo place
const Place = require('../models/Places');


const addNewPlace = async(req, res = response) =>{
    //Extrayendo el uid del token 
    const {uid} = req;
    //Nueva instancia de Place
    const place = new Place(req.body);
    //Agregando el ususario que posteo el nuevo place
    place.user = uid;

    try {
        //Guardando en la base de datos
        const newPlace = await place.save();
        //Devolviendo respuesta
        res.status(201).json({
            ok: true,
            place: newPlace
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error al grabar place en la base de datos, intentelo nuevamente'
        });
    };
};


const getPLaces = async(req, res = response)=>{
    try {
        const places = await Place.find().populate('user', '_id userName firstName lastName')
                                         .populate({path: 'comments', populate:{path: 'user', select:'_id userName profilePhoto' ,model: 'User'}})
    
        res.json({
            ok: true,
            places
        })
        
    } catch (error) {
        console.log(error);
        res.json({
            ok: false,
            msg: 'No se han podido consultar los places'
        })
    }

};


const updatePlace = async(req, res = response) =>{
    //Extrayendo el id de los lugares
    const placeId = req.params.id;
    
    const {uid} = req;

    try {
        //Buscando el place en la base
        let place = await Place.findById(placeId);
        //Si no existe
        if(!place){
            return res.status(404).json({
                ok: false,
                msg: 'El Place no esta registrado en la base de datos'
            })
        };


         //Verificando si el usuario es el mismo al que se desea eliminar
        if(uid != place.user){
            return res.status(301).json({
            ok:false,
            msg: `PlaceFailed, este place le pertenece a ${req.userName} y no es posible actualizarlo`,
        })
      }

        const PlaceActualizado = {
            ...req.body,
            user: uid
        }

        const actualizacion = await Place.findByIdAndUpdate(placeId,PlaceActualizado, {new: true});
        console.log(actualizacion);
        res.status(200).json({
            ok: true,
            place: actualizacion
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: "Error interno, no fue posible actualizar"
        })
    }
};

const deletePlace = async(req, res = response) =>{
    const placeId = req.params.id;

    const {uid} = req;

    try {
        //Buscando el place en la base
        let placeSearch = await Place.findById(placeId);
        //Si no existe
        if(!placeSearch){
            return res.status(404).json({
                ok: false,
                msg: 'El Place no esta registrado en la base de datos'
            })
        };

         //Verificando si el usuario es el mismo al que se desea eliminar
         if(uid != placeSearch.user){
            return res.status(301).json({
            ok:false,
            msg: `PlaceFailed, este place le pertenece a ${req.userName} y no es posible eliminarlo`,
            })
        }

        await Place.findByIdAndDelete(placeId);

        res.status(200).json({
            ok: true,
            msg: `El Place ${placeSearch.place} con id ${placeSearch._id} ha sido eliminado`
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: true,
            msg: "Error interno, no fue posible eliminar"
        })
    }
}


module.exports = {
    addNewPlace,
    getPLaces,
    updatePlace,
    deletePlace
}