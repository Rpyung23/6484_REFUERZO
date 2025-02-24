const UsuarioModel = require('../model/usuario.model')
class UsuarioController {
    static async loginUsuarioController(user,pass){
        return await UsuarioModel.loginUsuarioModel(user,pass)
    }

    static async readUsuariosController(){
        return await UsuarioModel.readUsuariosModel()
    }
}

module.exports = UsuarioController