const connDB = require("../config/conn")
class TiporegistrocontableModel {
    static async readTiporegistrobancarioModel(){
        try {
            var conn = await connDB().promise()
            var sql = "select * from tipo_registro_contable as TRC where TRC.estado = 1"
            var data = await conn.query(sql)
            await conn.end()
            return data[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }
}

module.exports = TiporegistrocontableModel