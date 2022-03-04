
var express = require('express');
const cors = require('cors');
var app = express();

//IMPORTACIONES RUTAS
const rutasUsuario = require('./src/routes/usuarios.routes');
const rutasEmpleados = require('./src/routes/empleados.routes')

//MIDDLEWARES
app.use(express.urlencoded({extended: false}));
app.use(express.json());


//CABECERAS
app.use(cors());

//CARGA DE RUTAS se realizaba como localhost:3000/obtenerProductos
app.use('/api', rutasUsuario, rutasEmpleados);


module.exports = app;
