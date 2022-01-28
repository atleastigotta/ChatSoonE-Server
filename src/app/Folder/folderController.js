const folderProvider = require("../../app/folder/folderProvider");
const folderService = require("../../app/folder/folderService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * API No. 1
 * API Name : 전체 채팅목록 가져오기 (메인 화면) API
 * [GET] /app/folderlist/{kakaoUserIdx}
 */
exports.getfolderList = async function (req, res) {
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

    const folderListResponse = await folderProvider.retrievefolderList(userIdx);

    // folderListResponse 값을 json으로 전달
    return res.send(response(baseResponse.SUCCESS, folderListResponse));
};

/**
 * API No. 2
 * API Name : 갠톡 or 단톡의 채팅 가져오기 API
 * [GET] /app/folder/{kakaoUserIdx}
 */
exports.getfolders = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: otherUserIdx, groupName
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const otherUserIdx = req.query.otherUserIdx;
    const groupName = req.query.groupName;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!otherUserIdx && !groupName)
        return res.send(response(baseResponse.folder_OPPONENT_EMPTY));
    else if (otherUserIdx && groupName)
        return res.send(response(baseResponse.folder_OPPONENT_INVALID));

    if (otherUserIdx && !groupName) {
        // 갠톡 채팅 내용 조회
        const personalfolderListResult = await folderProvider.retrievePersonalfolders(userIdx, otherUserIdx);
        return res.send(response(baseResponse.SUCCESS, personalfolderListResult));
    } else if (!otherUserIdx && groupName) {
        // 단톡 채팅 내용 조회
        const groupfolderListResult = await folderProvider.retrieveGroupfolders(userIdx, groupName);
        return res.send(response(baseResponse.SUCCESS, groupfolderListResult));
    }
};

/**
 * API No. 3
 * API Name : 폴더의 채팅 가져오기 API
 * [GET] /app/folder-folder/{kakaoUserIdx}
 */
exports.getFolderfolders = async function (req, res) {
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
    else {
        // 해당 폴더의 채팅 내용 조회
        const folderfolderListResult = await folderProvider.retrieveFolderfolders(userIdx, folderIdx);
        return res.send(response(baseResponse.SUCCESS, folderfolderListResult));
    }
};

/**
 * API No. 4
 * API Name : 선택한 채팅 삭제하기 API
 * [DELETE] /app/delete-folder/{kakaoUserIdx}
 */
exports.deletefolder = async function (req, res) {
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
        return res.send(response(baseResponse.folder_ID_EMPTY));
    else {
        // 해당 채팅 삭제
        const deletefolderResult = await folderService.deletefolder(userIdx, folderIdx);
        return res.send(deletefolderResult);
    }
};

/**
 * API No. 5
 * API Name : 선택한 채팅목록의 모든 채팅 삭제하기 API
 * [DELETE] /app/deleteAll-folder/{kakaoUserIdx}
 */
exports.deleteAllfolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: otherUserIdx, groupName
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const otherUserIdx = req.query.otherUserIdx;
    const groupName = req.query.groupName;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!otherUserIdx && !groupName)
        return res.send(response(baseResponse.folder_OPPONENT_EMPTY));
    else if (otherUserIdx && groupName)
        return res.send(response(baseResponse.folder_OPPONENT_INVALID));

    if (otherUserIdx && !groupName) {
        // 갠톡 채팅 내용 삭제
        const deletePersonalfolderResult = await folderService.deletePersonalfolders(userIdx, otherUserIdx);
        return res.send(deletePersonalfolderResult);
    } else if (!otherUserIdx && groupName) {
        // 단톡 채팅 내용 삭제
        const deleteGroupfolderResult = await folderService.deleteGroupfolders(userIdx, groupName);
        return res.send(deleteGroupfolderResult);
    }
};

/**
 * API No. 6
 * API Name : 채팅 추가하기 API
 * [POST] /app/add-folder/{kakaoUserIdx}
 */
