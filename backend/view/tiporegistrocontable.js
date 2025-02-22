const express = require('express')
const app = express()
const TiporegistrocontableController = require('../controller/tiporegistrocontable.controller')

app.get('/tiporegistrocontable',async function(req,res)
{
    try{
        var data = await TiporegistrocontableController.readTiporegistrobancarioController()
        res.status(200).json(data)
    }catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})


module.exports = app