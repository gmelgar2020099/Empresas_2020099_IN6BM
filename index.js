const mongoose = require('mongoose');
const app = require('./app');
var controllerUser = require('./src/controllers/usuarios.controller')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/ControlEmpresas', {useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Se encuentra conectado a la base de datos");

    app.listen(3000, function(){
        console.log("Esta corriendo en el puerto 3000")
    })

    controllerUser.registarAdminDefecto();
}).catch(err => console.log(err))