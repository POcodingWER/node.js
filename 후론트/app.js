const express = require('express');
const nunjucks = require('nunjucks');

const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const cookieParser = require('cookie-parser');
const session = require('express-session');

const morgan = require('morgan');
const dotenv = require('dotenv');
dotenv.config();

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const boardRouter = require('./routes/board');
const profileRouter = require('./routes/profile');
const seebal = require('./routes/seebal');
const wedSocket = require('./socket') //채팅소스

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
const Noticeboard = require('./models/noticeboard');

const {
    isLoggedIn,
    isNotLoggedIn
} = require('./routes/middlewares');

// 여기서 부터 설정

app.set('port', process.env.PORT || 8000);
app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});


// 여기 경로가 axios 경로
app.use('/', express.static(path.join(__dirname, '/public')));
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
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
}));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', pageRouter); //메인페이지
app.use('/auth', authRouter);
app.use('/board', boardRouter);
app.use('/profile', profileRouter);
app.use('/maile', seebal);





//CRUD 4개
app.get('/notice', async (req, res, next) => {
    try {
        const notices = await Notice.findAll();
        res.render('공지사항', {
            notices
        });
    } catch (err) {
        next(err);
    }
});

app.get('/notice/:id', async (req, res, next) => {
    try {
        const num = await req.params.id;
        const notices = await Notice.findAll({}, {
            where: {
                id: num
            }
        });
        const count = await (notices[num - 1].noticeCount) + 1;
        console.log(notices);
        await Notice.update({
            noticeCount: count,
        }, {
            where: {
                id: num
            }
        });
        res.render('공지사항 보기', {
            notices
        });
    } catch (err) {
        next(err);
    }
});



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

app.post('/update', upload3.any(), async (req, res, next) => {
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
        res.redirect('/board');


    } catch (err) {
        next(err);
    }
})



// 내 정보
app.get('/mypage', async (req, res, next) => {
    // 렌더링 표시
    try {
        // 특정 아이디 안적어줌 아직
        // const updates = await Noticeboard.findAll({where : { Writer : req.user.id}});
        return res.render('내 정보 창', );
    } catch (err) {
        next(err);
    }
})


// 아이디, 비밀번호 재설정
app.get('/reid', async (req, res, next) => {
    try {
        res.render('아이디가 기억이 안날 때');
    } catch (err) {
        next(err);
    }
})

app.post('/reid', async (req, res, next) => {
    try {
        console.log(req.body.userMail);
        let wxUser = await User.findAll({
            where: {
                userMail: req.body.userMail,
            }
        });
        console.log(wxUser);
        if (wxUser.length > 0) {
            res.render('아이디 알려주기', {
                wxUser
            });
        } else {
            res.send('이메일이 존재하지 않습니다');
        }
    } catch (err) {
        next(err);
    }
})

app.get('/repwd', async (req, res, next) => {
    try {
        res.render('비밀번호가 기억이 안날 때');
    } catch (err) {
        next(err);
    }
})

app.post('/repwd', async (req, res, next) => {
    try {
        const cxUser = await User.findAll({
            where: {
                userMail: req.body.userMail
            }
        });
        if (cxUser) {
            const token = crypto.randomBytes(20).toString('hex');
            console.log(token);
            const data = { // 데이터 정리
                token,
                ttl: 300 // ttl 값 설정 (5분)
            };
            const dxUser = await User.update({
                token: token,
            }, {
                where: {
                    userMail: req.body.userMail
                }
            });


            const nodemailer = require('nodemailer');
            // nodemailer Transport 생성
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                port: 587,
                secure: false, // true for 465, false for other ports
                auth: { // 이메일을 보낼 계정 데이터 입력
                    user: 'ponyoholics@gmail.com',
                    pass: 'vnfmsgksmf7',
                },
            });
            const emailOptions = { // 옵션값 설정
                from: 'Ateam@co.ke',
                to: 'andy3638@naver.com',
                subject: '비밀번호 초기화 이메일입니다.',
                html: `비밀번호 초기화를 위해서는 아래의 URL을 클릭하여 주세요. <br></br>    
                <a href=http://localhost:8000/reset/${token}>링크 클릭</a>`,
            };
            transporter.sendMail(emailOptions, (err, data) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({
                        status: "fail"
                    });
                } else {
                    res.status(200).json({
                        status: "success"
                    });
                }
            });

        } else {
            alert('이메일이 존재하지 않습니다');
        }
    } catch (err) {
        next(err);
    }
})

app.get('/reset/:id', async (req, res, next) => {
    try {
        const qqq = req.params.id;
        res.render('비밀번호 재설정',{qqq});
    } catch (err) {
        next(err);
    }
})

app.post('/reset', async (req, res, next) => {
    try {
        const {rePwd,qqq1} = req.body;
        console.log(qqq1);
        const cxUser = await User.findAll({
            where: {
                token: qqq1
            },
            // created: {
            //     greater: new Date.now() - ttl
            // }
        });

        if (cxUser) {
            const hash = await bcrypt.hash(rePwd, 12);
            const dxUser = await User.update({
                userPwd: hash,
            }, {
                where: {
                    token: qqq1
                }
            });
            res.redirect('/');
        } else {
            alert('오류입니다');
        }
    } catch (err) {
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