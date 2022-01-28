// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 채팅목록 조회
async function selectfolderList(connection, kakaoUserIdx) {
  const selectfolderListQuery = `
          SELECT CL.folderName AS folder_name, CL.profileImg AS profile_image, CL.latestTime AS latest_time, CM.message AS latest_message
          FROM
              (SELECT (CASE WHEN C.groupName is null THEN OU.nickname ELSE C.groupName END) AS folderName,
                      (CASE WHEN C.groupName is null THEN OU.profileImgUrl ELSE null END) AS profileImg,
                      MAX(C.postTime) as latestTime
               FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
               WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED'
               GROUP BY folderName, profileImg) CL
                  INNER JOIN
              (SELECT DISTINCT (CASE WHEN C.groupName is null THEN OU.nickname ELSE C.groupName END) AS folderName, C.message, C.postTime
               FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
               WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED') CM
              ON CL.folderName = CM.folderName AND CL.latestTime = CM.postTime
          ORDER BY latest_time DESC;
          `;
  const [folderListRows] = await connection.query(selectfolderListQuery, [kakaoUserIdx, kakaoUserIdx]);
  return folderListRows;
}

// 갠톡 채팅 조회
async function selectPersonalfolders(connection, userIdx, otherUserIdx) {
  const selectPersonalfolderQuery = `
          SELECT OU.nickname, OU.profileImgUrl, C.message,
                 (CASE
                    WHEN TIMESTAMPDIFF(DAY, C.postTime, NOW()) >= 1 THEN C.postTime
                    ELSE null
                   END) AS folder_date,
                 C.postTime AS post_time
            #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED' AND C.otherUserIdx = ? AND groupName is null
          ORDER BY C.postTime DESC;
          `;
  const [folderRows] = await connection.query(selectPersonalfolderQuery, [userIdx, otherUserIdx]);
  return folderRows;
}

// 단톡 채팅 조회
async function selectGroupfolders(connection, userIdx, groupName) {
  const selectGroupfolderQuery = `
          SELECT OU.nickname, OU.profileImgUrl, C.message,
                 (CASE
                    WHEN TIMESTAMPDIFF(DAY, C.postTime, NOW()) >= 1 THEN C.postTime
                    ELSE null
                   END) AS folder_date,
                 C.postTime AS post_time
            #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED' AND groupName = ?
          ORDER BY C.postTime DESC;
          `;
  const [folderRows] = await connection.query(selectGroupfolderQuery, [userIdx, groupName]);
  return folderRows;
}

// 폴더 채팅 조회
async function selectFolderfolders(connection, userIdx, folderIdx) {
  const selectFolderfolderQuery = `
          SELECT FI.folderName, OU.nickname, OU.profileImgUrl, C.message,
                 (CASE
                      WHEN TIMESTAMPDIFF(DAY, C.postTime, NOW()) >= 1 THEN C.postTime
                      ELSE null
                     END) AS folder_date,
                 C.postTime as post_time
              #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx INNER JOIN FolderContent FC on C.folderIdx = FC.folderIdx INNER JOIN FolderInfo FI on FC.folderIdx = FI.folderIdx
          WHERE OU.kakaoUserIdx = ? AND FC.folderIdx = ? AND C.status != 'DELETED' AND FC.status != 'DELETED'
          ORDER BY C.postTime DESC;
          `;
  const [folderRows] = await connection.query(selectFolderfolderQuery, [userIdx, folderIdx]);
  return folderRows;
}

// 채팅 체크
async function selectfolder(connection, folderIdx) {
  const selectfolderQuery = `
        SELECT *
        FROM folder 
        WHERE folderIdx = ? AND status != 'DELETED'
        ;
        `;
  const [selectfolderRow] = await connection.query(selectfolderQuery, folderIdx);

  return selectfolderRow;
}

