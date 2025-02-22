const TransaccionbancariaController = require('../controller/transaccionbancaria.controller')
const Jwt = require('../config/jwt')
const express = require('express')
const app = express()

app.post('/create_transaccion_bancaria',Jwt.ensureToken, async function(req,res)
{
    try{
        var result = await TransaccionbancariaController
            .createTransaccionBancariaController(req.body.id_cuenta, req.body.fecha,
                req.body.monto, req.body.tipo_transaccion, req.body.referencia)
        res.status(200).json({status_code:result ? 200 : 300})
    }catch (e) {
        console.log(e)
        res.status(200).json({status_code: 300})
    }
})

module.exports = app