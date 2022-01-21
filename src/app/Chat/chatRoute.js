module.exports = function(app){
    const chat = require('./chatController');
    const passport = require('passport');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 카카오 로그인
    // app.post('/app/chats/kakao-login', chat.kakaoLogin);
    app.get('/kakao', passport.authenticate('kakao-login'));
    app.get('/kakao/oauth', passport.authenticate('kakao-login', {
        successRedirect: '/',
        failureRedirect : '/',
    }), (req, res) => {res.redirect('/');});

    // 1. 전체 채팅목록 가져오기 (메인 화면) API
    app.get('/app/chatlist', chat.getChatList);

};
