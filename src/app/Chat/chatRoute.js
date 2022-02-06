module.exports = function(app){
    const chat = require('./chatController');

    // 1. 전체 채팅목록 가져오기 (메인 화면) API
    app.get('/app/chatlist/:kakaoUserIdx', chat.getChatList);

    // 2. 갠톡 or 단톡의 채팅 가져오기 API
    app.get('/app/chat/:kakaoUserIdx', chat.getChats);

    // 3. 폴더의 채팅 가져오기 API
    app.get('/app/chat-folder/:kakaoUserIdx', chat.getFolderChats);

    // 4. 선택한 채팅 삭제하기 API
    app.delete('/app/delete-chat/:kakaoUserIdx', chat.deleteChat);

    // 5. 선택한 채팅목록의 모든 채팅 삭제하기 API
    app.delete('/app/deleteAll-chat/:kakaoUserIdx', chat.deleteAllChat);

    // 6. 채팅 추가하기 API
    app.post('/app/add-chat/:kakaoUserIdx', chat.postChat);

    // 7. 폴더에 채팅 추가하기 API
    app.post('/app/add-chat-folder/:kakaoUserIdx', chat.addChatToFolder);

    // 8. 폴더에 채팅목록의 채팅(개인, 단체) 모두 추가 API
    app.post('/app/add-chats-folder/:kakaoUserIdx', chat.addChatsToFolder);

    // 9. 폴더에서 채팅 삭제 API
    app.delete('/app/delete-chat-folder/:kakaoUserIdx', chat.deleteChatFromFolder);

    // 10. 톡방(채팅/회원) 차단하기
    app.patch('/app/block-chat/:kakaoUserIdx', chat.blockChat);
    
    // 11. 톡방 차단 해제하기
    app.patch('/app/unblock-chat/:kakaoUserIdx', chat.unblockChat);

    // 12. 차단 된 톡방 목록 가져오기
    app.get('/app/blocked-chatlist/:kakaoUserIdx', chat.getBlockedChatlist);
};
