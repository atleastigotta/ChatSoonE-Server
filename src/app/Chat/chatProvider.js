const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");
const {response, errResponse} = require("../../../config/response");
const baseResponse = require("../../../config/baseResponseStatus");

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

exports.retrievePersonalChats = async function (userIdx, chatIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  // --논리 체크--
  // 해당 채팅 id의 개인톡이 있는가
  const chatCheckResult = await chatDao.checkPersonalChat(connection, chatIdx);
  if (chatCheckResult.length <= 0)
    return errResponse(baseResponse.CHAT_NOT_EXISTS);

  const chatResult = await chatDao.selectPersonalChats(connection, userIdx, chatIdx);

  connection.release();

  return response(baseResponse.SUCCESS, chatResult);
};

exports.retrieveGroupChats = async function (userIdx, chatIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  // --논리 체크--
  // 해당 채팅 id의 단톡이 있는가
  const chatCheckResult = await chatDao.checkGroupChat(connection, chatIdx);
  if (chatCheckResult.length <= 0)
    return errResponse(baseResponse.CHAT_NOT_EXISTS);

  const chatResult = await chatDao.selectGroupChats(connection, userIdx, chatIdx);

  connection.release();

  return response(baseResponse.SUCCESS, chatResult);
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

exports.chatUserCheck = async function (userIdx, chatIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatCheckResult = await chatDao.selectUserChat(connection, userIdx, chatIdx);
  connection.release();
  // console.log(chatCheckResult);

  return chatCheckResult;
};

exports.chatGroupCheck = async function (userIdx, chatIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatCheckResult = await chatDao.selectGroupChat(connection, userIdx, chatIdx);
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

exports.retrieveUserInfo = async function (userIdx, chatName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await chatDao.selectUserIdx(connection, userIdx, chatName)
  connection.release();

  return userResult;
};

exports.blockCheck = async function (userIdx, otherUserIdx, groupName) {
  const connection = await pool.getConnection(async (conn) => conn);
  let blockResult;
  if(!groupName)
    // 갠톡일 경우
    blockResult = await chatDao.selectBlockedUser(connection, userIdx, otherUserIdx);
  else
    // 단톡일 경우
    blockResult = await chatDao.selectBlockedChat(connection, userIdx, groupName);
  connection.release();

  return blockResult;
};

exports.unblockCheck = async function (userIdx, otherUserIdx, groupName) {
  const connection = await pool.getConnection(async (conn) => conn);
  let unblockResult;
  if(!groupName)
    // 갠톡일 경우
    unblockResult = await chatDao.selectUnblockedUser(connection, userIdx, otherUserIdx);
  else
    // 단톡일 경우
    unblockResult = await chatDao.selectUnblockedChat(connection, userIdx, groupName);
  connection.release();

  return unblockResult;
};

exports.chatFolderCheck = async function (chatIdx, folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const chatCheckResult = await chatDao.selectFolderChat(connection, chatIdx, folderIdx);
  connection.release();
  // console.log(chatCheckResult);

  return chatCheckResult;
};

exports.retrieveBlockedChatList = async function (userIdx) {
  // connection 은 db와의 연결을 도와줌
  const connection = await pool.getConnection(async (conn) => conn);
  // Dao 쿼리문의 결과를 호출
  const blockedChatListResult = await chatDao.selectBlockedChatList(connection, userIdx);
  // connection 해제
  connection.release();

  return blockedChatListResult;
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
