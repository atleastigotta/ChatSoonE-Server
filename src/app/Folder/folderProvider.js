const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const folderDao = require("./folderDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveFolderList = async function (userIdx) {
  // connection 은 db와의 연결을 도와줌
  const connection = await pool.getConnection(async (conn) => conn);
  // Dao 쿼리문의 결과를 호출
  const folderListResult = await folderDao.selectFolderList(connection, userIdx);
  // connection 해제
  connection.release();

  return folderListResult;
};

exports.folderCheck = async function (folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderCheckResult = await folderDao.selectFolder(connection, folderIdx);
  connection.release();
  // console.log(folderCheckResult);

  return folderCheckResult;
};

exports.folderHideCheck = async function (folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderCheckResult = await folderDao.selectHiddenFolder(connection, folderIdx);
  connection.release();
  // console.log(folderCheckResult);

  return folderCheckResult;
};

exports.folderUnhideCheck = async function (folderIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderCheckResult = await folderDao.selectUnhiddenFolder(connection, folderIdx);
  connection.release();
  // console.log(folderCheckResult);

  return folderCheckResult;
};

exports.retrieveHiddenFolderList = async function (userIdx) {
  const connection = await pool.getConnection(async (conn) => conn);
  const folderListHiddenResult = await folderDao.selectHiddenFolderList(connection, userIdx);
  connection.release();

  return folderListHiddenResult;
};
