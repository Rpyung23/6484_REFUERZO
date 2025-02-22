const TransaccionbancariaModel = require('../model/transaccionbancaria.model')
class TransaccionbancariaController {
    static async createTransaccionBancariaController(id_cuenta, fecha, monto, tipo_transaccion, referencia){
        return await TransaccionbancariaModel.createTransaccionBancariaModel(id_cuenta, fecha, monto, tipo_transaccion, referencia)
    }
}

module.exports = TransaccionbancariaController