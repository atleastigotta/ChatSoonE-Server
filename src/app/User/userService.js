const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");

// user 뿐만 아니라 다른 도메인의 Provider와 Dao도 아래처럼 require하여 사용할 수 있습니다.
const userProvider = require("./userProvider");
const userDao = require("./userDao");

const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Service: Create, Update, Delete 비즈니스 로직 처리

// After 로그인 인증 방법 (JWT)
// exports.postSignIn = async function (email, password) {
//     try {
//         // 이메일 여부 확인
//         const emailRows = await userProvider.emailCheck(email);
//         if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
//
//         const selectEmail = emailRows[0].email
//
//         // 비밀번호 확인 (입력한 비밀번호를 암호화한 것과 DB에 저장된 비밀번호가 일치하는 지 확인함)
//         const hashedPassword = await crypto
//             .createHash("sha512")
//             .update(password)
//             .digest("hex");
//
//         const selectUserPasswordParams = [selectEmail, hashedPassword];
//         const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);
//
//         if (passwordRows[0].password !== hashedPassword) {
//             return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
//         }
//
//         // 계정 상태 확인
//         const userInfoRows = await userProvider.accountCheck(email);
//
//         if (userInfoRows[0].status === "INACTIVE") {
//             return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
//         } else if (userInfoRows[0].status === "DELETED") {
//             return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
//         }
//
//         console.log(userInfoRows[0].id) // DB의 userId
//
//         //토큰 생성 Service
//         let token = await jwt.sign(
//             {
//                 userId: userInfoRows[0].id,
//             }, // 토큰의 내용(payload)
//             secret_config.jwtsecret, // 비밀키
//             {
//                 expiresIn: "365d",
//                 subject: "userInfo",
//             } // 유효 기간 365일
//         );
//
//         return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].id, 'jwt': token});
//
//     } catch (err) {
//         logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
//         return errResponse(baseResponse.DB_ERROR);
//     }
// };