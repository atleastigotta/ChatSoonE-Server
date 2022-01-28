module.exports = function(app){
    const folder = require('./folderController');

    // 1. 전체 폴더목록 가져오기 API
    app.get('/app/folderlist/:kakaoUserIdx', folder.getfolderList);

    // 폴더 생성하기
    // 폴더 이름 바꾸기
    // 폴더 아이콘 바꾸기
    // 폴더 삭제하기 (그 안에 채팅도 없어짐)
    // 숨김 폴더목록 가져오기
    // 폴더 숨기기
    // 숨김 폴더 다시 해제하기
};
