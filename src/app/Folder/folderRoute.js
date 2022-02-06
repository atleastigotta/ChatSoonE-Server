const folder = require("./folderController");
module.exports = function(app){
    const folder = require('./folderController');

    // 1. 전체 폴더목록 가져오기 (숨김폴더 제외) API
    // app.get('/app/folderlist/:kakaoUserIdx', folder.getFolderList);
    app.get('/app/folders/:kakaoUserIdx/folderlist', folder.getFolderList);

    // 2. 폴더 생성하기
    // app.post('/app/add-folder/:kakaoUserIdx', folder.postFolder);
    app.post('/app/folders/:kakaoUserIdx/folder', folder.postFolder);

    // 3. 폴더 이름 바꾸기
    // app.patch('/app/folder-change-name/:kakaoUserIdx', folder.patchFolderName);
    app.patch('/app/folders/:kakaoUserIdx/name', folder.patchFolderName);

    // 4. 폴더 아이콘 바꾸기
    // app.patch('/app/folder-change-icon/:kakaoUserIdx', folder.patchFolderIcon);
    app.patch('/app/folders/:kakaoUserIdx/icon', folder.patchFolderIcon);

    // 5. 폴더 삭제하기 (그 안에 채팅도 없어짐)
    // app.delete('/app/delete-folder/:kakaoUserIdx', folder.deleteFolder);
    app.delete('/app/folders/:kakaoUserIdx/folder', folder.deleteFolder);

    // 6. 숨김 폴더목록 가져오기
    // app.get('/app/folderlist-hidden/:kakaoUserIdx', folder.getHiddenFolderList);
    app.get('/app/folders/:kakaoUserIdx/hidden-folderlist', folder.getHiddenFolderList);

    // 7. 폴더 숨기기
    // app.patch('/app/hide-folder/:kakaoUserIdx', folder.patchHideFolder);
    app.patch('/app/folders/:kakaoUserIdx/hide', folder.patchHideFolder);

    // 8. 숨김 폴더 다시 해제하기
    // app.patch('/app/unhide-folder/:kakaoUserIdx', folder.patchUnhideFolder);
    app.patch('/app/folders/:kakaoUserIdx/unhide', folder.patchUnhideFolder);

};
