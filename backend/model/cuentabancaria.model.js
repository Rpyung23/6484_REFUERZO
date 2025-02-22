const connDB = require("../config/conn")
class CuentabancariaModel {
    static async readCuentaBancariaModel(){
        try {
            var conn = await connDB().promise()
            var sql = "select * from cuenta_bancaria as C where C.estado = 1"
            var data = await conn.query(sql)
            await conn.end()
            return data[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }

    static async createCuentaBancariaModel(cuenta,name,tipo,saldo){
        try {
            var conn = await connDB().promise()
            var sql = "insert into cuenta_bancaria(id_cuenta, banco, tipo_cuenta, saldo_inicial) " +
                "values ('"+cuenta+"','"+name+"',"+tipo+","+saldo+")"
            var data = await conn.query(sql)
            await conn.end()
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }
}

module.exports = CuentabancariaModel