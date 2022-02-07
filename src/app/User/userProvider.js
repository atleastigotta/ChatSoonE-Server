const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리
exports.userCheck = async function (userIdx) {
    const connection = await pool.getConnection(async (conn) => conn);
    // 이미 존재하는 회원인가
    const existingUserCheckResult = await userDao.selectKakaoUser(connection, userIdx);

    connection.release();

    return existingUserCheckResult;
};
