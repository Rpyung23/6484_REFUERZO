const TipotransaccionModel = require('../model/tipotransaccion.model');
class TipotransaccionController {
    static async readTipoTransaccionController(){
        return await TipotransaccionModel.readTipoTransaccionModel()
    }
}

module.exports = TipotransaccionController