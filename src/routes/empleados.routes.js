const express = require('express');
const empleadoController = require('../controllers/empleados.controller');
const md_autentificacion = require('../middlewares/aut');

var app = express.Router();


app.post('/registrarEmpleado', md_autentificacion.Auth, empleadoController.agregarEmpleados);
app.put('/editarEmpleado/:idEmpleado', md_autentificacion.Auth, empleadoController.editarEmpleados)
app.delete('/eliminarEmpleado/:idEmpresa', md_autentificacion.Auth, empleadoController.eliminarEmpleados)
app.get('/buscarEmpleadoId/:idEmpleado', md_autentificacion.Auth, empleadoController.obtenerEmpleadosId)
app.get('/buscarEmpleadoNombre/:nomUs',md_autentificacion.Auth, empleadoController.obtenerEmpleadoPorNombre)
app.get('/buscarPuesto/:puestoEmpleado', md_autentificacion.Auth, empleadoController.ObtenerEmpleadosPuesto);
app.get('/buscarDepartamento/:departamento', md_autentificacion.Auth, empleadoController.obtenerDepartamento)
app.get('/empleados', md_autentificacion.Auth, empleadoController.obtenerTodosEmpleados);
app.get('/generarPdf',md_autentificacion.Auth, empleadoController.generarPDF)
app.get('/contarEmpleados',md_autentificacion.Auth, empleadoController.contarEmpleados);
module.exports = app;