// 갠톡 채팅 체크
async function selectUserfolder(connection, userIdx, otherUserIdx) {
  const selectfolderQuery = `
          SELECT *
          FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.otherUserIdx = ? AND C.groupName is null AND C.status != 'DELETED';
          `;
  const [selectfolderRow] = await connection.query(selectfolderQuery, [userIdx, otherUserIdx]);

  return selectfolderRow;
}

// 단톡 채팅 체크
async function selectGroupfolder(connection, userIdx, groupName) {
  const selectfolderQuery = `
          SELECT *
          FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.groupName = ? AND C.status != 'DELETED';
          `;
  const [selectfolderRow] = await connection.query(selectfolderQuery, [userIdx, groupName]);

  return selectfolderRow;
}

// 삭제된 채팅 체크
async function selectDeletefolder(connection, folderIdx) {
  const selectDeletefolderQuery = `
        SELECT *
        FROM folder 
        WHERE folderIdx = ? AND status = 'DELETED';
        `;
  const [selectfolderRow] = await connection.query(selectDeletefolderQuery, folderIdx);

  return selectfolderRow;
}

// 폴더 채팅 체크
async function selectFolderfolder(connection, folderIdx, folderIdx) {
    const selectfolderQuery = `
        SELECT *
        FROM folder C INNER JOIN FolderContent FC on C.folderIdx = FC.folderIdx
        WHERE FC.folderIdx = ? AND FC.folderIdx = ? AND C.status != 'DELETED';
        `;
    const [selectfolderRow] = await connection.query(selectfolderQuery, [folderIdx, folderIdx]);

    return selectfolderRow;
}

// 차단된 갠톡 체크
async function selectBlockedUser(connection, userIdx, otherUserIdx) {
  const selectBlockedUserQuery = `
        SELECT *
        FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
        WHERE OU.kakaoUserIdx = ? AND C.otherUserIdx = ? AND C.groupName is null AND C.status = 'BLOCKED';
        `;
  const [selectBlockedUserRow] = await connection.query(selectBlockedUserQuery, [userIdx, otherUserIdx]);
  return selectBlockedUserRow;
}

// 차단된 단톡 체크
async function selectBlockedfolder(connection, userIdx, groupName) {
  const selectBlockedfolderQuery = `
        SELECT *
        FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
        WHERE OU.kakaoUserIdx = ? AND C.groupName = ? AND C.status = 'BLOCKED';
        `;
  const [selectBlockedfolderRow] = await connection.query(selectBlockedfolderQuery, [userIdx, groupName]);
  return selectBlockedfolderRow;
}

// 채팅 삭제
async function deletefolder(connection, folderIdx) {
  const deletefolderQuery = `
        DELETE FROM folder
        WHERE folderIdx = ?;
        `;
  const [deletefolderRow] = await connection.query(deletefolderQuery, folderIdx);
  return deletefolderRow;
}

// 갠톡 채팅 전체 삭제
async function deleteUserfolder(connection, otherUserIdx) {
  const deleteAllfoldersQuery = `
        DELETE FROM folder
        WHERE otherUserIdx = ? AND groupName is null;
        `;
  const [deletefoldersRow] = await connection.query(deleteAllfoldersQuery, otherUserIdx);
  return deletefoldersRow;
}

// 단톡 채팅 전체 삭제
async function deleteGroupfolder(connection, userIdx, groupName) {
  const deleteAllfoldersQuery = `
        DELETE FROM folder
        WHERE groupName = ? AND otherUserIdx IN (SELECT CD.otherUserIdx
                                                   FROM (SELECT C.otherUserIdx
                                                         FROM folder C INNER JOIN OtherUser OU ON C.otherUserIdx = OU.otherUserIdx
                                                         WHERE OU.kakaoUserIdx = ? AND C.groupName = ?) CD
        );
        `;
  const [deletefoldersRow] = await connection.query(deleteAllfoldersQuery, [groupName, userIdx, groupName]);
  return deletefoldersRow;
}

