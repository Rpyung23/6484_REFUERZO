const connDB = require("../config/conn")
class TransaccionbancariaModel {
    static async readTransaccionBancaria(cuenta,fecha){
        try {
            var sqlCuenta = ""
            var sqlFecha = ""
            if(cuenta != '' || cuenta != undefined){
                sqlCuenta = " and TB.fk_id_cuenta = '"+cuenta+"' "
            }

            if(fecha != '' || fecha != undefined){
                sqlFecha = " and date(TB.fecha) = '"+fecha+"' "
            }
            var conn = await connDB().promise()
            var sql = "select * from transacciones_bancarias TB where TB.estado = 1 "+sqlCuenta+" "+sqlFecha
            var data = await conn.query(sql)
            await conn.end()
            return data
        }catch (e) {
            console.log(e)
            return []
        }
    }

    static async createTransaccionBancariaModel(id_cuenta, fecha, monto, tipo_transaccion, referencia){
        try{
            var conn = await connDB().promise()
            var sql = "insert into transacciones_bancarias(fk_id_cuenta, fecha, monto, fk_tipo_transaccion, referencia) VALUES ('"+id_cuenta+"','"+fecha+"',"+monto+","+tipo_transaccion+",'"+referencia+"')"
            await conn.query(sql)
            await conn.end()
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }
}

module.exports = TransaccionbancariaModel