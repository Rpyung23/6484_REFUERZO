const ConciliacionController = require('../controller/conciliacion.controller')
const express = require('express')
const app = express()
const Jwt = require('../config/jwt')

app.get('/readConciliacion/:cuenta',Jwt.ensureToken,async function(req,res){
    try{
        var response = await ConciliacionController.readConciliacionController(req.params.cuenta)
        res.status(200).json(response)
    }catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})

app.get('/readConciliacionDetalle/:id',async function(req,res){
    try{
        var response = await ConciliacionController.readDetalleConcoliacionController(req.params.id)
        res.status(200).json(response)
    }catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})

app.post('/actualizarDetalleConciliacion',async function(req,res)
{
    console.log(req.body)
    try{
        var response = await ConciliacionController
            .actualizarDetalleConciliacionController(req.body.id_contable,req.body.id_conciliacion,req.body.id_transaccion)
        res.status(200).json({status_code: response})
    }catch (e) {
        console.log(e)
        res.status(200).json({status_code:300})
    }
})

app.put('/actualizarEstadoConciliacion/:id_conciliacion/:estado',async function(req,res)
{
    console.log("actualizarEstadoConciliacion")
    try{
        var response = await ConciliacionController
            .aprobar_revisionConciliacionController(req.params.id_conciliacion,req.params.estado)
        res.status(200).json({status_code: response ? 200 : 300})
    }catch (e) {
        console.log(e)
        res.status(200).json({status_code:300})
    }
})


app.post('/createConciliacion',Jwt.ensureToken,async function(req,res)
{
    console.log(req.body)
    try{
        var response = await ConciliacionController
            .createConciliacionController(req.body.id_cuenta,req.body.name_conciliacion, req.body.data.id_usuario,
                req.body.fechaI,req.body.fechaF)
        res.status(200).json({status_code: response ? 200 : 300})
    }catch (e) {
        console.log(e)
        res.status(200).json({status_code:300})
    }
})


app.delete('/deleteConciliacion',async function(req,res)
{
    console.log(req.body)
    try{
        var response = await ConciliacionController
            .deleteConciliacionController(req.body.id_conciliacion)
        res.status(200).json({status_code: response ? 200 : 300})
    }catch (e) {
        console.log(e)
        res.status(200).json({status_code:300})
    }
})

module.exports = app