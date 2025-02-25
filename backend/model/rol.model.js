const connDB = require("../config/conn")
class RolModel {
    static async readRolModel(){
        try{
            var conn = await connDB().promise()
            var sql = "select * from rol where estado = 1"
            var response = await conn.query(sql)
            await conn.end()
            return response[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }
}


module.exports = RolModel