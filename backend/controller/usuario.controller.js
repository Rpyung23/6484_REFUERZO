const UsuarioModel = require('../model/usuario.model')
class UsuarioController {
    static async loginUsuarioController(user,pass){
        return await UsuarioModel.loginUsuarioModel(user,pass)
    }

    static async readUsuariosController(){
        return await UsuarioModel.readUsuariosModel()
    }

    static async createUserController(usuario, nombre, id_rol, pass,cel){
        return await UsuarioModel.createUserModel(usuario, nombre, id_rol, pass,cel)
    }

    static async deleteUsuarioController(usuario){
        return await UsuarioModel.deleteUsuarioModel(usuario)
    }

    static async isExistEmailController(user){
        return await UsuarioModel.isExistEmailModel(user)
    }

    static async recoveryPassClienteController(email){
        return await UsuarioModel.recoveryPassClienteModel(email)
    }

    static async updatePassController(user,pass){
        return await UsuarioModel.updatePassModel(user,pass)
    }
}

module.exports = UsuarioController