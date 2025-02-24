const connDB = require("../config/conn")
class TransaccionbancariaModel {

    static async deleteTransaccionBancariaModel(id){
        try{
            var conn = await connDB().promise()
            var sql = "delete from transacciones_bancarias where id_transaccion = '"+id+"'"
            await conn.query(sql)
            await conn.end()
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }

    static async readTransaccionBancariaModel(cuenta,fecha){
        try {
            var sqlCuenta = ""
            var sqlFecha = ""
            if(cuenta != '*'){
                sqlCuenta = " and TB.fk_id_cuenta = '"+cuenta+"' "
            }

            if(fecha != '*'){
                sqlFecha = " and date(TB.fecha) = '"+fecha+"' "
            }
            var conn = await connDB().promise()
            var sql = "select id_transaccion,fk_tipo_transaccion,fk_id_cuenta,monto,referencia,convert(date(fecha),char(50)) fecha from transacciones_bancarias TB where TB.estado = 1 "+sqlCuenta+" "+sqlFecha
            console.log(sql)
            var data = await conn.query(sql)
            await conn.end()
            return data[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }

    static async createTransaccionBancariaModel(comprobante,id_cuenta, fecha, monto, tipo_transaccion, referencia){
        try{
            var conn = await connDB().promise()
            var sql = "insert into transacciones_bancarias(id_transaccion,fk_id_cuenta, fecha, monto, fk_tipo_transaccion, referencia) " +
                "VALUES ('"+comprobante+"','"+id_cuenta+"','"+fecha+"',"+monto+","+tipo_transaccion+",'"+referencia+"')"
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