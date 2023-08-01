const mysql = require('mysql2');
const config = require('../service.json');

var pool = mysql.createPool(config.databaseConnection);

pool.getConnection((err, connection) => {
        if (err) {
            console.error('Not connected to the database:', err.message);
            return;
        }
    
        console.log('MySQL connected successfully...');
    
        // If you're done with the connection, release it back to the pool
        connection.release();
    });

module.exports = pool;
