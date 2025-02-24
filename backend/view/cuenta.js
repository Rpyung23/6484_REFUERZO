const CuentabancariaController = require('../controller/cuentabancaria.controller')
const express = require('express')
const app = express()
const Jwt = require('../config/jwt')

app.get('/cuenta_bancaria',Jwt.ensureToken,async function(req,res)
{
    try{
        var response = await CuentabancariaController.readCuentaBancariaController()
        res.status(200).json(response)
    }catch (e) {
        res.status(200).json([])
    }
})


app.post('/cuenta_bancaria',Jwt.ensureToken,async function(req,res)
{
    try{
        var response = await CuentabancariaController.createCuentaBancariaController(req.body.cuenta,
            req.body.name,req.body.tipo,req.body.saldo)
        res.status(200).json({status_code: response ? 200 : 300})
    }catch (e) {
        res.status(200).json({status_code: 300})
    }
})

module.exports = app