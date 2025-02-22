const RegistrocontableController = require('../controller/registrocontable.controller')
const express = require('express')
const app = express()
const Jwt = require('../config/jwt')
app.post('/create_registro_contable',Jwt.ensureToken,async function(req,res)
{
    try {
        var response = await RegistrocontableController
            .createRegistroContableController(req.body.id_cuenta_bancaria, req.body.fecha,
                req.body.descripcion, req.body.id_tipo,req.body.monto)
        res.status(200).json({status_code: response ? 200 : 300})
    }catch (e) {
        console.log(e)
        res.status(200).json({status_code:300})
    }
})

app.post('/read_registro_contable',async function(req,res)
{
    try {
        var response = await RegistrocontableController
            .readRegistroContableController(req.body.cuenta,req.body.fecha,req.body.fechaF,req.body.tipo)
        res.status(200).json(response)
    }catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})



module.exports = app