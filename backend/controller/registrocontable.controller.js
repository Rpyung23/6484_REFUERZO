const RegistrocontableModel = require('../model/registrocontable.model')

class RegistrocontableController {
    static async createRegistroContableController(id_cuenta_bancaria, fecha, descripcion, id_tipo,monto){
        return await RegistrocontableModel.createRegistroContableModel(id_cuenta_bancaria, fecha, descripcion, id_tipo,monto)
    }
    static async readRegistroContableController(cuenta,fecha,fechaF,tipo){
        return await RegistrocontableModel.readRegistroContableModel(cuenta,fecha,fechaF,tipo)
    }
}

module.exports = RegistrocontableController