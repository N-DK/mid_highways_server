var mysql = require('mysql');

var con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '271103',
    database: 'mid_server',
    port: 3306,
});

async function connect() {
    try {
        await con.connect();
        console.log('Connected to MySQL');
    } catch (error) {
        console.error('Error during DB connection', error);
        process.exit(1);
    }
}

module.exports = { connect, con };
