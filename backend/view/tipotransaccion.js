const express = require('express')
const app = express()
const TipotransaccionController = require('../controller/tipotransaccion.controller')
app.get('/tipo_transaccion',async function(req,res)
{
    try {
        var response = await TipotransaccionController.readTipoTransaccionController()
        res.status(200).json(response)
    }catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})

module.exports = app