const CuentabancariaModel = require('../model/cuentabancaria.model')
class CuentabancariaController {
    static async readCuentaBancariaController(){
        return await CuentabancariaModel.readCuentaBancariaModel()
    }

    static async createCuentaBancariaController(cuenta,name,tipo,saldo){
        return await CuentabancariaModel.createCuentaBancariaModel(cuenta,name,tipo,saldo)
    }
}

module.exports = CuentabancariaController