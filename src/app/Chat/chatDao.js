
// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 모든 유저 조회
async function selectChatList(connection, kakaoUserIdx) {
  const selectChatListQuery = `
                SELECT email, nickname 
                FROM ChatList CL INNER JOIN OherUser OU ON CL.otherUserIdx = OU.otherUserIdx
                WHERE CL.kakaoUserIdx = ?;
                `;
  const [chatRows] = await connection.query(selectChatListQuery, kakaoUserIdx);
  return chatRows;
}

// 이메일로 회원 조회
async function selectchatEmail(connection, email) {
  const selectchatEmailQuery = `
                SELECT email, nickname 
                FROM chatInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectchatEmailQuery, email);
  return emailRows;
}

// chatId 회원 조회
async function selectchatId(connection, chatId) {
  const selectchatIdQuery = `
                 SELECT id, email, nickname 
                 FROM chatInfo 
                 WHERE id = ?;
                 `;
  const [chatRow] = await connection.query(selectchatIdQuery, chatId);
  return chatRow;
}

// 유저 생성
async function insertchatInfo(connection, insertchatInfoParams) {
  const insertchatInfoQuery = `
        INSERT INTO chatInfo(email, password, nickname)
        VALUES (?, ?, ?);
    `;
  const insertchatInfoRow = await connection.query(
    insertchatInfoQuery,
    insertchatInfoParams
  );

  return insertchatInfoRow;
}

// 패스워드 체크
async function selectchatPassword(connection, selectchatPasswordParams) {
  const selectchatPasswordQuery = `
        SELECT email, nickname, password
        FROM chatInfo 
        WHERE email = ? AND password = ?;`;
  const selectchatPasswordRow = await connection.query(
      selectchatPasswordQuery,
      selectchatPasswordParams
  );

  return selectchatPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectchatAccount(connection, email) {
  const selectchatAccountQuery = `
        SELECT status, id
        FROM chatInfo 
        WHERE email = ?;`;
  const selectchatAccountRow = await connection.query(
      selectchatAccountQuery,
      email
  );
  return selectchatAccountRow[0];
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
  selectchatEmail,
  selectchatId,
  insertchatInfo,
  selectchatPassword,
  selectchatAccount,
  updatechatInfo,
};
