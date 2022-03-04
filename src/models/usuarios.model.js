const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var usuariosSchema = Schema({
    nombre: String,
    password: String,
    rol: String
})

module.exports=mongoose.model('usuarios',usuariosSchema)