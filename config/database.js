const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'chatsoone-database.cohhixagmi9f.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    port: '3306',
    password: 'chatsoone123',
    database: 'ChatSoonE_RDS_database'
});

module.exports = {
    pool: pool
};