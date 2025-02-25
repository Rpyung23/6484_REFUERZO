const RolController = require('../controller/rol.controller')
const express = require('express')
const app = express()

app.get('/rol',async function(req,res)
{
    try {
        var response = await RolController.readRolController()
        res.status(200).json(response)
    }catch (e) {
        console.log(e)
        res.status(200).json([])
    }
})



module.exports = app