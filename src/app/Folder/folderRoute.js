const folder = require("./folderController");
module.exports = function(app){
    const folder = require('./folderController');

    // 1. 전체 폴더목록 가져오기 (숨김폴더 제외) API
    app.get('/app/folderlist/:kakaoUserIdx', folder.getFolderList);

    // 2. 폴더 생성하기
    app.post('/app/add-folder/:kakaoUserIdx', folder.postFolder);

    // 3. 폴더 이름 바꾸기
    app.patch('/app/folder-change-name/:kakaoUserIdx', folder.patchFolderName);

    // 4. 폴더 아이콘 바꾸기
    app.patch('/app/folder-change-icon/:kakaoUserIdx', folder.patchFolderIcon);

    // 5. 폴더 삭제하기 (그 안에 채팅도 없어짐)
    app.delete('/app/delete-folder/:kakaoUserIdx', folder.deleteFolder);

    // 6. 숨김 폴더목록 가져오기
    app.get('/app/folderlist-hidden/:kakaoUserIdx', folder.getHiddenFolderList);

    // 7. 폴더 숨기기
    app.patch('/app/hide-folder/:kakaoUserIdx', folder.patchHideFolder);

    // 8. 숨김 폴더 다시 해제하기
    app.patch('/app/unhide-folder/:kakaoUserIdx', folder.patchUnhideFolder);

};
