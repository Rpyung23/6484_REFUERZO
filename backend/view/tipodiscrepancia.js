const TipodiscrepanciaController = require('../controller/tipodiscrepancia.controller')
const express = require('express')
const app = express()

app.get('/tipo_discrepancia',async function(req,res){
    try {
        var response = await TipodiscrepanciaController.readTipodiscrepanciaController()
        res.status(200).json(response)
    }catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})

module.exports = app