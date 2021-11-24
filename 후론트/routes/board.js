const express = require('express');
const {
    isLoggedIn,
    isNotLoggedIn
} = require('./middlewares'); //미들웨어에 만든거 가져와서 추가

const multer = require('multer');
const path = require('path');
const fs = require('fs');


const User = require('../models/user');
const Noticeboard = require('../models/noticeboard');
const Profile = require('../models/profile');

const router = express.Router();



router.get('/', isLoggedIn, async (req, res, next) => {
    try {
        const updates = await Noticeboard.findAll();
        const user = await User.findOne({include :[{model : Noticeboard,}]});
        console.log(user);
        res.render('게시물 나열하는 창', {
            user,
            updates,
        });
    } catch (err) {
        next(err);
    }
});

router.get('/go', async (req, res, next) => {
    try {
        res.render('게시물 등록');
    } catch (err) {
        next(err);
    }
});


// 멀터 설정
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            // 파일 저장 위치
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            // 파일 이름 설정
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    // 제한 조건 아직 미정의
    limits: {
        fileSize: 5 * 1024 * 1024
    },
});


// 여기에 폼의 이름과 max 설정하고 입력하자 그게 편할듯
// name 잘 못써주면 unexpected fields 오류난덩
const cpUpload = upload.fields([{
    name: 'boardImg',
    maxCount: 100
}])

// const cpUpload = upload.array('boardImg', 4);
// const cpUpload = upload.single('boardImg');



router.post('/post/boardImg', cpUpload, async (req, res, next) => {

    let array = [];
    console.log(req.files);
    for (i = 0; i < req.files.boardImg.length; i++) {
        array[i] = req.files.boardImg[i].filename;
    }
    console.log(array);

    try {
        res.json(array);
    } catch (err) {
        next(err);
    }
})

const upload2 = multer();

router.post('/post', upload2.any(), async (req, res, next) => {
    try {

        console.log(req.files);
        console.log(req.body);

        const {
            boardCategory,
            boardName,
            boardBody,
        } = await req.body;

        const notice = await Noticeboard.create({
            boardCategory,
            boardName,
            boardBody,
            Writer: req.user.id,
        });
        res.redirect('/board');


    } catch (err) {
        next(err);
    }
})


router.get('/:id', async (req, res, next) => {
    // 렌더링 표시
    try {
        // 특정 아이디 안적어줌 아직
        const pra = await req.params.id;
        const updates = await Noticeboard.findAll({
            where: {
                id: pra
            }
        });
        return res.render('게시물 보기', {
            updates
        });
    } catch (err) {
        next(err);
    }
})


module.exports = router;