// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 채팅목록 조회
async function selectChatList(connection, kakaoUserIdx) {
  const selectChatListQuery = `
          SELECT CL.chatIdx, CL.chatName AS chat_name, CL.profileImg AS profile_image, CL.latestTime AS latest_time, CM.message AS latest_message
          FROM
              (SELECT MAX(C.chatIdx) AS chatIdx,
                      (CASE WHEN C.groupName is null THEN OU.nickname ELSE C.groupName END) AS chatName,
                      (CASE WHEN C.groupName is null THEN OU.profileImgUrl ELSE null END) AS profileImg,
                      MAX(C.postTime) AS latestTime
               FROM Chat C INNER JOIN OtherUser OU ON C.otherUserIdx = OU.otherUserIdx
               WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED'
               GROUP BY chatName, profileImg) CL
                  INNER JOIN
              (SELECT DISTINCT (CASE WHEN C.groupName is null THEN OU.nickname ELSE C.groupName END) AS chatName, C.chatIdx, C.message, C.postTime
               FROM Chat C INNER JOIN OtherUser OU ON C.otherUserIdx = OU.otherUserIdx
               WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED') CM
              ON CL.chatName = CM.chatName AND CL.chatIdx = CM.chatIdx
          ORDER BY latest_time DESC;
          `;
  const [chatListRows] = await connection.query(selectChatListQuery, [kakaoUserIdx, kakaoUserIdx]);
  return chatListRows;
}

// 갠톡 채팅 체크
async function checkPersonalChat(connection, chatIdx) {
    const selectPersonalChatQuery = `
            SELECT *
            FROM Chat
            WHERE groupName is null AND otherUserIdx IN (SELECT otherUserIdx FROM Chat WHERE chatIdx = ?) AND status != 'DELETED';
            `;
    const [chatRows] = await connection.query(selectPersonalChatQuery, chatIdx);
    return chatRows;
}

// 갠톡 채팅 조회
async function selectPersonalChats(connection, userIdx, chatIdx) {
  const selectPersonalChatQuery = `
          SELECT C.chatIdx, OU.nickname, OU.profileImgUrl, C.message, C.postTime AS post_time, C.groupName
                #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED' AND C.otherUserIdx = (SELECT otherUserIdx FROM Chat WHERE chatIdx = ?) AND groupName is null
          ORDER BY C.postTime DESC;
          `;
  const [chatRows] = await connection.query(selectPersonalChatQuery, [userIdx, chatIdx]);
  return chatRows;
}

// 단톡 채팅 체크
async function checkGroupChat(connection, chatIdx) {
    const selectGroupChatQuery = `
        SELECT *
        FROM Chat
        WHERE groupName IN (SELECT groupName FROM Chat WHERE chatIdx = ?) AND status != 'DELETED';
    `;
    const [chatRows] = await connection.query(selectGroupChatQuery, chatIdx);
    return chatRows;
}

// 단톡 채팅 조회
async function selectGroupChats(connection, userIdx, chatIdx) {
  const selectGroupChatQuery = `
          SELECT C.chatIdx, OU.nickname, OU.profileImgUrl, C.message, C.postTime AS post_time, C.groupName
                #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED' AND groupName = (SELECT groupName FROM Chat WHERE chatIdx = ?)
          ORDER BY C.postTime DESC;
          `;
  const [chatRows] = await connection.query(selectGroupChatQuery, [userIdx, chatIdx]);
  return chatRows;
}

// 폴더 채팅 조회
async function selectFolderChats(connection, userIdx, folderIdx) {
  const selectFolderChatQuery = `
          SELECT C.chatIdx, FI.folderName, OU.nickname, OU.profileImgUrl, C.message, C.postTime as post_time
              #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx INNER JOIN FolderContent FC on C.chatIdx = FC.chatIdx INNER JOIN FolderInfo FI on FC.folderIdx = FI.folderIdx
          WHERE OU.kakaoUserIdx = ? AND FC.folderIdx = ? AND C.status != 'DELETED' AND FC.status != 'DELETED'
          ORDER BY C.postTime DESC;
          `;
  const [chatRows] = await connection.query(selectFolderChatQuery, [userIdx, folderIdx]);
  return chatRows;
}

// 채팅 체크
async function selectChat(connection, chatIdx) {
  const selectChatQuery = `
        SELECT *
        FROM Chat 
        WHERE chatIdx = ? AND status != 'DELETED'
        ;
        `;
  const [selectChatRow] = await connection.query(selectChatQuery, chatIdx);

  return selectChatRow;
}

