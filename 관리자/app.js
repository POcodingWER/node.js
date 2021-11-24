const express = require('express');
const nunjucks = require('nunjucks');

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const redis = require('redis');
// const RedisStore = require('connect-redis')(session);

const cookieParser = require('cookie-parser');
const session = require('express-session');
const wedSocket=require('./socket')//채팅소스
const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD,
});

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');

const {
    sequelize
} = require('./models');

const passport = require('passport');
const passportConfig = require('./passport');
const app = express();
passportConfig();



// db 임시 선언
const User = require('./models/user');
const Notice = require('./models/notice');
const Forum = require('./models/forum');
const Noticeboard = require('./models/noticeboard');

const {
    isLoggedIn,
    isNotLoggedIn
} = require('./routes/middlewares');
const bcrypt = require('bcrypt');

// 여기서 부터 설정

app.set('port', process.env.PORT || 8001);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});


// 여기 경로가 axios 경로
app.use(express.static(path.join(__dirname, 'public')));
app.use('/boardImg', express.static(path.join(__dirname, 'uploads')));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

sequelize.sync({
        force: false
    })
    .then(() => {
        console.log('데이터베이스 연결 성공');
    })
    .catch((err) => {
        console.error(err);
    })


app.use(cookieParser(process.env.COOKIE_SECRET));
const sessionOption = {
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    // store: new RedisStore({
    //     client: redisClient
    // }),
};
if (process.env.NODE_ENV === 'production') {
    sessionOption.proxy = true;
    // sessionOption.cookie.secure = true;
}

app.use(session(sessionOption));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', pageRouter); //메인페이지
app.use('/auth', authRouter);


// 여기서 부터 설정

// 나 자신 전역변수 설정
app.use(async (req, res, next) => {
    try {
        res.locals.user = req.user;
        next();
    } catch (err) {
        next(err);
    }

})



//CRUD 4개
app.get('/notice', async (req, res, next) => {
    try {

        const notices = await Notice.findAll();

        res.render('통합본', {
            notices
        });
    } catch (err) {
        next(err);
    }
});

app.get('/notice/:id', async (req, res, next) => {
    try {

        const aa = await sequelize.query(`SELECT date_format(createdAt, '%y-%m-%d') from notices`);
        const notices = await Notice.findAll();
        const pra = await req.params.id;
        const count = await (notices[pra-1].noticeCount)+1;
        await Notice.update({
            noticeCount : count,
        }, {
            where: {
                id: pra
            }
        });
        res.render('통합본', {
            notices
        });
    } catch (err) {
        next(err);
    }
});

app.post('/notice', async (req, res, next) => {

    try {
        const {
            noticeName,
            noticeBody
        } = await req.body;

        const notice = await Notice.create({
            noticeName,
            noticeBody,
            // Administrator: req.user.id,
        });
        res.redirect('/notice');
    } catch (err) {
        next(err);
    }
})

app.get('/water/:id', async (req, res, next) => {
    try {
        const pra = await req.params.id;
        console.log(pra);
        res.render('수정', {
            pra
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/water/water2', async (req, res, next) => {

    const {
        prac,
        waterName,
        waterBody
    } = await req.body;

    console.log(waterName);
    console.log(prac);
    try {
        const notice = await Notice.update({
            noticeName: waterName,
            noticeBody: waterBody,
        }, {
            where: {
                id: prac
            }
        });


        res.redirect('/');
    } catch (err) {
        console.log(err);
        next(err);
    }
});
// CRUD 끝


//CRUD 4개
app.get('/forum', async (req, res, next) => {
    try {

        const forums = await Forum.findAll();

        res.render('포럼', {
            forums
        });
    } catch (err) {
        next(err);
    }
});

app.get('/forum/:id', async (req, res, next) => {
    try {

        const forums = await Forum.findAll();
        const pra = await req.params.id;
        const count = await (forums[pra-1].forumCount)+1;
        await Forum.update({
            forumCount : count,
        }, {
            where: {
                id: pra
            }
        });
        res.render('포럼', {
            forums
        });
    } catch (err) {
        next(err);
    }
});

app.post('/forum', async (req, res, next) => {

    try {
        const {
            forumName,
            forumDate,
            forumPlace,
            forumHost,
        } = await req.body;

        const forum = await Forum.create({
            forumName,
            forumDate,
            forumPlace,
            forumHost,
            // Administrator: req.user.id,
        });
        res.redirect('/forum');
    } catch (err) {
        next(err);
    }
})

app.get('/water2/:id', async (req, res, next) => {
    try {
        const pra = await req.params.id;
        console.log(pra);
        res.render('수정2', {
            pra
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

app.post('/water2/water2', async (req, res, next) => {

    const {
        prac,
        waterName,
        waterDate,
        waterPlace,
        waterHost,
    } = await req.body;

    console.log(waterName);
    console.log(prac);
    try {
        const forum = await Forum.update({
            forumName : waterName,
            forumDate : waterDate,
            forumPlace: waterPlace,
            forumHost: waterHost,
        }, {
            where: {
                id: prac
            }
        });


        res.redirect('/forum');
    } catch (err) {
        console.log(err);
        next(err);
    }
});
// CRUD 끝


app.get('/board', async (req, res, next) => {
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



app.post('/board/post/boardImg', cpUpload, async (req, res, next) => {

    let array = [];
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

app.post('/board/post', upload2.any(), async (req, res, next) => {
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
            // Writer : req.user.id,
        });
        res.redirect('/');


    } catch (err) {
        next(err);
    }
})



// RUD
app.get('/array', async (req, res, next) => {
    // 렌더링 표시
    try {
        // 특정 아이디 안적어줌 아직
        const updates = await Noticeboard.findAll();
        return res.render('게시물 나열하는 창', {
            updates
        });
    } catch (err) {
        next(err);
    }
})

app.get('/look/:id', async (req, res, next) => {
    // 렌더링 표시
    try {
        // 특정 아이디 안적어줌 아직
        const notices = await Noticeboard.findAll();
        const pra = await req.params.id;
        const count = await (notices[pra-1].boardCount)+1;
        await Noticeboard.update({
            boardCount : count,
        }, {
            where: {
                id: pra
            }
        });

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


// update create 내용 복붙 들어가야함 아 코드 개더럽네 

app.get('/update/:id', async (req, res, next) => {
    // 렌더링 표시
    try {
        const pra = req.params.id;
        const updates1 = await Noticeboard.findAll({
            where: {
                id: pra
            }
        });
        res.render('게시물 수정', {
            updates1
        });
    } catch (err) {
        next(err);
    }
})


const upload3 = multer();

app.post('/board/update', upload3.any(), async (req, res, next) => {
    try {

        console.log(req.files);
        console.log(req.body);

        const {
            boardName,
            boardBody,
            number
        } = await req.body;

        const notice = await Noticeboard.update({
            boardName,
            boardBody,
        }, {
            where: {
                id: number
            }
        });
        res.redirect('/');


    } catch (err) {
        next(err);
    }
})

app.get('/index', async (req, res, next) => {
    try {
        res.render('채팅', {
        });
    } catch (err) {
        next(err);
    }
});


app.get('/usersinfomation', async (req, res, next) => {
    try {
        const users = await User.findAll();
         res.render('유저정보모음집', {
           title : '내정보 - NodeBird', users : users,
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
})




// 끝 설정
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
})

app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// app.listen(app.get('port'), () => {
//     console.log(app.get('port'), '번 포트에서 대기 중');
// });

const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
  });

  wedSocket(server);