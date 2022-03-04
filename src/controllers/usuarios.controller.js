const Usuarios = require('../models/usuarios.model')
const brycpt = require('bcrypt-nodejs');
const jwt = require('../services/jwt')

function login(req, res) {
    var parameters = req.body
    Usuarios.findOne({ nombre: parameters.nombre }, (err, usuarioLogeado) => {
        if (err) return res.status(500).send({ message: 'error en la peticion' })
        if (usuarioLogeado) {
            brycpt.compare(parameters.password, usuarioLogeado.password,
                (err, passwordComparacion) => {
                    if (passwordComparacion) {
                        if (parameters.obtenerToken === 'true') {
                            return res.status(200).send({ token: jwt.crearToken(usuarioLogeado) })
                        } else {
                            usuarioLogeado.password = undefined;
                            return res.status(200).send({ usuario: usuarioLogeado })
                        }
                    } else {
                        return res.status(500).send({ message: "contrasena no coincide" });
                    }
                })
        } else {
            return res.status(500).send({ message: "Error, datos erroneos" });
        }
    })
}
function registarAdminDefecto(req, res) {
    var usuarioModelo = new Usuarios();
    usuarioModelo.nombre = 'ADMIN';
    usuarioModelo.rol = 'ROL_ADMINISTRADOR';
    Usuarios.find({ nombre: 'ADMIN' }, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            brycpt.hash("123456", null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardadoSegundo) => {
                    return res.status(200).send({ usuario: usuarioGuardadoSegundo })
                })
            })
        } else {
            console.log('El usuario ya existe')
        }
    })
}


function agregarEmpresa(req, res) {
    var parameters = req.body
    const usuarioModelo = new Usuarios()
    if (parameters.nombre && parameters.password) {
        usuarioModelo.nombre = parameters.nombre
        usuarioModelo.password = parameters.password;
        usuarioModelo.rol = 'ROL_EMPRESA'
    }
    if (req.user.rol == "ROL_ADMINISTRADOR") {
        Usuarios.find({ nombre: parameters.nombre }, (err, usuarioGuardado) => {
            if (usuarioGuardado.length == 0) {

                brycpt.hash(parameters.password, null, null, (err, passswordEncypt) => {
                    usuarioModelo.password = passswordEncypt
                    usuarioModelo.save((err, usuarioGuardado) => {
                        console.log(err)
                        if (err) return res.status(500)
                            .send({ message: "error en la peticion" });
                        if (!usuarioGuardado) return res.status(404)
                            .send({ message: "Error, no se agrego el usuario" });
                        return res.status(201).send({ usuario: usuarioGuardado });
                    })
                })
            } else {
                return res.status(500).send({ message: "esta usando el mismo nombre" });
            }
        })
    } else {
        return res.status(500).send({ message: "error en la peticion, no tiene permisos de administrador" });
    }
}

function editarEmpresa(req, res) {
    var idUser = req.params.idUser
    var parameters = req.body
    if (req.user.rol == 'ROL_ADMINISTRADOR') {
        Usuarios.findByIdAndUpdate({ _id: idUser }, parameters, { new: true }, (err, usuarioEditado) => {
            if (err) return res.status(500).send({ message: "error en la peticion" });
            if (!usuarioEditado) return res.status(404).send({ message: "Error, no se edito el usuario" });
            return res.status(200).send({ menssage: usuarioEditado })
        })
    } else {
         return res.status(500).send({ message: "error en la peticion, no tiene permisos de administrador" });
    }
}

function eliminarEmpresa(req, res) {
    var idUser = req.params.idUser;
    var parameters = req.body;
    if (req.user.rol == "ROL_ADMINISTRADOR") {
        Usuarios.findByIdAndDelete({ _id: idUser }, parameters, (err, empresaEliminada) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empresaEliminada) return res.status(400).send({ mensaje: 'No es posible eliminar la empresa' });
            return res.status(200).send({ usuarios: empresaEliminada });
        })
    } else {
        return res.status(500).send({ mensaje: 'No posee permisos para eliminar la empresa' });
    }
}

module.exports = {
    login,
    registarAdminDefecto,
    agregarEmpresa,
    editarEmpresa,
    eliminarEmpresa

}