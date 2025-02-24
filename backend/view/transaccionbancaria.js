const TransaccionbancariaController = require('../controller/transaccionbancaria.controller')
const Jwt = require('../config/jwt')
const express = require('express')
const app = express()

app.put('/delete_transaccion_bancaria/:id', async function(req,res)
{
    try{
        var result = await TransaccionbancariaController
            .deleteTransaccionBancariaController(req.params.id)
        res.status(200).json({status_code:result ? 200 : 300})
    }catch (e) {
        console.log(e)
        res.status(200).json({status_code: 300})
    }
})

app.post('/create_transaccion_bancaria',Jwt.ensureToken, async function(req,res)
{
    try{
        var result = await TransaccionbancariaController
            .createTransaccionBancariaController(req.body.comprobante,req.body.id_cuenta, req.body.fecha,
                req.body.monto, req.body.tipo_transaccion, req.body.referencia)
        res.status(200).json({status_code:result ? 200 : 300})
    }catch (e) {
        console.log(e)
        res.status(200).json({status_code: 300})
    }
})

app.get('/transaccion_bancaria/:cuenta/:fecha',async function(req,res){
    try{
        var response = await TransaccionbancariaController
            .readTransaccionBancariaController(req.params.cuenta,req.params.fecha)
        res.status(200).json(response)
    }catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})

module.exports = app