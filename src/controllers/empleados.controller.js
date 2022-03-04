const { ClientRequest } = require('http')
const Empleados = require('../models/empleados.model')

function agregarEmpleados(req, res) {
    var parameters = req.body
    var verificacion = req.user.rol
    const empleadoModel = new Empleados()
    if (parameters.nombre && parameters.puesto && parameters.departamento) {
        empleadoModel.nombre = parameters.nombre
        empleadoModel.puesto = parameters.puesto
        empleadoModel.departamento = parameters.departamento
        empleadoModel.idEmpresa = req.user.sub
    }
    if (verificacion == 'ROL_EMPRESA') {
        Empleados.find({
            nombre: parameters.nombre,
            puesto: parameters.puesto,
            departamento: parameters.departamento,
            idEmpresa: req.user.sub
        }, (err, EmpleadoNuevo) => {
            if (EmpleadoNuevo.length == 0) {
                empleadoModel.save((err, EmpleadoNuevo) => {
                    if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                    if (!EmpleadoNuevo) return res.status(404).send({ mensaje: 'error, al agregar el empleado' });
                    return res.status(200).send({ Empleados: EmpleadoNuevo });
                })
            } else {
                return res.status(404).send({ message: 'esta creando el mismo empleado' })
            }
        })
    } else {
        return res.status(404).send({ message: 'no tiene permisos para realizar esta accion' })
    }

}

function editarEmpleados(req, res) {
    var idEmpleado = req.params.idEmpleado
    var parameters = req.body
    var idempresa = req.user.sub

        if (req.user.rol == 'ROL_EMPRESA') {
            Empleados.findOneAndUpdate({ _id: idEmpleado, idEmpresa: idempresa }, parameters, { new: true }, (err, usuarioGuardado) => {
                if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
                if (!usuarioGuardado) return res.status(400).send({ mensaje: 'No se pudo editar al empleado' });
                return res.status(200).send({ empleados: usuarioGuardado });
            })
        } else {
            return res.status(404).send({ message: 'no puede editar si no es una empresa' })
        }

}
function eliminarEmpleados(req, res) {
    var idEmpresa = req.params.idEmpresa
    var verificacion = req.user.rol
    var idempresa = req.user.sub
    if (verificacion == 'ROL_EMPRESA') {
        Empleados.findOneAndDelete({ _id: idEmpresa, idEmpresa: idempresa }, (err, empleadoEliminado) => {
            if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
            if (!empleadoEliminado) return res.status(400).send({ mensaje: 'No se puedo eliminar al empleado' });

            return res.status(200).send({ empleados: empleadoEliminado });
        })

    } else {
        return res.status(404).send({ message: 'no puede eliminar si no es una empresa' })
    }
}
function obtenerEmpleadosId(req, res) {
    var idEmpleado = req.params.idEmpleado
    var verificacion = req.user.rol
    if (verificacion == 'ROL_EMPRESA') {
        Empleados.findById(idEmpleado, (err, empleadorEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!empleadorEncontrado) return res.status(404).send({ mensaje: "Error, no se encuentran empleado" });
            return res.status(200).send({ empleadoEncontrado: empleadorEncontrado })
        }).populate('idEmpresa', 'nombre')
    } else {
        return res.status(500).send({ mensaje: 'no tiene permisos' });
    }
}
function obtenerEmpleadoPorNombre(req, res) {
    var nombreUsuario = req.params.nomUs;
    var verificacion = req.user.rol
    if (verificacion == 'ROL_EMPRESA') {
        Empleados.find({ idEmpresa: req.user.sub, nombre: { $regex: nombreUsuario, $options: ['i', 'x'] } }, (err, usuarioEncontrado) => {
            console.log(err)
            if (err) return res.status(500).send({ message: "Error en la peticion" });
            if (!usuarioEncontrado) return res.status(404).send({ message: "Error, no se encuentran empelados" });
            return res.status(200).send({ empleados: usuarioEncontrado });
        }).populate('idEmpresa', 'nombre')
    } else {
        return res.status(500).send({ mensaje: 'no tiene permisos' });
    }
}

function ObtenerEmpleadosPuesto(req, res) {
    var puestoEmpleado = req.params.puestoEmpleado;
    var verificacion = req.user.rol
    if (verificacion == "ROL_EMPRESA") {
        Empleados.find({idEmpresa: req.user.sub,puesto: { $regex: puestoEmpleado, $options: ['i', 'x'] } }, (err, usuarioEncontrado) => {
            console.log(err)
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!usuarioEncontrado) return res.status(404).send({ message: "Error, no se encuentran empelados" });
            return res.status(200).send({ empleados: usuarioEncontrado });
        }).populate('idEmpresa', 'nombre')
    } else {
        return res.status(500).send({ mensaje: 'no tiene permisos' });
    }
}


