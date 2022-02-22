const mysql = require('mysql2');

const con = mysql.createConnection({
    host: "mario.dicyplay.com",
    user: "biblioteca",
    password: "@xXStoCazz0Xx@",
    database: "biblioteca"
});

//con.connect(function (err) {
//    if (err) throw err;
//    console.log("MySQL -> Connected!");
//});

module.exports = {
    con,
    /**
     * @param {mysql} sql
     * @param {array} values
     */
    query: (sql, values = null) => {
        return new Promise((resolve, reject) => {
            con.query(sql, values, function (err, result, fields) {
                if (err) {
                    alert("Errore del database");
                    reject(err);
                    return;
                }
                resolve(result);
            });
        });
    }
}