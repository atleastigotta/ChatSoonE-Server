const folderProvider = require("./folderProvider");
const folderService = require("./folderService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 전체 폴더목록 가져오기 (숨김폴더 제외) API
 * [GET] /app/folderlist/{kakaoUserIdx}
 */
exports.getFolderList = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String:
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));

    const folderListResponse = await folderProvider.retrieveFolderList(userIdx);

    return res.send(response(baseResponse.SUCCESS, folderListResponse));
};

/**
 * API No. 2
 * API Name : 폴더 생성하기 API
 * [POST] /app/add-folder/{kakaoUserIdx}
 */
exports.postFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String:
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));

    const addFolderResponse = await folderService.addFolder(userIdx);
    return res.send(addFolderResponse);
};

/**
 * API No. 3
 * API Name : 폴더 이름 바꾸기 API
 * [PATCH] /app/folder-change-name/{kakaoUserIdx}
 */
exports.patchFolderName = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: folderIdx
     * Header:
     * Body: folderName
     */
    const userIdx = req.params.kakaoUserIdx;
    const folderIdx = req.query.folderIdx;
    const folderName = req.body.folderName;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));
    if (!folderName)
        return res.send(response(baseResponse.FOLDER_NAME_EMPTY));

    const changeFolderNameResult = await folderService.editFolderName(userIdx, folderIdx, folderName);
    return res.send(changeFolderNameResult);
};

/**
 * API No. 4
 * API Name : 폴더 아이콘 바꾸기 API
 * [PATCH] /app/folder-change-icon/{kakaoUserIdx}
 */
exports.patchFolderIcon = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: folderIdx
     * Header:
     * Body: folderImg
     */
    const userIdx = req.params.kakaoUserIdx;
    const folderIdx = req.query.folderIdx;
    const folderImg = req.body.folderImg;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));
    if (!folderImg)
        return res.send(response(baseResponse.FOLDER_ICON_EMPTY));

    const changeFolderIconResult = await folderService.editFolderIcon(userIdx, folderIdx, folderImg);
    return res.send(changeFolderIconResult);
};

/**
 * API No. 5
 * API Name : 폴더 삭제하기 API
 * [DELETE] /app/delete-folder/{kakaoUserIdx}
 */
exports.deleteFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: folderIdx
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const folderIdx = req.query.folderIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));

    const deleteFolderResult = await folderService.deleteFolder(userIdx, folderIdx);
    return res.send(deleteFolderResult);
};

/**
 * API No. 6
 * API Name : 숨김 폴더목록 가져오기 API
 * [GET] /app/folderlist-hidden/{kakaoUserIdx}
 */
exports.getHiddenFolderList = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String:
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));

    const folderListHiddenResponse = await folderProvider.retrieveHiddenFolderList(userIdx);

    return res.send(response(baseResponse.SUCCESS, folderListHiddenResponse));
};

/**
 * API No. 7
 * API Name : 폴더 숨기기 API
 * [DELETE] /app/hide-folder/{kakaoUserIdx}
 */
exports.patchHideFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: folderIdx
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const folderIdx = req.query.folderIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));

    const hideFolderResult = await folderService.hideFolder(userIdx, folderIdx);
    return res.send(hideFolderResult);
};

/**
 * API No. 8
 * API Name : 숨김 폴더 다시 해제하기 API
 * [DELETE] /app/unhide-folder/{kakaoUserIdx}
 */
exports.patchUnhideFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: folderIdx
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const folderIdx = req.query.folderIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));

    const unhideFolderResult = await folderService.unhideFolder(userIdx, folderIdx);
    return res.send(unhideFolderResult);
};
