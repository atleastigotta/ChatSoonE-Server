const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const chatDao = require("./chatDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveChatList = async function (userIdx) {
  // connection 은 db와의 연결을 도와줌
  const connection = await pool.getConnection(async (conn) => conn);
  // Dao 쿼리문의 결과를 호출
  const chatListResult = await chatDao.selectChatList(connection, userIdx);
  // connection 해제
  connection.release();

  return chatListResult;
};

exports.retrievePersonalChats = async function (userIdx, otherUserIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatResult = await chatDao.selectPersonalChats(connection, userIdx, otherUserIdx);

  connection.release();

  return chatResult;
};

exports.retrieveGroupChats = async function (userIdx, groupName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatResult = await chatDao.selectGroupChats(connection, userIdx, groupName);

  connection.release();

  return chatResult;
};

exports.retrieveFolderChats = async function (userIdx, folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatResult = await chatDao.selectFolderChats(connection, userIdx, folderIdx);

  connection.release();

  return chatResult;
};

exports.chatCheck = async function (chatIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatCheckResult = await chatDao.selectChat(connection, chatIdx);
  connection.release();
  // console.log(chatCheckResult);

  return chatCheckResult;
};

exports.chatUserCheck = async function (userIdx, otherUserIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatCheckResult = await chatDao.selectUserChat(connection, userIdx, otherUserIdx);
  connection.release();
  // console.log(chatCheckResult);

  return chatCheckResult;
};

exports.chatGroupCheck = async function (userIdx, groupName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatCheckResult = await chatDao.selectGroupChat(connection, userIdx, groupName);
  connection.release();
  // console.log(chatCheckResult);

  return chatCheckResult;
};

exports.chatDeleteCheck = async function (chatIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatDeleteCheckResult = await chatDao.selectDeleteChat(connection, chatIdx);
  connection.release();
  // console.log(chatDeleteCheckResult);

  return chatDeleteCheckResult;
};

exports.newUserCheck = async function (userIdx, nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  // 새로운 채팅 상대인가
  const newUserCheckResult = await chatDao.selectExistingUser(connection, userIdx, nickname);

  connection.release();

  return newUserCheckResult;
};

exports.userBlockCheck = async function (userIdx, otherUserIdx, groupName) {
  const connection = await pool.getConnection(async (conn) => conn);
  let userBlockResult;
  if(!groupName)
    // 갠톡일 경우
    userBlockResult = await chatDao.selectBlockedUser(connection, userIdx, otherUserIdx);
  else
    // 단톡일 경우
    userBlockResult = await chatDao.selectBlockedChat(connection, userIdx, groupName);
  connection.release();

  return userBlockResult;
};

exports.chatFolderCheck = async function (chatIdx, folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatCheckResult = await chatDao.selectFolderChat(connection, chatIdx, folderIdx);
  connection.release();
  // console.log(chatCheckResult);

  return chatCheckResult;
};

// exports.postTimeCheck = async function (userIdx, otherUserIdx, groupName, postTime) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   let postTimeCheckResult;
//   if(!groupName)
//       // 갠톡일 경우
//     postTimeCheckResult = await chatDao.selectPostTimeUser(connection, userIdx, otherUserIdx);
//   else
//       // 단톡일 경우
//     postTimeCheckResult = await chatDao.selectPostTimeGroup(connection, userIdx, groupName);
//   connection.release();
//
//   return postTimeCheckResult;
// };
