// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 채팅목록 조회
async function selectChatList(connection, kakaoUserIdx) {
  const selectChatListQuery = `
          SELECT CM.chatIdx, CL.chatName AS chat_name, CL.profileImg AS profile_image, CL.latestTime AS latest_time, CM.message AS latest_message, CM.groupName
          FROM
              (SELECT (CASE WHEN C.groupName is null THEN OU.nickname ELSE C.groupName END) AS chatName,
                      (CASE WHEN C.groupName is null THEN OU.profileImgUrl ELSE null END) AS profileImg,
                      MAX(C.postTime) as latestTime
               FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
               WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED'
               GROUP BY chatName, profileImg) CL
                  INNER JOIN
              (SELECT DISTINCT (CASE WHEN C.groupName is null THEN OU.nickname ELSE C.groupName END) AS chatName, C.chatIdx, C.message, C.postTime, C.groupName
               FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
               WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED') CM
              ON CL.chatName = CM.chatName AND CL.latestTime = CM.postTime
          ORDER BY latest_time DESC;
          `;
  const [chatListRows] = await connection.query(selectChatListQuery, [kakaoUserIdx, kakaoUserIdx]);
  return chatListRows;
}

// 갠톡 채팅 체크
async function checkPersonalChat(connection, userIdx, chatIdx) {
    const selectPersonalChatQuery = `
          SELECT *
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED' AND C.chatIdx = ? AND groupName is null;
          `;
    const [chatRows] = await connection.query(selectPersonalChatQuery, [userIdx, chatIdx]);
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
async function checkGroupChat(connection, userIdx, chatIdx) {
    const selectGroupChatQuery = `
        SELECT *
        FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
        WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED' AND groupName is not null;
    `;
    const [chatRows] = await connection.query(selectGroupChatQuery, [userIdx, chatIdx]);
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
          SELECT FI.folderName, OU.nickname, OU.profileImgUrl, C.message, C.postTime as post_time
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
async function selectUserChat(connection, userIdx, otherUserIdx) {
  const selectChatQuery = `
          SELECT *
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.otherUserIdx = ? AND C.groupName is null AND C.status != 'DELETED';
          `;
  const [selectChatRow] = await connection.query(selectChatQuery, [userIdx, otherUserIdx]);

  return selectChatRow;
}

// 단톡 채팅 체크
async function selectGroupChat(connection, userIdx, groupName) {
  const selectChatQuery = `
          SELECT *
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.groupName = ? AND C.status != 'DELETED';
          `;
  const [selectChatRow] = await connection.query(selectChatQuery, [userIdx, groupName]);

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
        WHERE OU.kakaoUserIdx = ? AND C.otherUserIdx = ? AND C.groupName is null AND C.status = 'BLOCKED';
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
        WHERE OU.kakaoUserIdx = ? AND C.otherUserIdx = ? AND C.groupName is null AND C.status = 'ACTIVE';
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

// 갠톡 채팅 전체 삭제
async function deleteUserChat(connection, otherUserIdx) {
  const deleteAllChatsQuery = `
        DELETE FROM Chat
        WHERE otherUserIdx = ? AND groupName is null;
        `;
  const [deleteChatsRow] = await connection.query(deleteAllChatsQuery, otherUserIdx);
  return deleteChatsRow;
}

// 단톡 채팅 전체 삭제
async function deleteGroupChat(connection, userIdx, groupName) {
  const deleteAllChatsQuery = `
        DELETE FROM Chat
        WHERE groupName = ? AND otherUserIdx IN (SELECT CD.otherUserIdx
                                                   FROM (SELECT C.otherUserIdx
                                                         FROM Chat C INNER JOIN OtherUser OU ON C.otherUserIdx = OU.otherUserIdx
                                                         WHERE OU.kakaoUserIdx = ? AND C.groupName = ?) CD
        );
        `;
  const [deleteChatsRow] = await connection.query(deleteAllChatsQuery, [groupName, userIdx, groupName]);
  return deleteChatsRow;
}

// 이미 있는 채팅 상대인지 체크
async function selectExistingUser(connection, userIdx, nickname) {
    const selectExistingUserQuery = `
        SELECT DISTINCT C.otherUserIdx
        FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
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
async function putChatsToFolder(connection, otherUserIdx, folderIdx) {
  const putChatsToFolderQuery = `
          INSERT INTO FolderContent (folderIdx, chatIdx)
          SELECT ?, chatIdx
          FROM Chat
          WHERE otherUserIdx = ? AND groupName is null;
          `;
  const putChatsToFolderRow = await connection.query(putChatsToFolderQuery, [folderIdx, otherUserIdx]);

  return putChatsToFolderRow;
}

// 단톡 채팅들 폴더에 추가
async function putGroupChatsToFolder(connection, userIdx, groupName, folderIdx) {
  const putChatsToFolderQuery = `
          INSERT INTO FolderContent (folderIdx, chatIdx)
          SELECT ?, chatIdx
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.groupName = ?;
          `;
  const putChatsToFolderRow = await connection.query(putChatsToFolderQuery, [folderIdx, userIdx, groupName]);

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

// 갠톡 채팅 차단하기
async function blockChat(connection, otherUserIdx) {
    const blockChatQuery = `
            UPDATE Chat
            SET status = 'BLOCKED'
            WHERE otherUserIdx = ? and groupName is null;
            `;
    const blockChatRow = await connection.query(blockChatQuery, otherUserIdx);

    return blockChatRow;
}

// 갠톡 유저 차단하기
async function blockUser(connection, otherUserIdx) {
    const blockUserQuery = `
            UPDATE OtherUser
            SET status = 'BLOCKED'
            WHERE otherUserIdx = ?
            `;
    const blockUserRow = await connection.query(blockUserQuery, otherUserIdx);

    return blockUserRow;
}

// 단톡 채팅 차단하기
async function blockGroupChat(connection, userIdx, groupName) {
    const blockGroupChatQuery = `
            UPDATE Chat
            SET status = 'BLOCKED'
            WHERE  groupName = ?
              AND otherUserIdx IN (SELECT otherUserIdx FROM OtherUser WHERE kakaoUserIdx = ?);
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
async function unblockUser(connection, otherUserIdx) {
    const unblockUserQuery = `
            UPDATE OtherUser
            SET status = 'ACTIVE'
            WHERE otherUserIdx = ?
            `;
    const unblockUserRow = await connection.query(unblockUserQuery, otherUserIdx);

    return unblockUserRow;
}

// 단톡 채팅 차단 해제하기
async function unblockGroupChat(connection, userIdx, groupName) {
    const unblockGroupChatQuery = `
            UPDATE Chat
            SET status = 'ACTIVE'
            WHERE  groupName = ?
              AND otherUserIdx IN (SELECT otherUserIdx FROM OtherUser WHERE kakaoUserIdx = ?);
            `;
    const unblockGroupChatRow = await connection.query(unblockGroupChatQuery, [groupName, userIdx]);

    return unblockGroupChatRow;
}

// 차단된 톡방목록 조회
async function selectBlockedChatList(connection, kakaoUserIdx) {
    const selectBlockedChatListQuery = `
            SELECT (CASE WHEN C.groupName is null THEN OU.nickname ELSE C.groupName END) AS blocked_name,
                   (CASE WHEN C.groupName is null THEN OU.profileImgUrl ELSE null END) AS blocked_profileImg
            FROM OtherUser OU INNER JOIN Chat C on OU.otherUserIdx = C.otherUserIdx
            WHERE OU.kakaoUserIdx = ? AND C.status = 'BLOCKED';
            `;
    const [blockedChatListRows] = await connection.query(selectBlockedChatListQuery, kakaoUserIdx);
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
    deleteUserChat,
    deleteGroupChat,
    selectExistingUser,
    insertNewUserInfo,
    insertChatInfo,
    putChatToFolder,
    putChatsToFolder,
    putGroupChatsToFolder,
    removeChatFromFolder,
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
