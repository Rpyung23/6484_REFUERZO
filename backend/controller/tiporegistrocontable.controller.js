const TiporegistrocontableModel = require('../model/tiporegistrocontable.model')

class TiporegistrocontableController {
    static async readTiporegistrobancarioController(){
        return await TiporegistrocontableModel.readTiporegistrobancarioModel()
    }
}

module.exports = TiporegistrocontableController