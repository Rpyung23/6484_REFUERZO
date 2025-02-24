const connDB = require("../config/conn")


class UsuarioModel {
    static async readUsuariosModel(){
        try{
            var conn = await connDB().promise()
            var sql = "select * from usuario inner join rol r on usuario.fk_id_rol = r.id_rol"
            var data = await conn.query(sql)
            await conn.end()
            return data[0]
        }catch (e) {
            console.log(e)
            return []
        }
    }
    static async loginUsuarioModel(user,pass){
        try {
            var conn = await connDB().promise()
            var sql = "select * from usuario as U where U.estado = 1 and U.id_usuario = '"+user+"' and U.pass = MD5('"+pass+"')"
            console.log(sql)
            var data = await conn.query(sql)
            await conn.end()
            return data[0][0]
        }catch (e) {
            console.log(e)
            return null
        }
    }
}

module.exports = UsuarioModel