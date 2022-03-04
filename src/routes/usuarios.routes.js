const express = require('express');
const usuarioControler = require('../controllers/usuarios.controller')
const md_autenticacion = require('../middlewares/aut')

var api = express.Router();

api.post('/login', usuarioControler.login)
api.post('/agregarEmpresa',md_autenticacion.Auth, usuarioControler.agregarEmpresa)
api.put('/editarEmpresa/:idUser', md_autenticacion.Auth, usuarioControler.editarEmpresa)
api.delete('/eliminarEmpresa/:idUser',md_autenticacion.Auth, usuarioControler.eliminarEmpresa)
module.exports = api;