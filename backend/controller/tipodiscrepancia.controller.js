const TipodiscrepanciaModel = require('../model/tipodiscrepancia.model')

class TipodiscrepanciaController {
    static async readTipodiscrepanciaController(){
        return await TipodiscrepanciaModel.readTipodiscrepanciaModel()
    }
}

module.exports = TipodiscrepanciaController