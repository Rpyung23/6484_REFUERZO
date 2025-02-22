const connDB = require("../config/conn")
class AuditoriaModel {
    static async readAutoriaModel(fecha,usuario){
        try {
            var conn = await connDB().promise()
            var sql = "select * from auditorias_conciliacion as AC"
            var data = await conn.query(sql)
            await conn.end()
            return data[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }
}

module.exports = AuditoriaModel