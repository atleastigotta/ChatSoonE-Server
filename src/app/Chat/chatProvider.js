const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const chatDao = require("./chatDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveChatList = async function (userIdx) {

  if (!userIdx) {
    // connection 은 db와의 연결을 도와줌
    const connection = await pool.getConnection(async (conn) => conn);
    // Dao 쿼리문의 결과를 호출
    const chatListResult = await chatDao.selectChatList(connection, userIdx);
    // connection 해제
    connection.release();

    return chatListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const chatListResult = await chatDao.selectchatEmail(connection, email);
    connection.release();

    return chatListResult;
  }
};

exports.retrievechat = async function (chatId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatResult = await chatDao.selectchatId(connection, chatId);

  connection.release();

  return chatResult[0]; // 한 명의 유저 정보만을 불러오므로 배열 타입을 리턴하는 게 아닌 0번 인덱스를 파싱해서 오브젝트 타입 리턴
};

exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await chatDao.selectchatEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

exports.passwordCheck = async function (selectchatPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  // 쿼리문에 여러개의 인자를 전달할 때 selectchatPasswordParams와 같이 사용합니다.
  const passwordCheckResult = await chatDao.selectchatPassword(
      connection,
      selectchatPasswordParams
  );
  connection.release();
  return passwordCheckResult[0];
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatAccountResult = await chatDao.selectchatAccount(connection, email);
  connection.release();

  return chatAccountResult;
};