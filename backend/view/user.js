const Jwt = require('../config/jwt')
const UsuarioController = require('../controller/usuario.controller')
const express = require('express')
const app = express()

app.post('/login',async function(req,res)
{
    console.log("API LOGIN")
    var response = await UsuarioController.loginUsuarioController(req.body.user,req.body.pass)
    res.status(200).json({status_code:response == null ? 300 : 200,
    token:Jwt.createToken(response.id_usuario),nombre:response.nombre,email:response.email})
})

module.exports = app