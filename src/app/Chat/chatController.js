const jwtMiddleware = require("../../../config/jwtMiddleware");
const chatProvider = require("../../app/chat/chatProvider");
const chatService = require("../../app/chat/chatService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

passport.use('kakao-login', new KakaoStrategy({
    clientID: 'd78a94142d0c7f4e304d6a19a3b20844',
    callbackURL: 'http://localhost:3000/kakao/oauth',
}, async (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    console.log(profile);
}))

/**
 * API No. 1
 * API Name : 전체 채팅목록 가져오기 (메인 화면) API
 * [GET] /app/chatlist
 */
exports.getChatList = async function (req, res) {

    /**
     * Query String: kakaoUserIdx
     * Header:
     */
    const userIdx = req.query.kakaoUserIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));

    const chatListResponse = await chatProvider.retrieveChatList(userIdx);

    // chatListResponse 값을 json으로 전달
    return res.send(chatListResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/chats
 */
exports.getchats = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const chatListResult = await chatProvider.retrievechatList();
        // SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" }, 메세지와 함께 chatListResult 호출
        return res.send(response(baseResponse.SUCCESS, chatListResult));
    } else {
        // 아메일을 통한 유저 검색 조회
        const chatListByEmail = await chatProvider.retrievechatList(email);
        return res.send(response(baseResponse.SUCCESS, chatListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/chats/{chatId}
 */
exports.getchatById = async function (req, res) {

    /**
     * Path Variable: chatId
     */
    const chatId = req.params.chatId;
    // errResponse 전달
    if (!chatId) return res.send(errResponse(baseResponse.chat_chatID_EMPTY));

    // chatId를 통한 유저 검색 함수 호출 및 결과 저장
    const chatBychatId = await chatProvider.retrievechat(chatId);
    return res.send(response(baseResponse.SUCCESS, chatBychatId));
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
