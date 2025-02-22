const CuentabancariaModel = require('../model/cuentabancaria.model')
class CuentabancariaController {
    static async readCuentaBancariaController(){
        return await CuentabancariaModel.readCuentaBancariaModel()
    }
}

module.exports = CuentabancariaController