const mongoose = require('mongoose');

var Schema=mongoose.Schema;

var empleadosSchema = Schema({
   nombre: String,
   puesto: String,
   departamento: String,
   idEmpresa:{type:Schema.Types.ObjectId, ref:'usuarios'} 
})

module.exports=mongoose.model('empleados',empleadosSchema)