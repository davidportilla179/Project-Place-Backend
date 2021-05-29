//Imprtacion del modelo user
const User = require('../models/User')
//Mantenemos en intelligence
const {response} = require('express');
//bcryptjs para encriptar la contraseña
const bcrypt  =require('bcryptjs');
//JWT
const {generarToken} = require('../helpers/generarJWT');


const createUser = async(req, res = response) =>{
  //Validacion de existencia en la base
  const {email, password} = req.body;
  console.log(req.body);

  try {
    //Buscando el la base di existe un usuario registrado con el correo
    //de la peticion
    let usuario = await User.findOne({email});

    if(usuario){
      res.status(400).json({
        ok: false,
        msg: 'Correo electronico duplicado, un usuario cuenta con esta informacion'
      })
    }

    //Realizando la nueva instancia de usuario
    usuario = new User(req.body);
    console.log(usuario);
    //Encriptando la contraseña
    //Generando la semilla
    const salt = bcrypt.genSaltSync(); //Por defecto tiene 10 vueltas de seguridad
    //Remplazando la contraseña
    usuario.password = bcrypt.hashSync(password,salt);

    //Guardando en la base de datos
    await usuario.save();
    
    //Generando el JWT
    const token = await generarToken(usuario.id, usuario.userName);
     //Respuesta
      res.status(201).json({
      ok: true,
      uid: usuario.id,
      userName: usuario.userName,
      firstName: usuario.firstName,
      lastName: usuario.lastName,
      token
      });


  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: 'Fallo la creacion del usuario, intentelo de nuevo!'
    })
  }
};




const getUsers = async(req, res = response) =>{
  try {
    const users = await User.find().populate('posts').select("-password");
    console.log(users);
    res.status(200).json({
        ok: true,
        users : users
    })
  } catch (error) {
      console.log(error);
      res.status(500).json({
          ok: false,
          msg: 'Error al traer los usuarios'
      })
  }
};

const updateUser = async(req, res= response)=>{
  //Extrayendo el id de el parametro
  const userId = req.params.id;
  
  try {
    //Realzando la busqueda del usuario
    let user = await User.findById(userId);

    if(!user){//si no existiera el usuario
      return res.status(404).json({
        ok: false,
        msg:'Usuario no encontrado, verifique el id'
      });
    };

    //construyendo el usuario actualizado
    const nuevoUsuario = {
      ...req.body,
      _id: userId
    }
    
    //Actualizacion de constraseña si viene en la peticion
    if(req.body.password){
      //Encriptado la contraseña
      const salt = bcrypt.genSaltSync(); //por defecto tiene dies vueltas de seguridad
      nuevoUsuario.password = bcrypt.hashSync(req.body.password, salt);
  };

    //Remplazando y actualizando el usuario
    const usuarioActualizado = await User.findByIdAndUpdate(userId,nuevoUsuario,{new: true}); //Actualizando el usuario
    console.log(usuarioActualizado);
      res.status(200).json({
        ok: true,
        user: usuarioActualizado
      });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok:false,
      msg: 'Fallo la actualizacion de usuario, Intentalo nuevamente'
    })
  };

};


const deleteUser = async(req, res = response) =>{
  //Extrayendo el id de la URL
  const userId = req.params.id;
  //Extrayendo el uid de la persona que esta haciendo la peticion
  const {uid}=req;
  //Verificando si el usuario es el mismo al que se desea eliminar
  if(uid !== userId){
    return res.status(301).json({
      ok:false,
      msg: 'No puedes borrar un usuario que no seas tu'
    })
  }

  try {
    //Buscando al usuario
    const user = await User.findById(userId);
    if(!user){
        return res.status(404).json({
            ok: false,
            msg: 'El usuario que quiere eliminar no existe en la base de datos'
        })
    };

     //Eliminando Usuario
     await User.findByIdAndDelete(userId);
            
     res.status(200).json({
         ok: true,
         msg: `El usuario ${user.userName} con id ${user._id} ha sido eliminado`
     })

  } catch (error) {
    console.log(error);
  }
}




module.exports = { 
  createUser,
  getUsers,
  updateUser,
  deleteUser
}