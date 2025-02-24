const Jwt = require('../config/jwt')
const UsuarioController = require('../controller/usuario.controller')
const express = require('express')
const app = express()

app.post('/login',async function(req,res)
{
    try{
        console.log("API LOGIN")
        var response = await UsuarioController.loginUsuarioController(req.body.user,req.body.pass)
        console.log(response)
        res.status(200).json({status_code:response == null ? 300 : 200,
            token:Jwt.createToken(response.id_usuario),nombre:response.nombre,email:response.email})
    }catch (e) {
        res.status(200).json({status_code:300})
    }
})

app.get('/usuarios',Jwt.ensureToken,async function(req,res){
    try {
        var response = await UsuarioController.readUsuariosController()
        res.status(200).json(response)
    }catch (e) {
        res.status(200).json([])
    }
})


module.exports = app