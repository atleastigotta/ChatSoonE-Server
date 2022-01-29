// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 폴더목록 조회
async function selectFolderList(connection, kakaoUserIdx) {
  const selectFolderListQuery = `
          SELECT folderName, folderImg
          FROM FolderInfo
          WHERE kakaoUserIdx = ? AND status != 'HIDDEN';
          `;
  const [folderListRows] = await connection.query(selectFolderListQuery, kakaoUserIdx);
  return folderListRows;
}

// 폴더 추가
async function insertFolderInfo(connection, userIdx) {
    const insertFolderInfoQuery = `
          INSERT INTO FolderInfo (kakaoUserIdx)
          VALUES (?);
          `;
    const insertFolderInfoRow = await connection.query(insertFolderInfoQuery, userIdx);

    return insertFolderInfoRow;
}

// 폴더 존재 확인
async function selectFolder(connection, folderIdx) {
    const selectFolderQuery = `
        SELECT *
        FROM FolderInfo
        WHERE folderIdx = ?;
        `;
    const [selectFolderRow] = await connection.query(selectFolderQuery, folderIdx);

    return selectFolderRow;
}

// 숨김폴더 여부 확인
async function selectHiddenFolder(connection, folderIdx) {
    const selectFolderQuery = `
        SELECT *
        FROM FolderInfo
        WHERE folderIdx = ? AND status = 'HIDDEN';
        `;
    const [selectFolderRow] = await connection.query(selectFolderQuery, folderIdx);

    return selectFolderRow;
}

// 숨김폴더 해제 여부 확인
async function selectUnhiddenFolder(connection, folderIdx) {
    const selectFolderQuery = `
        SELECT *
        FROM FolderInfo
        WHERE folderIdx = ? AND status != 'HIDDEN';
        `;
    const [selectFolderRow] = await connection.query(selectFolderQuery, folderIdx);

    return selectFolderRow;
}

// 폴더 이름 바꾸기
async function changeFolderName(connection, userIdx, folderIdx, folderName) {
  const changeFolderNameQuery = `
          UPDATE FolderInfo
          SET folderName = ?
          WHERE folderIdx = ?;
          `;
  const [changeFolderNameRows] = await connection.query(changeFolderNameQuery, [folderName, folderIdx]);
  return changeFolderNameRows;
}

// 폴더 아이콘 바꾸기
async function changeFolderIcon(connection, userIdx, folderIdx, folderImg) {
  const changeFolderIconQuery = `
          UPDATE FolderInfo
          SET folderImg = ?
          WHERE folderIdx = ?;
          `;
  const [changeFolderIconRows] = await connection.query(changeFolderIconQuery, [folderImg, folderIdx]);
  return changeFolderIconRows;
}

// 폴더 삭제하기
async function deleteFolder(connection, folderIdx) {
    const deleteFolderQuery = `
        DELETE FROM FolderContent
        WHERE folderIdx = ?;
        `
        +
        `
        DELETE FROM FolderInfo
        WHERE folderIdx = ?;
        `;
    const [deleteFolderRows] = await connection.query(deleteFolderQuery, [folderIdx, folderIdx]);
    return deleteFolderRows;
}

// 숨긴 폴더목록 조회
async function selectHiddenFolderList(connection, kakaoUserIdx) {
    const selectHiddenFolderListQuery = `
          SELECT folderName, folderImg
          FROM FolderInfo
          WHERE kakaoUserIdx = ? AND status = 'HIDDEN';
          `;
    const [folderListHiddenRows] = await connection.query(selectHiddenFolderListQuery, kakaoUserIdx);
    return folderListHiddenRows;
}

// 폴더 숨기기
async function hideFolder(connection, folderIdx) {
    const hideFolderQuery = `
        UPDATE FolderInfo
        SET status = 'HIDDEN'
        WHERE folderIdx = ?;
        `;
    const [hideFolderRows] = await connection.query(hideFolderQuery, folderIdx);
    return hideFolderRows;
}

// 폴더 숨김 해제하기
async function unhideFolder(connection, folderIdx) {
    const unhideFolderQuery = `
        UPDATE FolderInfo
        SET status = 'ACTIVE'
        WHERE folderIdx = ?;
        `;
    const [unhideFolderRows] = await connection.query(unhideFolderQuery, folderIdx);
    return unhideFolderRows;
}

module.exports = {
    selectFolderList,
    insertFolderInfo,
    selectFolder,
    selectHiddenFolder,
    selectUnhiddenFolder,
    changeFolderName,
    changeFolderIcon,
    deleteFolder,
    selectHiddenFolderList,
    hideFolder,
    unhideFolder,

};