// 갠톡 채팅 체크
async function selectUserChat(connection, userIdx, chatIdx) {
  const selectChatQuery = `
          SELECT *
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.otherUserIdx = (SELECT otherUserIdx FROM Chat WHERE chatIdx = ?) AND C.groupName is null AND C.status != 'DELETED';
          `;
  const selectChatRow = await connection.query(selectChatQuery, [userIdx, chatIdx]);

  return selectChatRow;
}

// 단톡 채팅 체크
async function selectGroupChat(connection, userIdx, chatIdx) {
  const selectChatQuery = `
          SELECT DISTINCT C.groupName
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.groupName = (SELECT groupName FROM Chat WHERE chatIdx = ?) AND C.status != 'DELETED';
          `;
  const selectChatRow = await connection.query(selectChatQuery, [userIdx, chatIdx]);

  return selectChatRow;
}

// 삭제된 채팅 체크
async function selectDeleteChat(connection, chatIdx) {
  const selectDeleteChatQuery = `
        SELECT *
        FROM Chat 
        WHERE chatIdx = ? AND status = 'DELETED';
        `;
  const [selectChatRow] = await connection.query(selectDeleteChatQuery, chatIdx);

  return selectChatRow;
}

// 폴더 채팅 체크
async function selectFolderChat(connection, chatIdx, folderIdx) {
    const selectChatQuery = `
        SELECT *
        FROM Chat C INNER JOIN FolderContent FC on C.chatIdx = FC.chatIdx
        WHERE FC.chatIdx = ? AND FC.folderIdx = ? AND C.status != 'DELETED';
        `;
    const [selectChatRow] = await connection.query(selectChatQuery, [chatIdx, folderIdx]);

    return selectChatRow;
}

// 차단된 갠톡 체크
async function selectBlockedUser(connection, userIdx, otherUserIdx) {
  const selectBlockedUserQuery = `
        SELECT *
        FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
        WHERE OU.kakaoUserIdx = ? AND C.otherUserIdx = ? AND C.groupName is null AND OU.status = 'BLOCKED';
        `;
  const [selectBlockedUserRow] = await connection.query(selectBlockedUserQuery, [userIdx, otherUserIdx]);
  return selectBlockedUserRow;
}

// 차단된 단톡 체크
async function selectBlockedChat(connection, userIdx, groupName) {
  const selectBlockedChatQuery = `
        SELECT *
        FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
        WHERE OU.kakaoUserIdx = ? AND C.groupName = ? AND C.status = 'BLOCKED';
        `;
  const [selectBlockedChatRow] = await connection.query(selectBlockedChatQuery, [userIdx, groupName]);
  return selectBlockedChatRow;
}

// 차단 해제된 갠톡 체크
async function selectUnblockedUser(connection, userIdx, otherUserIdx) {
  const selectUnblockedUserQuery = `
        SELECT *
        FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
        WHERE OU.kakaoUserIdx = ? AND C.otherUserIdx = ? AND C.groupName is null AND OU.status = 'ACTIVE';
        `;
  const [selectUnblockedUserRow] = await connection.query(selectUnblockedUserQuery, [userIdx, otherUserIdx]);
  return selectUnblockedUserRow;
}

// 차단 해제된 단톡 체크
async function selectUnblockedChat(connection, userIdx, groupName) {
  const selectUnblockedChatQuery = `
        SELECT *
        FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
        WHERE OU.kakaoUserIdx = ? AND C.groupName = ? AND C.status = 'ACTIVE';
        `;
  const [selectUnblockedChatRow] = await connection.query(selectUnblockedChatQuery, [userIdx, groupName]);
  return selectUnblockedChatRow;
}

// 채팅 삭제
async function deleteChat(connection, chatIdx) {
  const deleteChatQuery = `
        DELETE FROM Chat
        WHERE chatIdx = ?;
        `;
  const [deleteChatRow] = await connection.query(deleteChatQuery, chatIdx);
  return deleteChatRow;
}

// 폴더에서 채팅 삭제
async function deleteFolderChat(connection, chatIdx) {
    const deleteChatQuery = `
        DELETE FROM FolderContent
        WHERE chatIdx = ?;
        `;
    const [deleteChatRow] = await connection.query(deleteChatQuery, chatIdx);
    return deleteChatRow;
}

