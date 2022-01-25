
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 채팅목록 조회
async function selectChatList(connection, kakaoUserIdx) {
  const selectChatListQuery = `
          SELECT (IF(CL.groupName is null, CL.nickname, CL.groupName)) AS chat_name,
                 ANY_VALUE(IF(CL.groupName is null, CL.profileImgUrl, null)) AS profileImg,
                 ANY_VALUE(CL.postTime) AS latest_time, ANY_VALUE(CL.message) AS latest_message
          FROM (SELECT C.kakaoUserIdx, C.otherUserIdx, C.groupName, C.message, C.postTime, C.status AS chat_status, OU.nickname, OU.profileImgUrl, OU.status AS user_status
                FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
                WHERE kakaoUserIdx = ? AND C.status != 'DELETED'
                ORDER BY C.postTime DESC
                  limit 18446744073709551615
               ) AS CL
          GROUP BY chat_name
          ORDER BY latest_time DESC;
          `;
  const [chatListRows] = await connection.query(selectChatListQuery, kakaoUserIdx);
  return chatListRows;
}

// 갠톡 채팅 조회
async function selectPersonalChat(connection, userIdx, otherUserIdx) {
  const selectPersonalChatQuery = `
          SELECT OU.nickname, OU.profileImgUrl, C.message,
                 (CASE
                    WHEN TIMESTAMPDIFF(DAY, C.postTime, NOW()) >= 1 THEN C.createdAt
                    ELSE null
                   END) AS chat_date,
                 C.postTime
                           #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE kakaoUserIdx = ? AND C.status != 'DELETED' AND C.otherUserIdx = ? AND groupName is null;
          `;
  const [chatRows] = await connection.query(selectPersonalChatQuery, [userIdx, otherUserIdx]);
  return chatRows;
}

// 단톡 채팅 조회
async function selectGroupChat(connection, userIdx, groupName) {
  const selectGroupChatQuery = `
          SELECT OU.nickname, OU.profileImgUrl, C.message,
                 (CASE
                    WHEN TIMESTAMPDIFF(DAY, C.postTime, NOW()) >= 1 THEN C.createdAt
                    ELSE null
                   END) AS chat_date,
                 C.postTime
                           #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx
          WHERE kakaoUserIdx = ? AND C.status != 'DELETED' AND groupName = ?;
          `;
  const [chatRows] = await connection.query(selectGroupChatQuery, [userIdx, groupName]);
  return chatRows;
}

// 폴더 채팅 조회
async function selectFolderChat(connection, userIdx, folderIdx) {
  const selectFolderChatQuery = `
          SELECT FI.folderName, OU.nickname, OU.profileImgUrl, C.message,
                 (CASE
                    WHEN TIMESTAMPDIFF(DAY, C.postTime, NOW()) >= 1 THEN C.createdAt
                    ELSE null
                   END) AS chat_date,
                 C.postTime
                           #DATE_FORMAT(C.postTime, '%H:%i') AS post_time
          FROM Chat C INNER JOIN OtherUser OU on C.otherUserIdx = OU.otherUserIdx INNER JOIN FolderInfo FI on C.folderIdx = FI.folderIdx
          WHERE C.kakaoUserIdx = ? AND C.folderIdx = ? AND C.status != 'DELETED';
          `;
  const [chatRows] = await connection.query(selectFolderChatQuery, [userIdx, folderIdx]);
  return chatRows;
}

// 채팅 체크
async function selectChat(connection, chatIdx) {
  const selectChatQuery = `
        SELECT *
        FROM Chat 
        WHERE chatIdx = ?;
        `;
  const [selectChatRow] = await connection.query(selectChatQuery, chatIdx);

  return selectChatRow;
}

// 갠톡 채팅 체크
async function selectUserChat(connection, userIdx, otherUserIdx) {
  const selectChatQuery = `
        SELECT *
        FROM Chat 
        WHERE kakaoUserIdx = ? AND otherUserIdx = ?;
        `;
  const [selectChatRow] = await connection.query(selectChatQuery, [userIdx, otherUserIdx]);

  return selectChatRow;
}

// 단톡 채팅 체크
async function selectGroupChat(connection, userIdx, groupName) {
  const selectChatQuery = `
        SELECT *
        FROM Chat 
        WHERE kakaoUserIdx = ? AND groupName = ?;
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

// 차단된 갠톡(유저) 체크
async function selectBlockedUser(connection, userIdx, otherUserIdx) {
  const selectBlockedUserQuery = `
        SELECT *
        FROM Chat C
        WHERE kakaoUserIdx = ? AND otherUserIdx = ? AND groupName is null AND status = 'BLOCKED';
        `;
  const [selectBlockedUserRow] = await connection.query(selectBlockedUserQuery, [userIdx, otherUserIdx]);
  return selectBlockedUserRow;
}

// 차단된 톡방 체크
async function selectBlockedChat(connection, userIdx, groupName) {
  const selectBlockedChatQuery = `
        SELECT *
        FROM Chat C
        WHERE kakaoUserIdx = ? AND groupName = ? AND status = 'BLOCKED';
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
async function deleteUserChat(connection, userIdx, otherUserIdx) {
  const deleteAllChatsQuery = `
          UPDATE Chat
          SET status = 'DELETED'
          WHERE kakaoUserIdx = ? AND otherUserIdx = ? AND groupName is null;
          `;
  const [deleteChatsRow] = await connection.query(deleteAllChatsQuery, [userIdx, otherUserIdx]);
  return deleteChatsRow;
}

// 단톡 채팅 전체 삭제
async function deleteGroupChat(connection, userIdx, groupName) {
  const deleteAllChatsQuery = `
          UPDATE Chat
          SET status = 'DELETED'
          WHERE kakaoUserIdx = ? AND groupName = ?;
          `;
  const [deleteChatsRow] = await connection.query(deleteAllChatsQuery, [userIdx, groupName]);
  return deleteChatsRow;
}

// 채팅 추가
async function insertChatInfo(connection, userIdx, otherUserIdx, groupName, message, postTime) {
  const insertChatInfoQuery = `
          INSERT INTO Chat(kakaoUserIdx, otherUserIdx, groupName, message, postTime)
          VALUES (?, ?, ?, ?, ?);
          `;
  const insertChatInfoRow = await connection.query(insertChatInfoQuery, [userIdx, otherUserIdx, groupName, message, postTime]);

  return insertChatInfoRow;
}


async function updatechatInfo(connection, id, nickname) {
  const updatechatQuery = `
  UPDATE chatInfo 
  SET nickname = ?
  WHERE id = ?;`;
  const updatechatRow = await connection.query(updatechatQuery, [nickname, id]);
  return updatechatRow[0];
}


module.exports = {
  selectChatList,
  selectPersonalChat,
  selectGroupChat,
  selectFolderChat,
  selectChat,
  selectUserChat,
  selectGroupChat,
  selectDeleteChat,
  selectBlockedUser,
  selectBlockedChat,
  deleteChat,
  deleteUserChat,
  deleteGroupChat,
  insertChatInfo,

  updatechatInfo,
};
