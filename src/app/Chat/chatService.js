const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// chat 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const chatProvider = require("./chatProvider");
const chatDao = require("./chatDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.deleteChat = async function (userIdx, chatIdx) {
    try {
        // --논리 체크--
        // 해당 채팅이 존재하는가
        const chatRows = await chatProvider.chatCheck(chatIdx);
        if (chatRows.length <= 0)
            return errResponse(baseResponse.CHAT_NOT_EXISTS);
        // 해당 채팅이 이미 삭제되었는가
        const chatDeleteRows = await chatProvider.chatDeleteCheck(chatIdx);
        if (chatDeleteRows.length > 0)
            return errResponse(baseResponse.CHAT_ALREADY_DELETED);

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
        const deleteUserChatResult = await chatDao.deleteUserChat(connection, userIdx, otherUserIdx);
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

exports.addChat = async function (userIdx, otherUserIdx, groupName, message, postTime) {
    try {
        // --논리 체크--
        // Block(차단)된 유저인가
        const userBlockRows = await chatProvider.userBlockCheck(userIdx, otherUserIdx, groupName);
        if (userBlockRows.length > 0) {
            console.log('차단된 메시지이므로 추가되지 않습니다.');
            return '차단된 톡방이므로 채팅을 추가하지 않습니다.';
        }
        // postTime이 제대로 설정되었나 (같은 채팅 상대의 가장 마지막 채팅 시간보다 늦은 시간인가)
        // const postTimeCheck = await chatProvider.postTimeCheck(userIdx, otherUserIdx, groupName, postTime);
        // if (postTimeCheck.length > 0) {
        //     return errResponse(baseResponse.POST_TIME_WRONG);
        // }

        const connection = await pool.getConnection(async (conn) => conn);

        // 새로운 유저이면 유저 추가하기 ???

        const addChatResult = await chatDao.insertChatInfo(connection, userIdx, otherUserIdx, groupName, message, postTime);
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - createchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await chatProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);

        const selectEmail = emailRows[0].email

        // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectchatPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await chatProvider.passwordCheck(selectchatPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const chatInfoRows = await chatProvider.accountCheck(email);

        if (chatInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (chatInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(chatInfoRows[0].id) // DB의 chatId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                chatId: chatInfoRows[0].id,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "chatInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'chatId': chatInfoRows[0].id, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

exports.editchat = async function (id, nickname) {
    try {
        console.log(id)
        const connection = await pool.getConnection(async (conn) => conn);
        const editchatResult = await chatDao.updatechatInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.SUCCESS);

    } catch (err) {
        logger.error(`App - editchat Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}