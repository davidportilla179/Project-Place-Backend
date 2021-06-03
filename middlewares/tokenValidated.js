//Mantenemos en intelligence
const {response} = require('express');

//Importamos la libreria jwt
const jwt = require('jsonwebtoken');


const tokenValidated = (req, res = response, next) =>{
    //Extrayendo el token de los headers
    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            ok:false,
            msg: 'No hay token en la peticion'
        });
    };

    try {
        //Verificando el token y obteniendo el payload
        const payload = jwt.verify(token,process.env.SECRET_JWT);
        //Agregando el uid y userName a la peticion
        req.uid = payload.uid; 
        req.userName = payload.userName;
        req.profilePhoto = payload.profilePhoto;

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }
    
    
    next();
};



module.exports = {
    tokenValidated
}




