const mysql = require("mysql2");

let connDB = () =>
{

    return  mysql.createConnection({
        //host: "66.240.205.86",
        host: "localhost",
        user: "root",
        database: "consiliacion",
        //password: "Pum@1500123",
        password: "",
        port: 3306
    });

}

module.exports = connDB