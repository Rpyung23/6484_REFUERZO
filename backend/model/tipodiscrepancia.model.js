const connDB = require("../config/conn")
class TipodiscrepanciaModel {
    static async readTipodiscrepanciaModel(){
        try {
            var conn = await connDB().promise()
            var sql = "select * from tipo_discrepancia as TD where TD.estado = 1"
            console.log(sql)
            var data = await conn.query(sql)
            await conn.end()
            return data[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }
}

module.exports = TipodiscrepanciaModel