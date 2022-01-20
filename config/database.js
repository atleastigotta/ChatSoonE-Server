const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: '',
    user: '',
    port: '',
    password: '',
    database: ''
});

module.exports = {
    pool: pool
};