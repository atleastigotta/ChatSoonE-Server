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
    app.get('/app/chatlist/:kakaoUserIdx', chat.getChatList);

    // 2. 갠톡 or 단톡의 채팅 가져오기 API
    app.get('/app/chat/:kakaoUserIdx', chat.getChats);

    // 3. 폴더의 채팅 가져오기 API
    app.get('/app/chat-folder/:kakaoUserIdx', chat.getFolderChats);

    // 4. 선택한 채팅 삭제하기 API
    app.post('/app/delete-chat/:kakaoUserIdx', chat.postDeleteChat);

    // 5. 선택한 채팅목록의 모든 채팅 삭제하기 API
    app.post('/app/deleteAll-chat/:kakaoUserIdx', chat.postDeleteAllChat);

    // 6. 채팅 추가하기 API
    app.post('/app/add-chat/:kakaoUserIdx', chat.postChat);

    // 차단하기
    // 차단 해제하기
    // 폴더에 채팅 추가
    // 폴더에 채팅목록의 채팅(개인, 단체) 모두 추가
    // 폴더에서 채팅 삭제
    // 폴더 삭제
};
