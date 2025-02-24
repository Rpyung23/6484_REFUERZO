const connDB = require("../config/conn")
class RegistrocontableModel {
    static async readRegistroContableModel(cuenta,fecha,fechaF,tipo)
    {
        try {
            var sqlCuenta = ''
            var sqlFecha = ''
            var sqlTipo = ''
            if(cuenta != '*'){
                sqlCuenta = " and RC.fk_id_cuenta_bancaria = '"+cuenta+"' "
            }

            if(fecha != '*' && fechaF != '*'){
                sqlFecha = " and date(RC.fecha) = '"+fecha+"' between '"+fechaF+"' "
            }

            if(tipo != '*'){
                sqlTipo = " and RC.fk_id_tipo =  "+tipo
            }

            var conn = connDB().promise()
            var sql = "select RC.descripcion,RC.id_registros_contables,RC.fk_id_cuenta_bancaria,convert(date(RC.fecha),char(50)) fecha," +
                "RC.descripcion,RC.monto,RC.fk_id_tipo from registros_contables as RC where RC.monto > 0 "+sqlCuenta+sqlFecha+sqlTipo
            console.log(sql)
            var data = await conn.query(sql)
            await conn.end()
            return data[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }

    static async createRegistroContableModel(id_cuenta_bancaria, fecha, descripcion, id_tipo,monto){
        try {
            var conn = await connDB().promise()
            await conn.beginTransaction()
            var sql = "insert into registros_contables(fk_id_cuenta_bancaria, fecha, descripcion, fk_id_tipo,monto) " +
                "VALUES ("+id_cuenta_bancaria+",'"+fecha+"','"+descripcion+"',"+id_tipo+","+monto+")"
            console.log(sql)
            await conn.query(sql)
            await conn.commit()
            await conn.end()
            return true
        }catch (e) {
            console.log(e)
            if(conn){
                await conn.rollback()
                await conn.end()
            }
            return false
        }
    }
}

module.exports = RegistrocontableModel