function obtenerDepartamento(req, res) {
    var departamento = req.params.departamento;
    var verificacion = req.user.rol
    if (verificacion == "ROL_EMPRESA") {
        Empleados.find({ idEmpresa: req.user.sub, departamento: { $regex: departamento, $options: ['i', 'x'] } }, (err, empleadoEncontrado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!empleadoEncontrado) return res.status(404).send({ mensaje: "Error, no se encuentran empleados con ese puesto" });
            return res.status(200).send({ empleados: empleadoEncontrado });
        }).populate('idEmpresa', 'nombre')
    } else {
        return res.status(500).send({ mensaje: 'No posee permisos para completar la peticion' });
    }
}

function obtenerTodosEmpleados(req, res) {
    var verificacion = req.user.rol
    if (verificacion == "ROL_EMPRESA") {
        Empleados.find( {idEmpresa: req.user.sub},(err, empleadoEncontrado) => {
            for (let i; i < empleadoEncontrado.length;) {
            }
            return res.status(200).send({ empleados: empleadoEncontrado })
        }).populate('idEmpresa', 'nombre')
    } else {
        return res.status(500).send({ mensaje: 'No posee permisos para completar la peticion' });
    }
}


function generarPDF(req, res) {
    var usuario = req.user.sub
    Empleados.find({ idEmpresa: usuario }, (err, empleadoSend) => {
        if (err) return res.status(500)
            .send({ mensaje: 'Error en la peticion de encontrar empleados' });
        const fs = require('fs');
        const Pdfmake = require('pdfmake');
        var fonts = {
            Roboto: {
                normal: './fonts/roboto/Roboto-Regular.ttf',
                bold: './fonts/roboto/Roboto-Medium.ttf',
                italics: './fonts/roboto/Roboto-Italic.ttf',
                bolditalics: './fonts/roboto/Roboto-MediumItalic.ttf'
            }
        };
        let pdf = new Pdfmake(fonts);
        let content = [{
            text: 'DESCRIPCIÓN DE LOS EMPLEADOS', fontSize: 20, alignment: 'center', color: '#FFFFFF',
        }]
        content.push({
            text: ' ',
        })
        content.push({
            text: ' ',
        })
        content.push({
            text: ' ',
        })
     

        for (let i = 0; i < empleadoSend.length; i++) {
            let array = i + 1;
            content.push({
                text: ' ',
            })
            content.push({
                text: ' ',
            })

            content.push({
                text: ' ',
            })

            content.push({
                text: [array + ')Empleado:'] + ' '+ empleadoSend[i].nombre,
            })
            content.push({
                text: 'Puesto:' + ' ' + empleadoSend[i].puesto
            })
            content.push({
                text: 'Departamento:' + ' ' + empleadoSend[i].departamento
            })
            content.push({
                text: 'Nombre de la Empresa: ', alignment: 'center', fontSize: 15, fontFamily: 'Roboto', fontWeight: 'bold'
            })
           
            content.push({
                text: empleadoSend[i].idEmpresa.nombre, alignment: 'center', fontSize: 15, fontFamily: 'Roboto', fontWeight: 'bold'
            })

        }
        content.push({
            text: ' ',
        })
        content.push({
            text: ' ',
        })
        content.push({
            text: 'Total de empleados:' + ' ' + empleadoSend.length, alignment: 'end', color: '#310879', fontSize: 15,
        })


        let docDefinition = {
            content: content,
            background: function () {
                return {
                    canvas: [
                        {
                            type: 'rect',
                            x: 0,
                            y: 0,
                            w: 20,
                            h: 100,
                            color: '#2BA466'
                        },
                        {
                            type: 'rect',
                            x: 579,
                            y: 780,
                            w: 20,
                            h: 51,
                            color: '#6149D6'
                        },
                        {
                            type: 'rect',
                            x: 400,
                            y: 831,
                            w: 300,
                            h: 10,
                            color: '#6149D6'
                        },
                        {
                            type: 'rect',
                            x: 9,
                            y: 0,
                            w: 300,
                            h: 10,
                            color: '#2BA466'
                        },
                        {
                            type: 'rect',
                            x: 137,
                            y: 40,
                            w: 323,
                            h: 27,
                            color: '#093028'
                        }
                    ]

                }
            }
        }

        let documento = pdf.createPdfKitDocument(docDefinition, {});
        documento.pipe(fs.createWriteStream("./src/pdfGenerate/reporteEmpleados.pdf"));
        documento.end();
        return res.status(200)
            .send({ mensaje: 'pdf hecho' });
    }).populate('idEmpresa')
}
function contarEmpleados(req, res) {
    Empleados.count({ idEmpresa: req.user.sub }, (err, empleadoEncontrado) => {
        for (let i = 0; i < empleadoEncontrado.length; i++) {
            console.log(err)
        }
        return res.send({ empleado: empleadoEncontrado })
    })

}


module.exports = {
    agregarEmpleados,
    editarEmpleados,
    eliminarEmpleados,
    obtenerEmpleadosId,
    obtenerEmpleadoPorNombre,
    ObtenerEmpleadosPuesto,
    obtenerDepartamento,
    obtenerTodosEmpleados,
    generarPDF,
    contarEmpleados
}