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
    CHAT_OPPONENT_ID_EMPTY : { "isSuccess": false, "code": 2051, "message":"채팅내역 상대 아이디를 입력해주세요." },
    CHAT_OPPONENT_NICKNAME_EMPTY : { "isSuccess": false, "code": 2052, "message":"채팅내역 상대의 닉네임을 입력해주세요." },
    CHAT_OPPONENT_EMPTY : { "isSuccess": false, "code": 2053, "message":"채팅 상대를 입력해주세요." },
    CHAT_OPPONENT_INVALID : { "isSuccess": false, "code": 2054, "message":"채팅내역 상대를 잘못 입력하였습니다." },
    FOLDER_ID_EMPTY : { "isSuccess": false, "code": 2055, "message":"폴더 아이디를 입력해주세요." },
    CHAT_ID_EMPTY : { "isSuccess": false, "code": 2056, "message":"채팅 아이디를 입력해주세요." },
    CHAT_NAME_EMPTY : { "isSuccess": false, "code": 2057, "message":"채팅방 이름을 입력해주세요." },
    MESSAGE_EMPTY : { "isSuccess": false, "code": 2058, "message":"메시지를 입력해주세요." },
    POST_TIME_EMPTY : { "isSuccess": false, "code": 2059, "message":"전송 시간을 입력해주세요." },

    // Response error
    CHAT_NOT_EXISTS : { "isSuccess": false, "code": 3000, "message":"해당 채팅이 존재하지 않습니다." },
    CHAT_ALREADY_DELETED : { "isSuccess": false, "code": 3001, "message":"이미 삭제된 채팅입니다." },
    OPPONENT_NOT_EXISTS : { "isSuccess": false, "code": 3002, "message":"해당 상대가 존재하지 않습니다." },
    GROUP_NOT_EXISTS : { "isSuccess": false, "code": 3003, "message":"해당 단톡방이 존재하지 않습니다." },
    CHATLIST_NOT_EXISTS : { "isSuccess": false, "code": 3004, "message":"해당 톡방이 존재하지 않습니다." },
    CHATLIST_ALREADY_BLOCKED : { "isSuccess": false, "code": 3005, "message":"해당 톡방이 이미 차단되어 있습니다." },

    POST_TIME_WRONG : { "isSuccess": false, "code": 3006, "message":"전송시간이 잘못 되었습니다." },
    CHAT_NOT_EXISTS_IN_FOLDER : { "isSuccess": false, "code": 3007, "message":"해당 채팅이 해당 폴더에 존재하지 않습니다." },
    CHAT_ALREADY_EXISTS_IN_FOLDER : { "isSuccess": false, "code": 3008, "message":"해당 채팅이 이미 해당 폴더에 있습니다." },

    //Connection, Transaction 등의 서버 오류
    DB_ERROR : { "isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"},
    SERVER_ERROR : { "isSuccess": false, "code": 4001, "message": "서버 에러"},
 
 
}
