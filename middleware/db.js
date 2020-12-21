const mysql = require('mysql')

const conhost = 'localhost'
const conuser = 'root'
const conpassword = ''
const condatabase = 'croonus_project_store'

const connection = mysql.createConnection({
    host: conhost,
    user: conuser,
    password: conpassword,
    database: condatabase,
    multipleStatements: true
});

connection.connect((error) => {
    if (error) {
        throw Error(error)
    }
    console.log(`MySql connected { Database: ${condatabase} }`)
})

module.exports = connection