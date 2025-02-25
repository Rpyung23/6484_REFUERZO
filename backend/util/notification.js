const nodemailer = require('nodemailer')
const {PlantillaHTMLRec} = require('../util/plantillaHTML')

class Notification
{
    static async sendNotificationEmail(email,pass_r){
        try{
            var transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                //sendmail: true,
                port: 465,
                secure: true,
                auth: {
                    user: 'trailermovil66@gmail.com',
                    pass: 'bqafeugwsetvybpt'
                },
                tls: {
                    rejectUnauthorized: false, // Si necesitas aceptar certificados autofirmados
                },
                //debug: true, // Habilita la depuración
                //logger: true // Muestra los logs
            })
            //console.log(content)
            const info = await transporter.sendMail({
                from: '"GIPAC" <tu_correo@gmail.com>', // sender address
                to: email, // list of receivers
                subject: 'CONTRASEÑA TEMPORAL', // Subject line
                html: PlantillaHTMLRec(pass_r)
            });
            //console.log(info)
            console.log(`NOTIFICATION EMAIL OK : ${email}`)
        }catch (e) {
            console.log(`ERROR SEND EMAIL : ${e.toString()}`)
        }
    }
}

module.exports = Notification