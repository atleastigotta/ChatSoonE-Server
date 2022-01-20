const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const fs = require('fs');
const path = require('path');

/**
 * API No. 1
 * API Name : 이미지 업로드 테스트 API
 * [GET] /app/upload-image
 */
exports.uploadImg = async function (req, res){
    console.log(req.file);

    if(!req.file) return res.send(errResponse(baseResponse.IMAGE_EMPTY));

    const fileInfo = req.file;

    // return res.json(req.file);
    return res.send(response(baseResponse.SUCCESS, {fileInfo}));
}

/**
 * API No. 2
 * API Name : 이미지 불러오기 테스트 API
 * [GET] /app/load-image/:file_name
 */
exports.loadImg = async function (req, res){
    const uploaded_filepath = './images/';      // 서버에 이미지가 업로드된 폴더 경로
    const uploadedImg = uploaded_filepath + req.params.file_name;   // ex. images/sample.png

    // 이미지 데이터 자체를 반환하는 것
    if(fs.existsSync(uploadedImg)){     // 이미지가 존재하는지 체크
        fs.readFile(uploadedImg, function (err, data){
            if(err){
                console.log(err);
                const default_filename = "defaltImg.png";
                const filePath = '/images/' + default_filename;
                fs.readFile(filePath,
                    function (err, data)
                    {
                        console.log(filePath);
                        console.log(data);
                        res.end(data);
                    });
            } else{
                console.log(data);
                res.end(data);
            }
        })

    } else{
        return res.send(errResponse(baseResponse.IMAGE_NOT_EXISTS));
    }
}

/**
 * API No. 3
 * API Name : 이미지 다운로드 테스트 API
 * [GET] /app/download-image/:file_name
 */
exports.downloadImg = async function (req, res, next){
    const uploaded_filepath = './images/';      // 서버에 이미지가 업로드된 폴더 경로
    const uploadedImg = uploaded_filepath + req.params.file_name;   // ex. images/sample.png

    // 이미지를 .png로 다운로드 받는 것
    if(fs.existsSync(uploadedImg)){     // 이미지가 존재하는지 체크
        const filename = path.basename(uploadedImg);    // 파일 경로에서 파일명(확장자포함)만 추출
        res.setHeader('Content-disposition', 'attachment; filename=' + filename);   // 다운 받아질 파일명 설정

        const filestream = fs.createReadStream(uploadedImg);
        filestream.pipe(res);

        return;
        // return res.send(response(baseResponse.SUCCESS));
    } else{
        return res.send(errResponse(baseResponse.IMAGE_NOT_EXISTS));
    }
}
