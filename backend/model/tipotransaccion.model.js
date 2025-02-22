const connDB = require("../config/conn")
class TipotransaccionModel {
    static async readTipoTransaccionModel(){
        try {
            var conn = await connDB().promise()
            var sql = "select * from tipo_transaccion as TT where TT.estado = 1"
            var data = await conn.query(sql)
            await conn.end()
            return data[0]
        }catch (e) {
            console.log(e)
            return  []
        }
    }
}

module.exports = TipotransaccionModel