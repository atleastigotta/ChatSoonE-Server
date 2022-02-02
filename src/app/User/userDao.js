// 새롭게 추가한 함수를 아래 부분에서 export 해줘야 외부의 Provider, Service 등에서 사용가능합니다.

// 회원 존재 여부 확인
async function selectKakaoUser(connection, userIdx) {
    const selectKakaoUserQuery = `
        SELECT *
        FROM MeUser 
        WHERE kakaoUserIdx = ? AND status != 'DELETED'
        ;
        `;
    const [selectKakaoUserRow] = await connection.query(selectKakaoUserQuery, userIdx);

    return selectKakaoUserRow;
}

// 카카오 회원 추가하기
async function addUser(connection, userIdx) {
    const insertUserQuery = `
        INSERT INTO MeUser (kakaoUserIdx)
        VALUE (?)
        ;
        `;
    const [insertUserRow] = await connection.query(insertUserQuery, userIdx);

    return insertUserRow;
}

module.exports = {
    selectKakaoUser,
    addUser
};
