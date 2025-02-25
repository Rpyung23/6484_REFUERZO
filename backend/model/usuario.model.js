const connDB = require("../config/conn")


class UsuarioModel {
    static async readUsuariosModel(){
        try{
            var conn = await connDB().promise()
            var sql = "select * from usuario as U inner join rol r on U.fk_id_rol = r.id_rol where U.estado = 1"
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
            var sql = "select * from usuario as U where U.estado != 0 and U.id_usuario = '"+user+"' and U.pass = MD5('"+pass+"')"
            console.log(sql)
            var data = await conn.query(sql)
            await conn.end()
            return data[0][0]
        }catch (e) {
            console.log(e)
            return null
        }
    }
    static async createUserModel(usuario, nombre, id_rol, pass,cel)
    {
        try{
            var conn  = await connDB().promise()
            var sql = "insert into usuario(id_usuario, nombre, fk_id_rol, pass,cel) " +
                "VALUES ('"+usuario+"','"+nombre+"',"+id_rol+",MD5('"+pass+"'),'"+cel+"')"
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
        }
        return false

    }

    static async deleteUsuarioModel(usuario){
        try{
            var conn = await connDB().promise()
            var sql = "call deleteUsuario('"+usuario+"')"
            console.log(sql)
            var response = await conn.query(sql)
            await conn.end()
            return response[0][0][0].estado
        }catch (e) {
            console.log(e)
            return 300
        }
    }


    static async isExistEmailModel(user){
        try {
            var conn = await connDB().promise()
            var sql = "select count(*) isExist from usuario as U where U.estado = 1 and U.id_usuario = '"+user+"'"
            var data = await conn.query(sql)
            await conn.end()
            return data[0][0].isExist >= 1 ? true : false
        }catch (e) {
            console.log(e)
            return false
        }
    }


    static async recoveryPassClienteModel(email){
        try {
            var conn = await connDB().promise()
            var sql = "call actualizar_contrasena('"+email+"')"
            //console.log(sql)
            var data = await conn.query(sql)
            //console.log(sql)
            await conn.end()
            //console.log(data[0][0][0].estado)
            return data[0][0][0].estado
        }catch (e) {
            console.log(e)
            return null
        }
    }


    static async updatePassModel(user,pass){
        try {
            var conn = await connDB().promise()
            var sql= "update usuario set pass = MD5('"+pass+"'),estado = 1 where id_usuario = '"+user+"'"
            console.log(sql)
            await conn.query(sql)
            await conn.end()
            return true
        }catch (e) {
            console.log(e)
            return false
        }
    }

}

module.exports = UsuarioModel