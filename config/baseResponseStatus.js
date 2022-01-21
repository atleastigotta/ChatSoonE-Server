//Response로 보내줄 상태코드와 메세지 등을 이 파일에서 관리함

module.exports = {

    // Success
    SUCCESS : { "isSuccess": true, "code": 1000, "message":"성공" },

    // Common
    TOKEN_EMPTY : { "isSuccess": false, "code": 5000, "message":"JWT 토큰을 입력해주세요." },
    TOKEN_VERIFICATION_FAILURE : { "isSuccess": false, "code": 5001, "message":"JWT 토큰 검증 실패" },
    TOKEN_VERIFICATION_SUCCESS : { "isSuccess": true, "code": 1001, "message":"JWT 토큰 검증 성공" }, // ?

    //Request error
    IMAGE_EMPTY : { "isSuccess": false, "code": 2000, "message":"업로드할 이미지를 선택해주세요." },
    IMAGE_NOT_EXISTS : { "isSuccess": false, "code": 2001, "message":"이미지가 존재하지 않습니다." },

    USER_ID_EMPTY : { "isSuccess": false, "code": 2050, "message":"회원 아이디를 입력해주세요." },

    // Response error


    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
