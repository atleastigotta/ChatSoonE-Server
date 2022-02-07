module.exports = function(app){
    const uploads = require('./uploadController');
    const multer = require('multer');

    let storage = multer.diskStorage({
        // destination: function (req, file, cb){
        //     // cb(null, path.join(__dirname, '../uploads/images/'))
        //     cb(null, __dirname)
        // },
        destination: './images',
        filename: function (req, file, cb){
            cb(null, file.originalname)
        }
    });

    // const upload = multer({dest: 'images/'});
    const upload = multer({storage: storage});

    // 1. 이미지 업로드 테스트 API
    app.post('/app/upload-image', upload.single('img'), uploads.uploadImg);

    // app.post('/upload', upload.single('img'), (req, res) => {
    //     res.json(req.file)
    //     console.log(req.file)
    // })

    // 2. 이미지 불러오기 테스트 API
    app.get('/app/load-image/:file_name', uploads.loadImg);

    // 3. 이미지 다운로드 테스트 API
    app.get('/app/download-image/:file_name', uploads.downloadImg);

};
