const secret_config = require('./secret');
const { response } = require("./response")
const { errResponse } = require("./response")
const baseResponse = require("./baseResponseStatus");

const getAccessToken = async (options) => {
    try {
        return await fetch(options.url, {
            method: 'POST',
            headers: {
                'content-type':'application/x-www-form-urlencoded;charset=utf-8'
            },
            body: qs.stringify({
                grant_type: 'authorization_code',//특정 스트링
                client_id: options.clientID,
                client_secret: options.clientSecret,
                redirectUri: options.redirectUri,
                code: options.code,
            }),
        }).then(res => res.json());
    }catch(e) {
        logger.info("error", e);
    }
};