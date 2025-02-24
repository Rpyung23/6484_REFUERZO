const express = require('express')
const app = express()
const {phoneNumer} = require('../util/string')
const axios = require("axios");
require('dotenv').config()

app.post('/notification',async function(req,res)
{
    try {
        //var otp_list = await OtpController.readAllOtpController()
        //console.log("OTP LISTA ..............")
        var number_phone = phoneNumer('0979054071')

        if(number_phone == null){
            res.status(500).json({msm:"No se ha podido crear el codigo otp"})
        }else{
            var tokenSMS = await axios.post(process.env.URL_OTP_SMS+"/token",{
                client_id:process.env.OTP_CLIENT_ID_SMS,
                client_secret:process.env.OTP_CLIENT_SECRET,
                grant_type:process.env.OTP_GRANT_TYPE
            })

            var access_token_sms = tokenSMS.data.access_token

            var code_otp = 'Holis desde api SMS'

            if(code_otp == null){
                res.status(500).json({msm:"No se ha podido crear el codigo otp"})
            }else{

                var response_sms = await axios.post(process.env.URL_OTP_SMS+"/messages/send",
                    {
                        to_number: number_phone,
                        content:`${process.env.NAMECOOP_CORTO}: tu código de seguridad es ${code_otp}, gracias por nuestros servicios. Válido por 60 segundos.`
                    },    {
                        headers: {
                            Authorization: `Bearer ${access_token_sms}` // Asegúrate de reemplazar process.env.TOKEN con tu token real
                        }
                    })
                //console.log(response_sms.data)
                if(response_sms.data.error == false && response_sms.data.status == 200){
                    res.status(200).json({otp:code_otp.toString()})
                }else{
                    res.status(500).json({msm:"No se ha podido crear el codigo otp"})
                }
            }

        }
    }catch (e) {
        console.log(e)
        res.status(500).json({msm:"No se ha podido crear el codigo otp"})
    }

})

module.exports = app