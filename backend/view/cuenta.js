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

module.exports = app