const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

// folder 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const folderProvider = require("./folderProvider");
const folderDao = require("./folderDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.deletefolder = async function (userIdx, folderIdx) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const folderRows = await folderProvider.folderCheck(folderIdx);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.folder_NOT_EXISTS);
        // 해당 채팅이 이미 삭제되었는가
        const folderDeleteRows = await folderProvider.folderDeleteCheck(folderIdx);
        if (folderDeleteRows.length > 0)
            return errResponse(baseResponse.folder_ALREADY_DELETED);

        const connection = await pool.getConnection(async (conn) => conn);
        const deletefolderResult = await folderDao.deletefolder(connection, folderIdx);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deletePersonalfolders = async function (userIdx, otherUserIdx) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const folderRows = await folderProvider.folderUserCheck(userIdx, otherUserIdx);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.OPPONENT_NOT_EXISTS);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteUserfolderResult = await folderDao.deleteUserfolder(connection, otherUserIdx);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteGroupfolders = async function (userIdx, groupName) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const folderRows = await folderProvider.folderGroupCheck(userIdx, groupName);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.GROUP_NOT_EXISTS);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteGroupfolderResult = await folderDao.deleteGroupfolder(connection, userIdx, groupName);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.addfolder = async function (userIdx, nickname, groupName, profileImgUrl, message, postTime) {
    try {
        var otherUserIdx;

        const connection = await pool.getConnection(async (conn) => conn);

        // --논리 체크--
        // 기존에 존재하는 사람인가
        const newUserCheckRow = await folderProvider.newUserCheck(userIdx, nickname);
        // 존재함 -> otherUserIdx 불러오기
        if(newUserCheckRow.length > 0){
            otherUserIdx = newUserCheckRow[0].otherUserIdx;
            // console.log(otherUserIdx);

            // Block(차단)된 채팅인가
            const userBlockRows = await folderProvider.userBlockCheck(userIdx, otherUserIdx, groupName);
            if (userBlockRows.length > 0) {
                console.log('차단된 메시지이므로 추가되지 않습니다.');
                return '차단된 톡방이므로 채팅을 추가하지 않습니다.';
            }

            // postTime이 제대로 설정되었나 (같은 채팅 상대의 가장 마지막 채팅 시간보다 늦은 시간인가)
            // const postTimeCheck = await folderProvider.postTimeCheck(userIdx, otherUserIdx, groupName, postTime);
            // if (postTimeCheck.length > 0) {
            //     return errResponse(baseResponse.POST_TIME_WRONG);
            // }
        }
        // 존재 하지 않음 -> 유저 새로 추가 -> new otherUserIdx 부여하기
        else {
            const addNewUserResult = await folderDao.insertNewUserInfo(connection, userIdx, nickname, profileImgUrl);
            otherUserIdx = addNewUserResult[0].insertId;
            // console.log(otherUserIdx);
        }

        // 채팅 추가
        const addfolderResult = await folderDao.insertfolderInfo(connection, userIdx, otherUserIdx, groupName, message, postTime);

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.addfolderFolder = async function (userIdx, folderIdx, folderIdx) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const folderRows = await folderProvider.folderCheck(folderIdx);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.folder_NOT_EXISTS);
        // 해당 채팅이 이미 삭제되었는가
        // const folderDeleteRows = await folderProvider.folderDeleteCheck(folderIdx);
        // if (folderDeleteRows.length > 0)
        //     return errResponse(baseResponse.folder_ALREADY_DELETED);
        // 해당 채팅이 그 폴더에 이미 존재하는가
        const folderFolderRows = await folderProvider.folderFolderCheck(folderIdx, folderIdx);
        if (folderFolderRows.length > 0)
            return errResponse(baseResponse.folder_ALREADY_EXISTS_IN_FOLDER);

        const connection = await pool.getConnection(async (conn) => conn);

        // 채팅 폴더에 추가
        const addfolderToFolderResult = await folderDao.putfolderToFolder(connection, folderIdx, folderIdx);

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.addfoldersFolder = async function (userIdx, otherUserIdx, groupName, folderIdx) {
    try {
        // --논리 체크--
        // 갠톡인 경우
        if (otherUserIdx && !groupName) {
            // 해당 채팅이 존재하는가
            const folderRows = await folderProvider.folderUserCheck(userIdx, otherUserIdx);
            if (folderRows.length <= 0)
                return errResponse(baseResponse.OPPONENT_NOT_EXISTS);

            const connection = await pool.getConnection(async (conn) => conn);
            const addfoldersToFolderResult = await folderDao.putfoldersToFolder(connection, otherUserIdx, folderIdx)
            connection.release();
        }
        // 단톡인 경우
        else if (!otherUserIdx && groupName) {
            // 해당 채팅이 존재하는가
            const folderRows = await folderProvider.folderGroupCheck(userIdx, groupName);
            if (folderRows.length <= 0)
                return errResponse(baseResponse.GROUP_NOT_EXISTS);

            const connection = await pool.getConnection(async (conn) => conn);
            const addfoldersToFolderResult = await folderDao.putGroupfoldersToFolder(connection, userIdx, groupName, folderIdx);
            connection.release();
        }

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deletefolderFolder = async function (userIdx, folderIdx, folderIdx) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const folderRows = await folderProvider.folderCheck(folderIdx);
        if (folderRows.length <= 0)
            return errResponse(baseResponse.folder_NOT_EXISTS);
        // 해당 채팅이 이미 삭제되었는가
        // const folderDeleteRows = await folderProvider.folderDeleteCheck(folderIdx);
        // if (folderDeleteRows.length > 0)
        //     return errResponse(baseResponse.folder_ALREADY_DELETED);
        // 해당 채팅이 그 폴더에 존재하는가
        const folderFolderRows = await folderProvider.folderFolderCheck(folderIdx, folderIdx);
        if (folderFolderRows.length <= 0)
            return errResponse(baseResponse.folder_NOT_EXISTS_IN_FOLDER);

        const connection = await pool.getConnection(async (conn) => conn);

        // 채팅 폴더에서 제거
        const deletefolderFromFolderResult = await folderDao.removefolderFromFolder(connection, folderIdx, folderIdx);

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createfolder Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

// exports.blockfolder = async function (userIdx, folderName) {
//     try {
//         // --논리 체크--
//         // 해당 채팅이 존재하는가 (이미 블락되지는 않았는가) -> 있다면 otherUserIdx / groupName 가져오기
//         const folderRows = await folderProvider.folderInfoCheck(userIdx, folderName);
//         if (folderRows.length <= 0)
//             return errResponse(baseResponse.folder_NOT_EXISTS);
//         // 해당 채팅이 이미 삭제되었는가
//         const folderDeleteRows = await folderProvider.folderDeleteCheck(folderIdx);
//         if (folderDeleteRows.length > 0)
//             return errResponse(baseResponse.folder_ALREADY_DELETED);
//
//         const connection = await pool.getConnection(async (conn) => conn);
//         const deletefolderResult = await folderDao.deletefolder(connection, folderIdx);
//         connection.release();
//
//         return response(baseResponse.SUCCESS);
//     } catch (err) {
//         logger.error(`App - createfolder Service error\n: ${err.message}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };
