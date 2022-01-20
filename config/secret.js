// TODO: 해당 KEY 값들을 꼭 바꿔서 사용해주세요!
// TODO: .gitignore에 추가하는거 앚지 마세요!
module.exports = {
    'jwtsecret' : '',

    'CLIENT_ID' :  'd78a94142d0c7f4e304d6a19a3b20844',
    'REDIRECT_URI' : 'http://localhost:3000/kakao/oauth',
    'KAKAO_AUTH_URL' : 'https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code'
};

// const CLIENT_ID = 'd78a94142d0c7f4e304d6a19a3b20844';
// const REDIRECT_URI = 'http://localhost:3000/kakao/oauth';
//
// export const KAKAO_AUTH_URL = 'https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code'