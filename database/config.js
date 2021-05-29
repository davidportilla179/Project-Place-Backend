const mongoose = require('mongoose');

const dbConnection = async()=>{

    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true, 
            useUnifiedTopology: true , 
            useCreateIndex: true,
            useFindAndModify: false
        });
        console.log('DB online');
    } catch (error) {
        console.log(error);
        throw new Error('Error al conectar a la base de datos')
    }
}

module.exports = {
    dbConnection
}