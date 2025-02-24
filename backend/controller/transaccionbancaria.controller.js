const TransaccionbancariaModel = require('../model/transaccionbancaria.model')
class TransaccionbancariaController {

    static async deleteTransaccionBancariaController(id){
        return await TransaccionbancariaModel.deleteTransaccionBancariaModel(id)
    }

    static async createTransaccionBancariaController(comprobante,id_cuenta, fecha, monto, tipo_transaccion, referencia){
        return await TransaccionbancariaModel.createTransaccionBancariaModel(comprobante,id_cuenta, fecha, monto, tipo_transaccion, referencia)
    }

    static async readTransaccionBancariaController(cuenta,fecha){
        return await TransaccionbancariaModel.readTransaccionBancariaModel(cuenta,fecha)
    }
}

module.exports = TransaccionbancariaController