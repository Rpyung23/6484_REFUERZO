require('./config/port')
const user = require('./view/user')
const cuenta = require('./view/cuenta')
const tipotransaccion = require('./view/tipotransaccion')
const transaccionbancaria = require('./view/transaccionbancaria')
const tiporegistrocontable = require('./view/tiporegistrocontable')
const registrocontable = require('./view/registrocontable')
const tipodiscrepancia = require('./view/tipodiscrepancia')
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express')
const app = express()



app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(user)
app.use(cuenta)
app.use(tipotransaccion)
app.use(transaccionbancaria)
app.use(tiporegistrocontable)
app.use(registrocontable)
app.use(tipodiscrepancia)


app.listen(process.env.PORT,function (){
    console.log("SERVER API "+process.env.PORT)
})