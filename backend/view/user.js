const Jwt = require('../config/jwt')
const UsuarioController = require('../controller/usuario.controller')
const express = require('express')
const app = express()
const Notification = require('../util/notification')
app.post('/login',async function(req,res)
{
    try{
        console.log("API LOGIN")
        var response = await UsuarioController.loginUsuarioController(req.body.user,req.body.pass)
        console.log(response)
        res.status(200).json({status_code:response == null ? 300 : 200,
            token:Jwt.createToken(response.id_usuario),nombre:response.nombre,email:response.email,estado:response.estado,rol:response.fk_id_rol})
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

app.post('/createUsuario',async function(req,res)
{
    try {
        var response = await UsuarioController.createUserController(req.body.usuario,
            req.body.nombre, req.body.id_rol, req.body.pass, req.body.cel)

        res.status(200).json({status_code: response ? 200 : 300})
    }catch (e) {
        res.status(200).json({status_code: 300})
    }
})

app.post('/deleteUsuario',async function(req,res)
{
    try {
        var response = await UsuarioController.deleteUsuarioController(req.body.usuario)

        res.status(200).json({status_code: response})
    }catch (e) {
        res.status(200).json({status_code: 300})
    }
})

app.get('/isExistEmail/:email',async function(req,res){
    try{
        var data = await UsuarioController.isExistEmailController(req.params.email)
        console.log(data)
        res.status(200).json({status_code: data == false ? 300 : 200})
    }catch (e) {
        res.status(200).json({status_code:500,msm:e.toString()})
    }
})


app.post('/recovery_pass',async function(req,res){
    try{
        var result = await UsuarioController.recoveryPassClienteController(req.body.email)
        console.log("RESULT : "+result)
        if(result != null){
            await Notification.sendNotificationEmail(req.body.email,result);
        }
        res.status(result == null ? 500 : 200).json({pass:result == null ? 'S/N' : result})
    }catch (e) {
        console.log(e)
        res.status(500).json({msm:e.toString()})
    }
})


app.put('/update_pass',Jwt.ensureToken,async function(req,res)
{
    try {
        console.log(req.body)
        var data = await UsuarioController.updatePassController(req.body.data.id_usuario, req.body.contrasenia)

        res.status(200).json({
            status_code: data ? 200 : 300,
            msm: data ? 'Contraseña actualizado con éxito' : 'No se ha podido actualizar la contraseña'
        })

    }catch (e) {
        console.log(e)
        res.status(200).json({
            status_code:400,
            msm:e.toString()
        })
    }
})

module.exports = app