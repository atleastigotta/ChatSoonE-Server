module.exports = function(app){
    const user = require('./userController');
    const passport = require('passport');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    app.get('/app/test', user.getTest);

    // 카카오 로그인
    // app.post('/app/users/kakao-login', user.kakaoLogin);
    app.get('/kakao', passport.authenticate('kakao-login'));
    app.get('/kakao/oauth', passport.authenticate('kakao-login', {
        successRedirect: '/',
        failureRedirect : '/',
    }), (req, res) => {res.redirect('/');});

    // 1. 카카오 회원 추가
    app.post('/app/users/user', user.postUser);

    // After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    // app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    // app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers)

};


// 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);