// 갠톡 채팅 전체 삭제
async function deleteUserChat(connection, chatIdx) {
  const deleteAllChatsQuery = `
          DELETE FROM Chat
          WHERE otherUserIdx IN
                (SELECT otherUserIdx From (SELECT otherUserIdx FROM Chat WHERE chatIdx = ?) as DChat)
            AND groupName is null;
            `;
  const [deleteChatsRow] = await connection.query(deleteAllChatsQuery, chatIdx);
  return deleteChatsRow;
}

// 단톡 채팅 전체 삭제
async function deleteGroupChat(connection, userIdx, chatIdx) {
  const deleteAllChatsQuery = `
          DELETE FROM Chat
          WHERE groupName IN
                (SELECT groupName FROM (SELECT groupName FROM Chat WHERE chatIdx = ?) as DChat)
            AND otherUserIdx IN
                (SELECT otherUserIdx
                 FROM (SELECT DISTINCT C.otherUserIdx
                       FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
                       WHERE OU.kakaoUserIdx = ?) as UChat);
                       `;
  const [deleteChatsRow] = await connection.query(deleteAllChatsQuery, [chatIdx, userIdx]);
  return deleteChatsRow;
}

// 이미 있는 채팅 상대인지 체크
async function selectExistingUser(connection, userIdx, nickname) {
    const selectExistingUserQuery = `
        SELECT DISTINCT otherUserIdx
        FROM OtherUser
        WHERE kakaoUserIdx = ? AND nickname = ?
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
async function insertChatInfo(connection, userIdx, otherUserIdx, groupName, message, postTime) {
  const insertChatInfoQuery = `
          INSERT INTO Chat (otherUserIdx, groupName, message, postTime)
          VALUES (?, ?, ?, ?);
          `;
  const insertChatInfoRow = await connection.query(insertChatInfoQuery, [otherUserIdx, groupName, message, postTime]);

  return insertChatInfoRow;
}

// 채팅 폴더에 추가
async function putChatToFolder(connection, chatIdx, folderIdx) {
  const putChatToFolderQuery = `
          INSERT INTO FolderContent (folderIdx, chatIdx)
          VALUES (?, ?);
          `;
  const putChatToFolderRow = await connection.query(putChatToFolderQuery, [folderIdx, chatIdx]);

  return putChatToFolderRow;
}

// 갠톡 채팅들 폴더에 추가
async function putChatsToFolder(connection, chatIdx, folderIdx) {
  const putChatsToFolderQuery = `
          INSERT INTO FolderContent (folderIdx, chatIdx)
          SELECT ?, chatIdx
          FROM Chat
          WHERE groupName is null AND status != 'DELETED' AND
          otherUserIdx IN (SELECT otherUserIdx FROM Chat WHERE chatIdx = ?);
          `;
  const putChatsToFolderRow = await connection.query(putChatsToFolderQuery, [folderIdx, chatIdx]);

  return putChatsToFolderRow;
}

// 단톡 채팅들 폴더에 추가
async function putGroupChatsToFolder(connection, userIdx, chatIdx, folderIdx) {
  const putChatsToFolderQuery = `
          INSERT INTO FolderContent (folderIdx, chatIdx)
          SELECT ?, chatIdx
          FROM Chat
          WHERE groupName IN (SELECT groupName FROM Chat WHERE chatIdx = ?) AND
                  otherUserIdx IN (SELECT otherUserIdx FROM OtherUser WHERE kakaoUserIdx = ?);
          `;
  const putChatsToFolderRow = await connection.query(putChatsToFolderQuery, [folderIdx, chatIdx, userIdx]);

  return putChatsToFolderRow;
}

// 채팅 폴더에서 제거
async function removeChatFromFolder(connection, chatIdx, folderIdx) {
  const removeChatFromFolderQuery = `
            DELETE FROM FolderContent
            WHERE folderIdx = ? AND chatIdx = ?;
            `;
  const removeChatFromFolderRow = await connection.query(removeChatFromFolderQuery, [folderIdx, chatIdx]);

  return removeChatFromFolderRow;
}

async function selectUserIdx(connection, userIdx, nickname) {
    const selectUserIdxQuery = `
            SELECT otherUserIdx
            FROM OtherUser
            WHERE kakaoUserIdx = ? AND nickname = ?;
            `;
    const [selectUserIdxRow] = await connection.query(selectUserIdxQuery, [userIdx, nickname]);

    return selectUserIdxRow;
}

// 갠톡 채팅 차단하기
async function blockChat(connection, chatIdx) {
    const blockChatQuery = `
            UPDATE OtherUser
            SET status = 'BLOCKED'
            WHERE otherUserIdx IN (SELECT otherUserIdx FROM Chat WHERE chatIdx = ?);
            `;
    const blockChatRow = await connection.query(blockChatQuery, chatIdx);

    return blockChatRow;
}

// 갠톡 유저 차단하기
async function blockUser(connection, userIdx, nickname) {
    const blockUserQuery = `
            UPDATE OtherUser
            SET status = 'BLOCKED'
            WHERE nickname = ? AND kakaoUserIdx = ? AND status = 'ACTIVE';
            `;
    const blockUserRow = await connection.query(blockUserQuery, [nickname, userIdx]);

    return blockUserRow;
}

// 단톡 채팅 차단하기
async function blockGroupChat(connection, userIdx, groupName) {
    const blockGroupChatQuery = `
            UPDATE Chat
            SET status = 'BLOCKED'
            WHERE groupName = ? AND status = 'ACTIVE' AND
                    otherUserIdx IN (SELECT otherUserIdx FROM OtherUser WHERE kakaoUserIdx = ?);
            `;
    const blockGroupChatRow = await connection.query(blockGroupChatQuery, [groupName, userIdx]);

    return blockGroupChatRow;
}

// 갠톡 채팅 차단 해제하기
async function unblockChat(connection, otherUserIdx) {
    const unblockChatQuery = `
            UPDATE Chat
            SET status = 'ACTIVE'
            WHERE otherUserIdx = ? and groupName is null;
            `;
    const unblockChatRow = await connection.query(unblockChatQuery, otherUserIdx);

    return unblockChatRow;
}

// 갠톡 유저 차단 해제하기
async function unblockUser(connection, userIdx, nickname) {
    const unblockUserQuery = `
            UPDATE OtherUser
            SET status = 'ACTIVE'
            WHERE nickname = ? AND kakaoUserIdx = ? AND status = 'BLOCKED';
            `;
    const unblockUserRow = await connection.query(unblockUserQuery, [nickname, userIdx]);

    return unblockUserRow;
}

// 단톡 채팅 차단 해제하기
async function unblockGroupChat(connection, userIdx, groupName) {
    const unblockGroupChatQuery = `
            UPDATE Chat
            SET status = 'ACTIVE'
            WHERE groupName = ? AND status = 'BLOCKED' AND
                    otherUserIdx IN (SELECT otherUserIdx FROM OtherUser WHERE kakaoUserIdx = ?);
            `;
    const unblockGroupChatRow = await connection.query(unblockGroupChatQuery, [groupName, userIdx]);

    return unblockGroupChatRow;
}

// 차단된 톡방목록 조회
async function selectBlockedChatList(connection, kakaoUserIdx) {
    const selectBlockedChatListQuery = `
            SELECT DISTINCT OU.nickname AS blocked_name, OU.profileImgUrl AS blocked_profileImg, C.groupName AS groupName, OU.status AS status
            FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
            WHERE OU.kakaoUserIdx = ? AND OU.status = 'BLOCKED' AND C.groupName is null
            UNION
            SELECT DISTINCT C.groupName AS blocked_name, null AS blocked_profileImg, C.groupName AS groupName, C.status AS status
            FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
            WHERE OU.kakaoUserIdx = ? AND C.status = 'BLOCKED' AND C.groupName is not null;
            `;
    const [blockedChatListRows] = await connection.query(selectBlockedChatListQuery, [kakaoUserIdx, kakaoUserIdx]);
    return blockedChatListRows;
}

module.exports = {
    selectChatList,
    checkPersonalChat,
    selectPersonalChats,
    checkGroupChat,
    selectGroupChats,
    selectFolderChats,
    selectChat,
    selectUserChat,
    selectGroupChat,
    selectDeleteChat,
    selectFolderChat,
    selectBlockedUser,
    selectBlockedChat,
    deleteChat,
    deleteFolderChat,
    deleteUserChat,
    deleteGroupChat,
    selectExistingUser,
    insertNewUserInfo,
    insertChatInfo,
    putChatToFolder,
    putChatsToFolder,
    putGroupChatsToFolder,
    removeChatFromFolder,
    selectUserIdx,
    blockChat,
    blockUser,
    blockGroupChat,
    selectUnblockedUser,
    selectUnblockedChat,
    unblockChat,
    unblockUser,
    unblockGroupChat,
    selectBlockedChatList,
};
