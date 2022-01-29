const chatProvider = require("../../app/chat/chatProvider");
const chatService = require("../../app/chat/chatService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 전체 채팅목록 가져오기 (메인 화면) API
 * [GET] /app/chatlist/{kakaoUserIdx}
 */
exports.getChatList = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String:
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));

    const chatListResponse = await chatProvider.retrieveChatList(userIdx);

    // chatListResponse 값을 json으로 전달
    return res.send(response(baseResponse.SUCCESS, chatListResponse));
};

/**
 * API No. 2
 * API Name : 갠톡 or 단톡의 채팅 가져오기 API
 * [GET] /app/chat/{kakaoUserIdx}
 */
exports.getChats = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: otherUserIdx, groupName
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const otherUserIdx = req.query.otherUserIdx;
    const groupName = req.query.groupName;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!otherUserIdx && !groupName)
        return res.send(response(baseResponse.CHAT_OPPONENT_EMPTY));
    else if (otherUserIdx && groupName)
        return res.send(response(baseResponse.CHAT_OPPONENT_INVALID));

    if (otherUserIdx && !groupName) {
        // 갠톡 채팅 내용 조회
        const personalChatListResult = await chatProvider.retrievePersonalChats(userIdx, otherUserIdx);
        return res.send(response(baseResponse.SUCCESS, personalChatListResult));
    } else if (!otherUserIdx && groupName) {
        // 단톡 채팅 내용 조회
        const groupChatListResult = await chatProvider.retrieveGroupChats(userIdx, groupName);
        return res.send(response(baseResponse.SUCCESS, groupChatListResult));
    }
};

/**
 * API No. 3
 * API Name : 폴더의 채팅 가져오기 API
 * [GET] /app/chat-folder/{kakaoUserIdx}
 */
exports.getFolderChats = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: folderIdx
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const folderIdx = req.query.folderIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));

    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));
    else {
        // 해당 폴더의 채팅 내용 조회
        const folderChatListResult = await chatProvider.retrieveFolderChats(userIdx, folderIdx);
        return res.send(response(baseResponse.SUCCESS, folderChatListResult));
    }
};

/**
 * API No. 4
 * API Name : 선택한 채팅 삭제하기 API
 * [DELETE] /app/delete-chat/{kakaoUserIdx}
 */
exports.deleteChat = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: chatIdx
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const chatIdx = req.query.chatIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));

    if (!chatIdx)
        return res.send(response(baseResponse.CHAT_ID_EMPTY));
    else {
        // 해당 채팅 삭제
        const deleteChatResult = await chatService.deleteChat(userIdx, chatIdx);
        return res.send(deleteChatResult);
    }
};

/**
 * API No. 5
 * API Name : 선택한 채팅목록의 모든 채팅 삭제하기 API
 * [DELETE] /app/deleteAll-chat/{kakaoUserIdx}
 */
exports.deleteAllChat = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: otherUserIdx, groupName
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const otherUserIdx = req.query.otherUserIdx;
    const groupName = req.query.groupName;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!otherUserIdx && !groupName)
        return res.send(response(baseResponse.CHAT_OPPONENT_EMPTY));
    else if (otherUserIdx && groupName)
        return res.send(response(baseResponse.CHAT_OPPONENT_INVALID));

    if (otherUserIdx && !groupName) {
        // 갠톡 채팅 내용 삭제
        const deletePersonalChatResult = await chatService.deletePersonalChats(userIdx, otherUserIdx);
        return res.send(deletePersonalChatResult);
    } else if (!otherUserIdx && groupName) {
        // 단톡 채팅 내용 삭제
        const deleteGroupChatResult = await chatService.deleteGroupChats(userIdx, groupName);
        return res.send(deleteGroupChatResult);
    }
};

/**
 * API No. 6
 * API Name : 채팅 추가하기 API
 * [POST] /app/add-chat/{kakaoUserIdx}
 */