// 이미 있는 채팅 상대인지 체크
async function selectExistingUser(connection, userIdx, nickname) {
    const selectExistingUserQuery = `
        SELECT DISTINCT C.otherUserIdx
        FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
        WHERE OU.kakaoUserIdx = ? AND OU.nickname = ? AND C.status = 'ACTIVE';
        `;
    const [selectExistingUserRow] = await connection.query(selectExistingUserQuery, [userIdx, nickname]);
    return selectExistingUserRow;
}

// 신규 채팅 상대 추가
async function insertNewUserInfo(connection, userIdx, nickname, profileImgUrl) {
    const insertNewUserInfoQuery = `
          INSERT INTO OtherUser (kakaoUserIdx, nickname, profileImgUrl)
          VALUES (?, ?, ?);
          `;
    const insertNewUserInfoRow = await connection.query(insertNewUserInfoQuery, [userIdx, nickname, profileImgUrl]);

    return insertNewUserInfoRow;
}

// 채팅 추가
async function insertfolderInfo(connection, userIdx, otherUserIdx, groupName, message, postTime) {
  const insertfolderInfoQuery = `
          INSERT INTO folder (otherUserIdx, groupName, message, postTime)
          VALUES (?, ?, ?, ?);
          `;
  const insertfolderInfoRow = await connection.query(insertfolderInfoQuery, [otherUserIdx, groupName, message, postTime]);

  return insertfolderInfoRow;
}

// 채팅 폴더에 추가
async function putfolderToFolder(connection, folderIdx, folderIdx) {
  const putfolderToFolderQuery = `
          INSERT INTO FolderContent (folderIdx, folderIdx)
          VALUES (?, ?);
          `;
  const putfolderToFolderRow = await connection.query(putfolderToFolderQuery, [folderIdx, folderIdx]);

  return putfolderToFolderRow;
}

// 갠톡 채팅들 폴더에 추가
async function putfoldersToFolder(connection, otherUserIdx, folderIdx) {
  const putfoldersToFolderQuery = `
          INSERT INTO FolderContent (folderIdx, folderIdx)
          SELECT ?, folderIdx
          FROM folder
          WHERE otherUserIdx = ? AND groupName is null;
          `;
  const putfoldersToFolderRow = await connection.query(putfoldersToFolderQuery, [folderIdx, otherUserIdx]);

  return putfoldersToFolderRow;
}

// 단톡 채팅들 폴더에 추가
async function putGroupfoldersToFolder(connection, userIdx, groupName, folderIdx) {
  const putfoldersToFolderQuery = `
          INSERT INTO FolderContent (folderIdx, folderIdx)
          SELECT ?, folderIdx
          FROM folder C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.groupName = ?;
          `;
  const putfoldersToFolderRow = await connection.query(putfoldersToFolderQuery, [folderIdx, userIdx, groupName]);

  return putfoldersToFolderRow;
}

// 채팅 폴더에서 제거
async function removefolderFromFolder(connection, folderIdx, folderIdx) {
  const removefolderFromFolderQuery = `
            DELETE FROM FolderContent
            WHERE folderIdx = ? AND folderIdx = ?;
            `;
  const removefolderFromFolderRow = await connection.query(removefolderFromFolderQuery, [folderIdx, folderIdx]);

  return removefolderFromFolderRow;
}


module.exports = {
    selectfolderList,
    selectPersonalfolders,
    selectGroupfolders,
    selectFolderfolders,
    selectfolder,
    selectUserfolder,
    selectGroupfolder,
    selectDeletefolder,
    selectFolderfolder,
    selectBlockedUser,
    selectBlockedfolder,
    deletefolder,
    deleteUserfolder,
    deleteGroupfolder,
    selectExistingUser,
    insertNewUserInfo,
    insertfolderInfo,
    putfolderToFolder,
    putfoldersToFolder,
    putGroupfoldersToFolder,
    removefolderFromFolder,

};
