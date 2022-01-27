
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 채팅목록 조회
async function selectChatList(connection, kakaoUserIdx) {
  const selectChatListQuery = `
          SELECT CL.chatName AS chat_name, CL.profileImg AS profile_img, CL.postTime AS latest_time, CL.message AS latest_message
          FROM (SELECT (CASE WHEN C.groupName is null THEN OU.nickname ELSE C.groupName END) AS chatName,
                       (CASE WHEN C.groupName is null THEN OU.profileImgUrl ELSE null END) AS profileImg,
                       C.postTime as postTime, C.message as message
                FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
                WHERE C.status != 'DELETED' AND OU.kakaoUserIdx = ?
                ORDER BY postTime DESC
                  LIMIT 18446744073709551615) CL
          GROUP BY CL.chatName;
          `;
  const [chatListRows] = await connection.query(selectChatListQuery, kakaoUserIdx);
  return chatListRows;
}

// 갠톡 채팅 조회
async function selectPersonalChats(connection, userIdx, otherUserIdx) {
  const selectPersonalChatQuery = `
          SELECT OU.nickname, OU.profileImgUrl, C.message,
                 (CASE
                    WHEN TIMESTAMPDIFF(DAY, C.postTime, NOW()) >= 1 THEN C.postTime
                    ELSE null
                   END) AS chat_date,
                 C.postTime AS post_time
            #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED' AND C.otherUserIdx = ? AND groupName is null
          ORDER BY C.postTime DESC;
          `;
  const [chatRows] = await connection.query(selectPersonalChatQuery, [userIdx, otherUserIdx]);
  return chatRows;
}

// 단톡 채팅 조회
async function selectGroupChats(connection, userIdx, groupName) {
  const selectGroupChatQuery = `
          SELECT OU.nickname, OU.profileImgUrl, C.message,
                 (CASE
                    WHEN TIMESTAMPDIFF(DAY, C.postTime, NOW()) >= 1 THEN C.postTime
                    ELSE null
                   END) AS chat_date,
                 C.postTime AS post_time
            #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE OU.kakaoUserIdx = ? AND C.status != 'DELETED' AND groupName = ?
          ORDER BY C.postTime DESC;
          `;
  const [chatRows] = await connection.query(selectGroupChatQuery, [userIdx, groupName]);
  return chatRows;
}

// 폴더 채팅 조회
async function selectFolderChats(connection, userIdx, folderIdx) {
  const selectFolderChatQuery = `
          SELECT FI.folderName, OU.nickname, OU.profileImgUrl, C.message,
               (CASE
                  WHEN TIMESTAMPDIFF(DAY, C.postTime, NOW()) >= 1 THEN C.postTime
                  ELSE null
                 END) AS chat_date,
               C.postTime AS post_time
              #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx INNER JOIN FolderInfo FI on C.folderIdx = FI.folderIdx
          WHERE OU.kakaoUserIdx = ? AND C.folderIdx = ? AND C.status != 'DELETED'
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
        WHERE chatIdx = ? AND status != 'DELETED';
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

// 채팅 삭제
async function deleteChat(connection, chatIdx) {
  const deleteChatQuery = `
        UPDATE Chat
        SET status = 'DELETED'
        WHERE chatIdx = ?;
        `;
  const [deleteChatRow] = await connection.query(deleteChatQuery, chatIdx);
  return deleteChatRow;
}

// 갠톡 채팅 전체 삭제
async function deleteUserChat(connection, otherUserIdx) {
  const deleteAllChatsQuery = `
        UPDATE Chat
        SET status = 'DELETED'
        WHERE otherUserIdx = ? AND groupName is null;
        `;
  const [deleteChatsRow] = await connection.query(deleteAllChatsQuery, otherUserIdx);
  return deleteChatsRow;
}

// 단톡 채팅 전체 삭제
async function deleteGroupChat(connection, userIdx, groupName) {
  const deleteAllChatsQuery = `
        UPDATE Chat C
        INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
        SET C.status = 'DELETED'
        WHERE OU.kakaoUserIdx = ? AND C.groupName = ?;
        `;
  const [deleteChatsRow] = await connection.query(deleteAllChatsQuery, [userIdx, groupName]);
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


module.exports = {
    selectChatList,
    selectPersonalChats,
    selectGroupChats,
    selectFolderChats,
    selectChat,
    selectUserChat,
    selectGroupChat,
    selectDeleteChat,
    selectBlockedUser,
    selectBlockedChat,
    deleteChat,
    deleteUserChat,
    deleteGroupChat,
    selectExistingUser,
    insertNewUserInfo,
    insertChatInfo,

};
