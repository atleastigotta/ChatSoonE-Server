const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");

// chat 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const chatProvider = require("./chatProvider");
const chatDao = require("./chatDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.deleteChat = async function (userIdx, chatIdx) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const chatRows = await chatProvider.chatCheck(chatIdx);
        if (chatRows.length <= 0)
            return errResponse(baseResponse.CHAT_NOT_EXISTS);
        // 해당 채팅이 이미 삭제되었는가
        // const chatDeleteRows = await chatProvider.chatDeleteCheck(chatIdx);
        // if (chatDeleteRows.length > 0)
        //     return errResponse(baseResponse.CHAT_ALREADY_DELETED);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteChatResult = await chatDao.deleteChat(connection, chatIdx);
        connection.release();

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deletePersonalChats = async function (userIdx, otherUserIdx) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const chatRows = await chatProvider.chatUserCheck(userIdx, otherUserIdx);
        if (chatRows.length <= 0)
            return errResponse(baseResponse.OPPONENT_NOT_EXISTS);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteUserChatResult = await chatDao.deleteUserChat(connection, otherUserIdx);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteGroupChats = async function (userIdx, groupName) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const chatRows = await chatProvider.chatGroupCheck(userIdx, groupName);
        if (chatRows.length <= 0)
            return errResponse(baseResponse.GROUP_NOT_EXISTS);

        const connection = await pool.getConnection(async (conn) => conn);
        const deleteGroupChatResult = await chatDao.deleteGroupChat(connection, userIdx, groupName);
        connection.release();
        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.addChat = async function (userIdx, nickname, groupName, profileImgUrl, message, postTime) {
    try {
        var otherUserIdx;

        const connection = await pool.getConnection(async (conn) => conn);

        // --논리 체크--
        // 기존에 존재하는 사람인가
        const newUserCheckRow = await chatProvider.newUserCheck(userIdx, nickname);
        // 존재함 -> otherUserIdx 불러오기
        if(newUserCheckRow.length > 0){
            otherUserIdx = newUserCheckRow[0].otherUserIdx;
            // console.log(otherUserIdx);

            // Block(차단)된 채팅인가
            const userBlockRows = await chatProvider.blockCheck(userIdx, otherUserIdx, groupName);
            if (userBlockRows.length > 0) {
                console.log('차단된 메시지이므로 추가되지 않습니다.');
                return '차단된 톡방이므로 채팅을 추가하지 않습니다.';
            }

            // postTime이 제대로 설정되었나 (같은 채팅 상대의 가장 마지막 채팅 시간보다 늦은 시간인가)
            // const postTimeCheck = await chatProvider.postTimeCheck(userIdx, otherUserIdx, groupName, postTime);
            // if (postTimeCheck.length > 0) {
            //     return errResponse(baseResponse.POST_TIME_WRONG);
            // }
        }
        // 존재 하지 않음 -> 유저 새로 추가 -> new otherUserIdx 부여하기
        else {
            const addNewUserResult = await chatDao.insertNewUserInfo(connection, userIdx, nickname, profileImgUrl);
            otherUserIdx = addNewUserResult[0].insertId;
            // console.log(otherUserIdx);
        }

        // 채팅 추가
        const addChatResult = await chatDao.insertChatInfo(connection, userIdx, otherUserIdx, groupName, message, postTime);

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.addChatFolder = async function (userIdx, chatIdx, folderIdx) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const chatRows = await chatProvider.chatCheck(chatIdx);
        if (chatRows.length <= 0)
            return errResponse(baseResponse.CHAT_NOT_EXISTS);
        // 해당 채팅이 이미 삭제되었는가
        // const chatDeleteRows = await chatProvider.chatDeleteCheck(chatIdx);
        // if (chatDeleteRows.length > 0)
        //     return errResponse(baseResponse.CHAT_ALREADY_DELETED);
        // 해당 채팅이 그 폴더에 이미 존재하는가
        const chatFolderRows = await chatProvider.chatFolderCheck(chatIdx, folderIdx);
        if (chatFolderRows.length > 0)
            return errResponse(baseResponse.CHAT_ALREADY_EXISTS_IN_FOLDER);

        const connection = await pool.getConnection(async (conn) => conn);

        // 채팅 폴더에 추가
        const addChatToFolderResult = await chatDao.putChatToFolder(connection, chatIdx, folderIdx);

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.addChatsFolder = async function (userIdx, otherUserIdx, groupName, folderIdx) {
    try {
        // --논리 체크--
        // 갠톡인 경우
        if (otherUserIdx && !groupName) {
            // 해당 채팅이 존재하는가
            const chatRows = await chatProvider.chatUserCheck(userIdx, otherUserIdx);
            if (chatRows.length <= 0)
                return errResponse(baseResponse.OPPONENT_NOT_EXISTS);

            const connection = await pool.getConnection(async (conn) => conn);
            const addChatsToFolderResult = await chatDao.putChatsToFolder(connection, otherUserIdx, folderIdx)
            connection.release();
        }
        // 단톡인 경우
        else if (!otherUserIdx && groupName) {
            // 해당 채팅이 존재하는가
            const chatRows = await chatProvider.chatGroupCheck(userIdx, groupName);
            if (chatRows.length <= 0)
                return errResponse(baseResponse.GROUP_NOT_EXISTS);

            const connection = await pool.getConnection(async (conn) => conn);
            const addChatsToFolderResult = await chatDao.putGroupChatsToFolder(connection, userIdx, groupName, folderIdx);
            connection.release();
        }

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.deleteChatFolder = async function (userIdx, chatIdx, folderIdx) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const chatRows = await chatProvider.chatCheck(chatIdx);
        if (chatRows.length <= 0)
            return errResponse(baseResponse.CHAT_NOT_EXISTS);
        // 해당 채팅이 이미 삭제되었는가
        // const chatDeleteRows = await chatProvider.chatDeleteCheck(chatIdx);
        // if (chatDeleteRows.length > 0)
        //     return errResponse(baseResponse.CHAT_ALREADY_DELETED);
        // 해당 채팅이 그 폴더에 존재하는가
        const chatFolderRows = await chatProvider.chatFolderCheck(chatIdx, folderIdx);
        if (chatFolderRows.length <= 0)
            return errResponse(baseResponse.CHAT_NOT_EXISTS_IN_FOLDER);

        const connection = await pool.getConnection(async (conn) => conn);

        // 채팅 폴더에서 제거
        const deleteChatFromFolderResult = await chatDao.removeChatFromFolder(connection, chatIdx, folderIdx);

        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.blockChat = async function (userIdx, otherUserIdx, groupName) {
    try {
        // --논리 체크--
        // 이미 Block(차단)된 채팅인가
        const blockedRows = await chatProvider.blockCheck(userIdx, otherUserIdx, groupName);
        if (blockedRows.length > 0) {
            return errResponse(baseResponse.CHATLIST_ALREADY_BLOCKED);
        }
        // 갠톡인 경우
        if (otherUserIdx && !groupName) {
            const connection = await pool.getConnection(async (conn) => conn);
            const blockChatResult = await chatDao.blockChat(connection, otherUserIdx);
            const blockUserResult = await chatDao.blockUser(connection, otherUserIdx);
            connection.release();
        }
        // 단톡인 경우
        else if (!otherUserIdx && groupName) {
            const connection = await pool.getConnection(async (conn) => conn);
            const blockGroupChatResult = await chatDao.blockGroupChat(connection, userIdx, groupName);
            connection.release();
        }

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.unblockChat = async function (userIdx, otherUserIdx, groupName) {
    try {
        // --논리 체크--
        // 이미 Unblock(차단 해제)된 채팅인가
        const unblockedRows = await chatProvider.unblockCheck(userIdx, otherUserIdx, groupName);
        if (unblockedRows.length > 0) {
            return errResponse(baseResponse.CHATLIST_ALREADY_UNBLOCKED);
        }
        // 갠톡인 경우
        if (otherUserIdx && !groupName) {
            const connection = await pool.getConnection(async (conn) => conn);
            const unblockChatResult = await chatDao.unblockChat(connection, otherUserIdx);
            const unblockUserResult = await chatDao.unblockUser(connection, otherUserIdx);
            connection.release();
        }
        // 단톡인 경우
        else if (!otherUserIdx && groupName) {
            const connection = await pool.getConnection(async (conn) => conn);
            const unblockGroupChatResult = await chatDao.unblockGroupChat(connection, userIdx, groupName);
            connection.release();
        }

        return response(baseResponse.SUCCESS);
    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};
