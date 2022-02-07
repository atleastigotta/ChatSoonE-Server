const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

// folder 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const folderProvider = require("./folderProvider");
const folderDao = require("./folderDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.addFolder = async function (userIdx) {
    try {
        // --논리 체크--

        // 폴더 추가
        const connection = await pool.getConnection(async (conn) => conn);
        const addFolderResult = await folderDao.insertFolderInfo(connection, userIdx);

        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editFolderName = async function (userIdx, folderIdx, folderName) {
    try {
        // --논리 체크--
        // 해당 폴더가 존재하는가
        const folderRows = await folderProvider.folderCheck(folderIdx);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.FOLDER_NOT_EXISTS);

        const connection = await pool.getConnection(async (conn) => conn);
        const changeFolderNameResult = await folderDao.changeFolderName(connection, userIdx, folderIdx, folderName);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editFolderIcon = async function (userIdx, folderIdx, folderImg) {
    try {
        // --논리 체크--
        // 해당 폴더가 존재하는가
        const folderRows = await folderProvider.folderCheck(folderIdx);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.FOLDER_NOT_EXISTS);

        const connection = await pool.getConnection(async (conn) => conn);
        const changeFolderIconResult = await folderDao.changeFolderIcon(connection, userIdx, folderIdx, folderImg);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteFolder = async function (userIdx, folderIdx) {
    try {
        // --논리 체크--
        // 해당 폴더가 존재하는가
        const folderRows = await folderProvider.folderCheck(folderIdx);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.FOLDER_NOT_EXISTS);

        // 폴더 안의 채팅 모두 폴더에서 제거 + 폴더 삭제
        const connection = await pool.getConnection(async (conn) => conn);
        const deleteFolderChatResult = await folderDao.deleteFolderChat(connection, folderIdx);
        const deleteFolderResult = await folderDao.deleteFolder(connection, folderIdx);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.hideFolder = async function (userIdx, folderIdx) {
    try {
        // --논리 체크--
        // 해당 폴더가 존재하는가
        const folderRows = await folderProvider.folderCheck(folderIdx);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.FOLDER_NOT_EXISTS);
        // 해당 폴더가 이미 숨겨져 있는가
        const folderHideRows = await folderProvider.folderHideCheck(folderIdx);
        if (folderHideRows.length > 0)
            return errResponse(baseResponse.FOLDER_ALREADY_HIDDEN);

        const connection = await pool.getConnection(async (conn) => conn);
        const hideFolderResult = await folderDao.hideFolder(connection, folderIdx);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.unhideFolder = async function (userIdx, folderIdx) {
    try {
        // --논리 체크--
        // 해당 폴더가 존재하는가
        const folderRows = await folderProvider.folderCheck(folderIdx);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.FOLDER_NOT_EXISTS);
        // 해당 폴더가 이미 안 숨겨져 있는가
        const folderUnhideRows = await folderProvider.folderUnhideCheck(folderIdx);
        if (folderUnhideRows.length > 0)
            return errResponse(baseResponse.FOLDER_ALREADY_NOT_HIDDEN);

        const connection = await pool.getConnection(async (conn) => conn);
        const unhideFolderResult = await folderDao.unhideFolder(connection, folderIdx);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