exports.postfolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String:
     * Header:
     * Body: nickname, groupName, profileImgUrl, message, postTime
     */
    const userIdx = req.params.kakaoUserIdx;
    const {nickname, groupName, profileImgUrl, message, postTime} = req.body;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!nickname)
        return res.send(response(baseResponse.folder_OPPONENT_NICKNAME_EMPTY));
    if (!message)
        return res.send(response(baseResponse.MESSAGE_EMPTY));
    if (!postTime)
        return res.send(response(baseResponse.POST_TIME_EMPTY));

    const addfolderResponse = await folderService.addfolder(userIdx, nickname, groupName, profileImgUrl, message, postTime);

    return res.send(addfolderResponse);
};

/**
 * API No. 7
 * API Name : 폴더에 채팅 추가하기 API
 * [POST] /app/add-folder-folder/{kakaoUserIdx}
 */
exports.addfolderToFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: folderIdx
     * Header:
     * Body: folderIdx
     */
    const userIdx = req.params.kakaoUserIdx;
    const folderIdx = req.query.folderIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.folder_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));

    const addfolderFolderResponse = await folderService.addfolderFolder(userIdx, folderIdx, folderIdx);

    return res.send(addfolderFolderResponse);
};

/**
 * API No. 8
 * API Name : 폴더에 채팅목록 추가하기 API
 * [POST] /app/add-folders-folder/{kakaoUserIdx}
 */
exports.addfoldersToFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: otherUserIdx, groupName
     * Header:
     * Body: folderIdx
     */
    const userIdx = req.params.kakaoUserIdx;
    const otherUserIdx = req.query.otherUserIdx;
    const groupName = req.query.groupName;
    const folderIdx = req.body.folderIdx;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));
    if (!otherUserIdx && !groupName)
        return res.send(response(baseResponse.folder_OPPONENT_EMPTY));
    else if (otherUserIdx && groupName)
        return res.send(response(baseResponse.folder_OPPONENT_INVALID));

    const addfoldersFolderResponse = await folderService.addfoldersFolder(userIdx, otherUserIdx, groupName, folderIdx);

    return res.send(addfoldersFolderResponse);
};

/**
 * API No. 9
 * API Name : 폴더에서 채팅 삭제 API
 * [DELETE] /app/delete-folder-folder/{kakaoUserIdx}
 */
exports.deletefolderFromFolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: folderIdx, folderIdx
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
        return res.send(response(baseResponse.folder_ID_EMPTY));
    if (!folderIdx)
        return res.send(response(baseResponse.FOLDER_ID_EMPTY));

    const deletefolderFolderResponse = await folderService.deletefolderFolder(userIdx, folderIdx, folderIdx);

    return res.send(deletefolderFolderResponse);
};


/**
 * API No. 10
 * API Name : 채팅목록 차단하기 API
 * [PATCH] /app/block-folder/{kakaoUserIdx}
 */
exports.blockfolder = async function (req, res) {
    /**
     * Path Variable: kakaoUserIdx
     * Query String: folderName
     * Header:
     * Body:
     */
    const userIdx = req.params.kakaoUserIdx;
    const folderName = req.query.folderName;

    // --형식 체크--
    // 빈 값 체크
    if (!userIdx)
        return res.send(response(baseResponse.USER_ID_EMPTY));
    if (!folderName)
        return res.send(response(baseResponse.folder_NAME_EMPTY));

    const blockfolderResponse = await folderService.blockfolder(userIdx, folderName);

    return res.send(blockfolderResponse);
};



// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    const signInResponse = await folderService.postSignIn(email, password);

    return res.send(signInResponse);
};

/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/folders/:folderId
 * path variable : folderId
 * body : nickname
 */
exports.patchfolders = async function (req, res) {

    // jwt - folderId, path variable :folderId

    const folderIdFromJWT = req.verifiedToken.folderId

    const folderId = req.params.folderId;
    const nickname = req.body.nickname;

    // JWT는 이 후 주차에 다룰 내용
    if (folderIdFromJWT != folderId) {
        res.send(errResponse(baseResponse.folder_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.folder_NICKNAME_EMPTY));

        const editfolderInfo = await folderService.editfolder(folderId, nickname)
        return res.send(editfolderInfo);
    }
};






// JWT 이 후 주차에 다룰 내용
/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const folderIdResult = req.verifiedToken.folderId;
    console.log(folderIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};
