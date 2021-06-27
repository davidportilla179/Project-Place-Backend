//Importando el modelo de User
const User = require('../models/User');
//Mantenermos el intteligence
const {response} = require('express');
//bcryptjs
const bcrypt = require('bcryptjs');
const { generarToken } = require('../helpers/generarJWT');




const loginUser = async(req, res= response) =>{
    //Extrayendo las credenciales de la peticion
    const {email, password} = req.body;
    
    try {
        //Buscando al usuario
        let usuario = await User.findOne({email});

        if(!usuario){ //Si el usuario no existe en la base
            return res.status(400).json({
                ok: false,
                msg: 'Usuario no encontrado, verifique el email por favor'
            })
        };

        //Validando la contraseña encriptada
        const validPassword = bcrypt.compareSync(password, usuario.password)

        if(!validPassword){//Si la contraseña es incorrecta
            return res.status(400).json({
                ok: false,
                msg: 'Password incorrecto'
            })
        };

        //Generando nuestro JWT
        const token = await generarToken(usuario.id, usuario.userName, usuario.profilePhoto);

        res.status(200).json({
            ok: true,
            uid: usuario.id,
            userName: usuario.userName,
            profilePhoto: usuario.profilePhoto,
            token
            
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Acerquese a los administradores para resolver el problema'
        });
    }
};



const revalidateToken = async(req, res = response) =>{
    //Obteniendo el uid y userName del middleware tokenValidated
    const {uid, userName, profilePhoto} = req;
    console.log(profilePhoto);
    //Generar nuevo token
    const token = await generarToken(uid, userName);

    //Regresando token
    res.json({
        ok: true,
        uid,
        userName,
        profilePhoto,
        token
    })
}


module.exports = {
    loginUser,
    revalidateToken
}