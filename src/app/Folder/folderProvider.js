const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const folderDao = require("./folderDao");

// Provider: Read 비즈니스 로직 처리

exports.retrievefolderList = async function (userIdx) {
  // connection 은 db와의 연결을 도와줌
  const connection = await pool.getConnection(async (conn) => conn);
  // Dao 쿼리문의 결과를 호출
  const folderListResult = await folderDao.selectfolderList(connection, userIdx);
  // connection 해제
  connection.release();

  return folderListResult;
};

exports.retrievePersonalfolders = async function (userIdx, otherUserIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderResult = await folderDao.selectPersonalfolders(connection, userIdx, otherUserIdx);

  connection.release();

  return folderResult;
};

exports.retrieveGroupfolders = async function (userIdx, groupName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderResult = await folderDao.selectGroupfolders(connection, userIdx, groupName);

  connection.release();

  return folderResult;
};

exports.retrieveFolderfolders = async function (userIdx, folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderResult = await folderDao.selectFolderfolders(connection, userIdx, folderIdx);

  connection.release();

  return folderResult;
};

exports.folderCheck = async function (folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderCheckResult = await folderDao.selectfolder(connection, folderIdx);
  connection.release();
  // console.log(folderCheckResult);

  return folderCheckResult;
};

exports.folderUserCheck = async function (userIdx, otherUserIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderCheckResult = await folderDao.selectUserfolder(connection, userIdx, otherUserIdx);
  connection.release();
  // console.log(folderCheckResult);

  return folderCheckResult;
};

exports.folderGroupCheck = async function (userIdx, groupName) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderCheckResult = await folderDao.selectGroupfolder(connection, userIdx, groupName);
  connection.release();
  // console.log(folderCheckResult);

  return folderCheckResult;
};

exports.folderDeleteCheck = async function (folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderDeleteCheckResult = await folderDao.selectDeletefolder(connection, folderIdx);
  connection.release();
  // console.log(folderDeleteCheckResult);

  return folderDeleteCheckResult;
};

exports.newUserCheck = async function (userIdx, nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  // 새로운 채팅 상대인가
  const newUserCheckResult = await folderDao.selectExistingUser(connection, userIdx, nickname);

  connection.release();

  return newUserCheckResult;
};

exports.userBlockCheck = async function (userIdx, otherUserIdx, groupName) {
  const connection = await pool.getConnection(async (conn) => conn);
  let userBlockResult;
  if(!groupName)
    // 갠톡일 경우
    userBlockResult = await folderDao.selectBlockedUser(connection, userIdx, otherUserIdx);
  else
    // 단톡일 경우
    userBlockResult = await folderDao.selectBlockedfolder(connection, userIdx, groupName);
  connection.release();

  return userBlockResult;
};

exports.folderFolderCheck = async function (folderIdx, folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderCheckResult = await folderDao.selectFolderfolder(connection, folderIdx, folderIdx);
  connection.release();
  // console.log(folderCheckResult);

  return folderCheckResult;
};


// exports.postTimeCheck = async function (userIdx, otherUserIdx, groupName, postTime) {
//   const connection = await pool.getConnection(async (conn) => conn);
//   let postTimeCheckResult;
//   if(!groupName)
//       // 갠톡일 경우
//     postTimeCheckResult = await folderDao.selectPostTimeUser(connection, userIdx, otherUserIdx);
//   else
//       // 단톡일 경우
//     postTimeCheckResult = await folderDao.selectPostTimeGroup(connection, userIdx, groupName);
//   connection.release();
//
//   return postTimeCheckResult;
// };
