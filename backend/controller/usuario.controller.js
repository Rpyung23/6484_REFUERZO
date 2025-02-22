const UsuarioModel = require('../model/usuario.model')
class UsuarioController {
    static async loginUsuarioController(user,pass){
        return await UsuarioModel.loginUsuarioModel(user,pass)
    }
}

module.exports = UsuarioController