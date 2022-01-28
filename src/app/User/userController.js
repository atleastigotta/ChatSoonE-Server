const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
exports.getTest = async function (req, res) {
    return res.send(response(baseResponse.SUCCESS))
}

// 카카오 로그인
passport.use('kakao-login', new KakaoStrategy({
    clientID: 'd78a94142d0c7f4e304d6a19a3b20844',
    callbackURL: 'http://localhost:3000/kakao/oauth',
}, async (accessToken, refreshToken, profile, done) => {
    console.log(accessToken);
    console.log(profile);
}))




// After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
// exports.login = async function (req, res) {
//     const {email, password} = req.body;
//     const signInResponse = await userService.postSignIn(email, password);
//     return res.send(signInResponse);
// };

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
// exports.patchUsers = async function (req, res) {
//
//     // jwt - userId, path variable :userId
//
//     const userIdFromJWT = req.verifiedToken.userId
//
//     const userId = req.params.userId;
//     const nickname = req.body.nickname;
//
//     // JWT는 이 후 주차에 다룰 내용
//     if (userIdFromJWT != userId) {
//         res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
//     } else {
//         if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));
//
//         const editUserInfo = await userService.editUser(userId, nickname)
//         return res.send(editUserInfo);
//     }
// };

// JWT 이 후 주차에 다룰 내용
/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
// exports.check = async function (req, res) {
//     const userIdResult = req.verifiedToken.userId;
//     console.log(userIdResult);
//     return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
// };
