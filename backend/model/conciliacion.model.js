const connDB = require("../config/conn")

class ConciliacionModel {
    static async readConciliacionModel(){
        try{
            var conn = await connDB().promise()
            var sql = "select *,C.estado estado_c,concat(date(fechaI),' - ',date(fechaF)) rangoFecha," +
                "convert(date(fecha_conciliacion),char(50))  fecha_conciliacion_string,U.nombre from conciliaciones as C " +
                "inner join usuario as U on C.fk_usuario = U.id_usuario where C.estado != 0;"
            var response = await conn.query(sql)
            await conn.end()
            return response[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }

    static async readDetalleConcoliacionModel(id_conciliacion){
        try{
            var conn = await connDB().promise()
            var sql = "select DC.fk_id_conciliacion,fk_registros_contables,DC.id_detalles_conciliacion,TB.id_transaccion,RC.monto monto_contable," +
                "TB.monto as monto_bancario,DC.monto_discrepante,RC.estado\n" +
                "       from detalles_conciliacion as DC inner join registros_contables as RC\n" +
                "       on RC.id_registros_contables = DC.fk_registros_contables\n" +
                "       left join transacciones_bancarias as TB on DC.fk_transacciones_bancarias\n" +
                "       = TB.id_transaccion where DC.estado = 1 and DC.fk_id_conciliacion = "+id_conciliacion
            console.log(sql)
            var response = await conn.query(sql)
            await conn.end()
            return response[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }

    static async aprobar_revisionConciliacionModel(id_conciliacion,estado){
        try {
            var conn = await connDB().promise()
            var sql = "update conciliaciones set estado = "+estado+" where id_conciliaciones = "+id_conciliacion
            console.log(sql)
            await conn.query(sql)
            await conn.end()
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }

    static async actualizarDetalleConciliacionModel(id_contable,id_conciliacion,id_transaccion){
        try{
            var conn = await connDB().promise()
            var sql = "call actualizar_detalle_conciliacion("+id_contable+","+id_conciliacion+",'"+id_transaccion+"')"
            console.log(sql)
            var response = await conn.query(sql)
            await conn.end()
            console.log(response[0][0][0])
            return response[0][0][0].estado
        }catch (e) {
            console.log(e)
            return 300
        }
    }

    static async createConciliacionModel(id_cuenta,name_conciliacion, usuario,fechaI,fechaF)
    {
        try {
            var conn = await connDB().promise()
            var sql = "insert into conciliaciones(fk_id_cuenta,name_conciliacion, fecha_conciliacion, fk_usuario,estado,fechaI,fechaF) " +
                " VALUES ('852369741','test consiliacion 1',now(),'admin',1,'"+fechaI+"','"+fechaF+"')"
            var response = await conn.query(sql)
            await conn.end()
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }
    static async deleteConciliacionModel(id_conciliacion){
        try{
            var conn  = await connDB().promise()
            var sql = "update conciliaciones set estado = 0 where id_conciliaciones = "+id_conciliacion
            await conn.query(sql)
            await conn.end()
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }
}

module.exports = ConciliacionModel