const jwt = require('jsonwebtoken');

const generarToken = (uid,userName, profilePhoto) =>{

    return new Promise((resolve, reject) =>{
        //Insertamos el id de usuario y nombre al token
        const payload = {uid, userName, profilePhoto};
        jwt.sign(payload, process.env.SECRET_JWT, {
            expiresIn: '4h'
        }, (err, token) =>{
            if(err){//Si existe un error, la promesa devuelve el error
                console.log(err);
                reject('No se pudo firmar el token')
            }
            //resuelta
            resolve(token)
        })
    });

};


module.exports = {
    generarToken
}