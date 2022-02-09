const chatProvider = require("./chatProvider");
const chatService = require("./chatService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 전체 채팅목록 가져오기 (메인 화면) API
 * [GET] /app/chats/{kakaoUserIdx}/chatlist
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));

    const chatListResponse = await chatProvider.retrieveChatList(userIdx);

    // chatListResponse 값을 json으로 전달
    return res.send(response(baseResponse.SUCCESS, chatListResponse));
};

/**
 * API No. 2
 * API Name : 갠톡 or 단톡의 채팅 가져오기 API
 * [GET] /app/chats/{kakaoUserIdx}/chats
 */
exports.getChats = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: chatIdx, groupName
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const chatIdx = req.query.chatIdx;
    const groupName = req.query.groupName;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!chatIdx)
        return res.send(errResponse(baseResponse.CHAT_ID_EMPTY));

    if (!groupName) {
        // 갠톡 채팅 내용 조회
        const personalChatListResult = await chatProvider.retrievePersonalChats(userIdx, chatIdx);
        return res.send(response(baseResponse.SUCCESS, personalChatListResult));
    } else {
        // 단톡 채팅 내용 조회
        const groupChatListResult = await chatProvider.retrieveGroupChats(userIdx, chatIdx);
        return res.send(response(baseResponse.SUCCESS, groupChatListResult));
    }
};

/**
 * API No. 3
 * API Name : 폴더의 채팅 가져오기 API
 * [GET] /app/chats/{kakaoUserIdx}/folder-chats
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));

    if (!folderIdx)
        return res.send(errResponse(baseResponse.FOLDER_ID_EMPTY));
    else {
        // 해당 폴더의 채팅 내용 조회
        const folderChatListResult = await chatProvider.retrieveFolderChats(userIdx, folderIdx);
        return res.send(response(baseResponse.SUCCESS, folderChatListResult));
    }
};

/**
 * API No. 4
 * API Name : 선택한 채팅 삭제하기 API
 * [DELETE] /app/chats/{kakaoUserIdx}/chat
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));

    if (!chatIdx)
        return res.send(errResponse(baseResponse.CHAT_ID_EMPTY));

    const deleteChatResult = await chatService.deleteChat(userIdx, chatIdx);
    return res.send(deleteChatResult);
};

/**
 * API No. 5
 * API Name : 선택한 채팅목록의 모든 채팅 삭제하기 API
 * [DELETE] /app/chats/{kakaoUserIdx}/chats
 */
exports.deleteAllChat = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: chatIdx, groupName
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const chatIdx = req.query.chatIdx;
    const groupName = req.query.groupName;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!chatIdx)
        return res.send(errResponse(baseResponse.CHAT_ID_EMPTY));

    if (!groupName) {
        // 갠톡 채팅 내용 삭제
        const deletePersonalChatResult = await chatService.deletePersonalChats(userIdx, chatIdx);
        return res.send(deletePersonalChatResult);
    } else {
        // 단톡 채팅 내용 삭제
        const deleteGroupChatResult = await chatService.deleteGroupChats(userIdx, chatIdx);
        return res.send(deleteGroupChatResult);
    }
};

/**
 * API No. 6
 * API Name : 채팅 추가하기 API
 * [POST] /app/chats/{kakaoUserIdx}/chat
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!nickname)
        return res.send(errResponse(baseResponse.CHAT_OPPONENT_NICKNAME_EMPTY));
    if (!message)
        return res.send(errResponse(baseResponse.CHAT_MESSAGE_EMPTY));
    if (!postTime)
        return res.send(errResponse(baseResponse.CHAT_POST_TIME_EMPTY));

    const addChatResponse = await chatService.addChat(userIdx, nickname, groupName, profileImgUrl, message, postTime);

    return res.send(addChatResponse);
};

/**
 * API No. 7
 * API Name : 폴더에 채팅 추가하기 API
 * [POST] /app/chats/{kakaoUserIdx}/folder-chat
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!chatIdx)
        return res.send(errResponse(baseResponse.CHAT_ID_EMPTY));
    if (!folderIdx)
        return res.send(errResponse(baseResponse.FOLDER_ID_EMPTY));

    const addChatFolderResponse = await chatService.addChatFolder(userIdx, chatIdx, folderIdx);

    return res.send(addChatFolderResponse);
};

/**
 * API No. 8
 * API Name : 폴더에 채팅목록 추가하기 API
 * [POST] /app/chats/{kakaoUserIdx}/folder-chats
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!folderIdx)
        return res.send(errResponse(baseResponse.FOLDER_ID_EMPTY));
    if (!otherUserIdx && !groupName)
        return res.send(errResponse(baseResponse.CHAT_OPPONENT_EMPTY));
    else if (otherUserIdx && groupName)
        return res.send(errResponse(baseResponse.CHAT_OPPONENT_INVALID));

    const addChatsFolderResponse = await chatService.addChatsFolder(userIdx, otherUserIdx, groupName, folderIdx);

    return res.send(addChatsFolderResponse);
};

/**
 * API No. 9
 * API Name : 폴더에서 채팅 삭제 API
 * [DELETE] /app/chats/{kakaoUserIdx}/folder-chat
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!chatIdx)
        return res.send(errResponse(baseResponse.CHAT_ID_EMPTY));
    if (!folderIdx)
        return res.send(errResponse(baseResponse.FOLDER_ID_EMPTY));

    const deleteChatFolderResponse = await chatService.deleteChatFolder(userIdx, chatIdx, folderIdx);

    return res.send(deleteChatFolderResponse);
};


/**
 * API No. 10
 * API Name : 톡방(채팅/회원) 차단하기 API
 * [PATCH] /app/chats/{kakaoUserIdx}/block
 */
exports.blockChat = async function (req, res) {
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!otherUserIdx && !groupName)
        return res.send(errResponse(baseResponse.CHAT_OPPONENT_EMPTY));
    else if (otherUserIdx && groupName)
        return res.send(errResponse(baseResponse.CHAT_OPPONENT_INVALID));

    const blockChatResponse = await chatService.blockChat(userIdx, otherUserIdx, groupName);

    return res.send(blockChatResponse);
};

/**
 * API No. 11
 * API Name : 톡방 차단 해제하기 API
 * [PATCH] /app/chats/{kakaoUserIdx}/unblock
 */
exports.unblockChat = async function (req, res) {
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));
    if (!otherUserIdx && !groupName)
        return res.send(errResponse(baseResponse.CHAT_OPPONENT_EMPTY));
    else if (otherUserIdx && groupName)
        return res.send(errResponse(baseResponse.CHAT_OPPONENT_INVALID));

    const unblockChatResponse = await chatService.unblockChat(userIdx, otherUserIdx, groupName);

    return res.send(unblockChatResponse);
};

/**
 * API No. 12
 * API Name : 차단 된 톡방 목록 가져오기 API
 * [GET] /app/chats/{kakaoUserIdx}/blocked-chatlist
 */
exports.getBlockedChatlist = async function (req, res) {
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
        return res.send(errResponse(baseResponse.USER_ID_EMPTY));

    const blockedChatListResponse = await chatProvider.retrieveBlockedChatList(userIdx);

    return res.send(response(baseResponse.SUCCESS, blockedChatListResponse));
};