exports.postChat = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String:
     * Header:
     * Body: nickname, groupName, profileImgUrl, message, postTime
     */
    const userIdx = req.params.kakaoUserIdx;
    const {nickname, groupName, profileImgUrl, message, postTime} = req.body;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!nickname)
        return res.send(response(baseResponse.CHAT_OPPONENT_NICKNAME_EMPTY));
    if (!message)
        return res.send(response(baseResponse.CHAT_MESSAGE_EMPTY));
    if (!postTime)
        return res.send(response(baseResponse.CHAT_POST_TIME_EMPTY));

    const addChatResponse = await chatService.addChat(userIdx, nickname, groupName, profileImgUrl, message, postTime);

    return res.send(addChatResponse);
};

/**
 * API No. 7
 * API Name : 폴더에 채팅 추가하기 API
 * [POST] /app/add-chat-folder/{kakaoUserIdx}
 */
exports.addChatToFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: chatIdx
     * Header:
     * Body: folderIdx
     */
    const userIdx = req.params.kakaoUserIdx;
    const chatIdx = req.query.chatIdx;
    const folderIdx = req.body.folderIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!chatIdx)
        return res.send(response(baseResponse.CHAT_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));

    const addChatFolderResponse = await chatService.addChatFolder(userIdx, chatIdx, folderIdx);

    return res.send(addChatFolderResponse);
};

/**
 * API No. 8
 * API Name : 폴더에 채팅목록 추가하기 API
 * [POST] /app/add-chats-folder/{kakaoUserIdx}
 */
exports.addChatsToFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: otherUserIdx, groupName
     * Header:
     * Body: folderIdx
     */
    const userIdx = req.params.kakaoUserIdx;
    const otherUserIdx = req.query.otherUserIdx;
    const groupName = req.query.groupName;
    const folderIdx = req.body.folderIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));
    if (!otherUserIdx && !groupName)
        return res.send(response(baseResponse.CHAT_OPPONENT_EMPTY));
    else if (otherUserIdx && groupName)
        return res.send(response(baseResponse.CHAT_OPPONENT_INVALID));

    const addChatsFolderResponse = await chatService.addChatsFolder(userIdx, otherUserIdx, groupName, folderIdx);

    return res.send(addChatsFolderResponse);
};

/**
 * API No. 9
 * API Name : 폴더에서 채팅 삭제 API
 * [DELETE] /app/delete-chat-folder/{kakaoUserIdx}
 */
exports.deleteChatFromFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: chatIdx, folderIdx
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const chatIdx = req.query.chatIdx;
    const folderIdx = req.query.folderIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!chatIdx)
        return res.send(response(baseResponse.CHAT_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));

    const deleteChatFolderResponse = await chatService.deleteChatFolder(userIdx, chatIdx, folderIdx);

    return res.send(deleteChatFolderResponse);
};


/**
 * API No. 10
 * API Name : 채팅목록 차단하기 API
 * [PATCH] /app/block-chat/{kakaoUserIdx}
 */
exports.blockChat = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: chatName
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const chatName = req.query.chatName;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!chatName)
        return res.send(response(baseResponse.CHAT_NAME_EMPTY));

    const blockChatResponse = await chatService.blockChat(userIdx, chatName);

    return res.send(blockChatResponse);
};




// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    const signInResponse = await chatService.postSignIn(email, password);

    return res.send(signInResponse);
};

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/chats/:chatId
 * path variable : chatId
 * body : nickname
 */
exports.patchchats = async function (req, res) {

    // jwt - chatId, path variable :chatId

    const chatIdFromJWT = req.verifiedToken.chatId

    const chatId = req.params.chatId;
    const nickname = req.body.nickname;

    // JWT는 이 후 주차에 다룰 내용
    if (chatIdFromJWT != chatId) {
        res.send(errResponse(baseResponse.chat_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.chat_NICKNAME_EMPTY));

        const editchatInfo = await chatService.editchat(chatId, nickname)
        return res.send(editchatInfo);
    }
};

// JWT 이 후 주차에 다룰 내용
/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const chatIdResult = req.verifiedToken.chatId;
    console.log(chatIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
